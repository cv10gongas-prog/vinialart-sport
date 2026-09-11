import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import {
  SHIN_GUARD_CONTOUR_POINTS,
} from "@/lib/customizer/configs/caneleiras";
import { FLAG_CONTOUR_POINTS } from "@/lib/customizer/configs";
import type {
  ProductCustomizerConfig,
  Surface,
} from "@/lib/customizer/types";
import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";
import { cn } from "@/lib/utils";
import { RotateCw, ZoomIn, ZoomOut, Compass } from "lucide-react";

interface Product3DViewerProps {
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
  className?: string;
  onFallbackTo2D?: () => void;
}

/**
 * Procedural 3D Viewer using exact Single-Source-of-Truth contour points.
 * Features:
 * - Direct 3D mesh (ExtrudeGeometry with bevel & curvature for Shin Guard, subdivided wave mesh for Flag)
 * - True studio PBR lighting (Key light, Fill light, Rim light, Floor contact shadow)
 * - CanvasTexture generated dynamically from the exact 2D Konva stage artwork (zero offset)
 * - Interactive Orbit controls (drag to rotate, scroll/pinch to zoom, preset view angles)
 * - Graceful fallback to 2D if WebGL is unavailable
 */
export function Product3DViewer({
  config,
  customizer,
  className,
  onFallbackTo2D,
}: Product3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeAngle, setActiveAngle] = useState<"front" | "threeQuarterLeft" | "threeQuarterRight" | "back">("front");

  // Pointer drag state for smooth 3D rotation
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotTargetRef = useRef({ x: 0, y: 0 });
  const zoomTargetRef = useRef(3.5);

  const isShinGuard = config.id === "caneleiras-personalizadas";
  const isFlag = config.id === "bandeira-personalizada";

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        onFallbackTo2D?.();
      }
    } catch {
      setHasWebGL(false);
      onFallbackTo2D?.();
    }
  }, [onFallbackTo2D]);

  // Texture Generator from Konva Stage
  const updateTextureFromKonva = useCallback(() => {
    const stage = customizer.stageRef.current;
    if (!stage) return;

    try {
      // Hide guides & transformer for clean texture
      const guideLayer = stage.findOne(".guide-layer");
      const transformer = stage.findOne("Transformer");
      const overlayLayer = stage.findOne(".overlay-layer");

      const gVis = guideLayer?.visible() ?? true;
      const trVis = transformer?.visible() ?? true;
      const ovVis = overlayLayer?.visible() ?? true;

      guideLayer?.hide();
      transformer?.hide();
      overlayLayer?.hide();
      stage.draw();

      const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });

      if (gVis) guideLayer?.show();
      if (trVis) transformer?.show();
      if (ovVis) overlayLayer?.show();
      stage.draw();

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (!textureRef.current) {
          const tex = new THREE.Texture(img);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
          textureRef.current = tex;
        } else {
          textureRef.current.image = img;
          textureRef.current.needsUpdate = true;
        }

        // Ensure materials in meshGroup are bound to texture and updated
        if (meshGroupRef.current) {
          meshGroupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (Array.isArray(child.material)) {
                // front face of shin guard is material[0]
                if (child.material[0]) {
                  child.material[0].map = textureRef.current;
                  child.material[0].needsUpdate = true;
                }
              } else if (child.material && child.geometry instanceof THREE.PlaneGeometry) {
                // flag cloth mesh
                child.material.map = textureRef.current;
                child.material.needsUpdate = true;
              }
            }
          });
        }
      };
      img.src = dataUrl;
    } catch (e) {
      console.warn("Could not generate 3D texture from stage:", e);
    }
  }, [customizer.stageRef]);

  // Keep texture synchronized whenever user transforms, adds, or changes layer state
  useEffect(() => {
    updateTextureFromKonva();
    const timeout = setTimeout(updateTextureFromKonva, 100);
    return () => clearTimeout(timeout);
  }, [
    customizer.state.surfaces,
    customizer.state.activeSurfaceId,
    updateTextureFromKonva,
  ]);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!hasWebGL || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#07090c");
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomTargetRef.current);
    cameraRef.current = camera;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (err) {
      console.warn("WebGL creation failed, falling back to 2D:", err);
      setHasWebGL(false);
      onFallbackTo2D?.();
      return;
    }

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00c8ff, 0.6); // Subtle VinilArt cyan fill
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff1fa4, 0.4); // Subtle rim magenta
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Floor Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.35;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Product Mesh Group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // Initial texture placeholder
    const initialTexture = new THREE.Texture();
    initialTexture.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = initialTexture;

    if (isShinGuard) {
      // Build Shin Guard using exact SHIN_GUARD_CONTOUR_POINTS
      const shape = new THREE.Shape();
      const pts = SHIN_GUARD_CONTOUR_POINTS;
      // Scale from [0..1] to world coordinates centered at (0,0)
      const w = 1.35;
      const h = 2.4;
      const x0 = ((pts[0] ?? 0.5) - 0.5) * w;
      const y0 = -((pts[1] ?? 0) - 0.5) * h;
      shape.moveTo(x0, y0);

      for (let i = 2; i < pts.length; i += 2) {
        const px = ((pts[i] ?? 0.5) - 0.5) * w;
        const py = -((pts[i + 1] ?? 0) - 0.5) * h;
        shape.lineTo(px, py);
      }
      shape.closePath();

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 1,
        bevelSize: 0.03,
        bevelThickness: 0.04,
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();

      // Deform vertices along X to give an anatomical longitudinal curve: z = -0.16 * (x / (w/2))^2
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      if (pos) {
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vz = pos.getZ(i);
          const normX = vx / (w * 0.5);
          const curveOffset = -0.16 * (normX * normX);
          pos.setZ(i, vz + curveOffset);
        }
        geo.computeVertexNormals();
      }

      // In Three.js ExtrudeGeometry, geo.groups[0] covers both caps (back cap first half, front cap second half).
      // Re-configure groups so that:
      // materialIndex 0 = Front Cap ONLY (where artwork is projected)
      // materialIndex 1 = Back Cap + Bevel + Sides (dark neutral rear backing)
      const capCount = geo.groups[0]?.count ?? 0;
      const halfCap = capCount / 2;
      const sideCount = geo.groups[1]?.count ?? 0;

      geo.clearGroups();
      // Group 0: Front cap (artwork)
      geo.addGroup(halfCap, halfCap, 0);
      // Group 1: Back cap (rear backing)
      geo.addGroup(0, halfCap, 1);
      // Group 1: Bevel + Sides (rear edge backing)
      if (sideCount > 0) {
        geo.addGroup(capCount, sideCount, 1);
      }

      // Front Shell Material with direct artwork texture
      const frontMat = new THREE.MeshStandardMaterial({
        roughness: 0.25,
        metalness: 0.05,
        color: 0xffffff,
        map: textureRef.current,
      });

      // Rear/Edge Dark Neutral Backing Material
      const backMat = new THREE.MeshStandardMaterial({
        color: 0x222a36,
        roughness: 0.85,
        metalness: 0.05,
      });

      const guardMesh = new THREE.Mesh(geo, [frontMat, backMat]);
      guardMesh.castShadow = true;
      guardMesh.receiveShadow = true;
      meshGroup.add(guardMesh);
    } else if (isFlag) {
      // Subdivided wave cloth geometry
      const flagGeo = new THREE.PlaneGeometry(2.4, 1.5, 32, 20);
      const pos = flagGeo.getAttribute("position") as THREE.BufferAttribute;
      if (pos) {
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          // Ripple sine curve
          const wave = Math.sin(vx * 2.8) * 0.12 + Math.cos(vy * 3.5) * 0.04;
          pos.setZ(i, wave);
        }
        flagGeo.computeVertexNormals();
      }

      const flagMat = new THREE.MeshStandardMaterial({
        roughness: 0.65,
        metalness: 0.01,
        side: THREE.DoubleSide,
        color: 0xffffff,
        map: textureRef.current,
      });

      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.castShadow = true;
      flagMesh.receiveShadow = true;
      meshGroup.add(flagMesh);

      // Aluminum Pole
      const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 16);
      const poleMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.7,
        roughness: 0.25,
      });
      const poleMesh = new THREE.Mesh(poleGeo, poleMat);
      poleMesh.position.set(-1.24, -0.2, 0);
      poleMesh.castShadow = true;
      meshGroup.add(poleMesh);
    }

    // Trigger initial texture generation
    updateTextureFromKonva();

    // Render loop with smooth damping interpolation
    let running = true;
    const animate = () => {
      if (!running) return;
      animFrameRef.current = requestAnimationFrame(animate);

      if (meshGroupRef.current) {
        // Smooth rotation damping
        meshGroupRef.current.rotation.y += (rotTargetRef.current.y - meshGroupRef.current.rotation.y) * 0.1;
        meshGroupRef.current.rotation.x += (rotTargetRef.current.x - meshGroupRef.current.rotation.x) * 0.1;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z += (zoomTargetRef.current - cameraRef.current.position.z) * 0.1;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      if (rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [hasWebGL, isShinGuard, isFlag, onFallbackTo2D, updateTextureFromKonva]);

  // Pointer Drag Interaction
  function handlePointerDown(e: React.PointerEvent) {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMouseRef.current.x;
    const dy = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    // Update rotation target with clamped vertical pitch
    rotTargetRef.current.y += dx * 0.008;
    rotTargetRef.current.x = Math.max(-0.6, Math.min(0.6, rotTargetRef.current.x + dy * 0.008));
  }

  function handlePointerUp(e: React.PointerEvent) {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY * 0.0025;
    zoomTargetRef.current = Math.max(2.0, Math.min(5.5, zoomTargetRef.current + delta));
  }

  // Camera Presets
  function setViewAngle(angle: "front" | "threeQuarterLeft" | "threeQuarterRight" | "back") {
    setActiveAngle(angle);
    switch (angle) {
      case "front":
        rotTargetRef.current = { x: 0, y: 0 };
        break;
      case "threeQuarterLeft":
        rotTargetRef.current = { x: 0.1, y: 0.65 };
        break;
      case "threeQuarterRight":
        rotTargetRef.current = { x: 0.1, y: -0.65 };
        break;
      case "back":
        rotTargetRef.current = { x: 0, y: Math.PI };
        break;
    }
  }

  if (!hasWebGL) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden border border-border bg-[#07090c]",
        className,
      )}
      style={{ touchAction: "none" }}
    >
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Control Pill */}
      <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/70 bg-[#0d1015]/90 px-3 py-1.5 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => setViewAngle("front")}
          className={cn(
            "rounded px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider font-bold transition-colors",
            activeAngle === "front"
              ? "bg-cyan text-black"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Frente
        </button>

        <button
          type="button"
          onClick={() => setViewAngle("threeQuarterLeft")}
          className={cn(
            "rounded px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider font-bold transition-colors",
            activeAngle === "threeQuarterLeft"
              ? "bg-cyan text-black"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          3/4 Esq
        </button>

        <button
          type="button"
          onClick={() => setViewAngle("threeQuarterRight")}
          className={cn(
            "rounded px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider font-bold transition-colors",
            activeAngle === "threeQuarterRight"
              ? "bg-cyan text-black"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          3/4 Dir
        </button>

        {isShinGuard && (
          <button
            type="button"
            onClick={() => setViewAngle("back")}
            className={cn(
              "rounded px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider font-bold transition-colors",
              activeAngle === "back"
                ? "bg-cyan text-black"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Verso
          </button>
        )}

        <div className="mx-1 h-3 w-px bg-border/80" />

        <button
          type="button"
          onClick={() => {
            zoomTargetRef.current = Math.max(2.0, zoomTargetRef.current - 0.5);
          }}
          title="Aproximar"
          className="p-1 text-muted-foreground hover:text-cyan transition-colors"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            zoomTargetRef.current = Math.min(5.5, zoomTargetRef.current + 0.5);
          }}
          title="Afastar"
          className="p-1 text-muted-foreground hover:text-cyan transition-colors"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Helpful Hint Overlay */}
      <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[0.62rem] text-muted-foreground">
        <RotateCw className="h-3 w-3 animate-spin text-cyan" style={{ animationDuration: "6s" }} />
        <span>Arrasta para rodar 3D</span>
      </div>
    </div>
  );
}
