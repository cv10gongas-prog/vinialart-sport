import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const srcDir = path.join(rootDir, ".output", "public");
const themeAssetsDir = path.join(rootDir, "wordpress", "vinilart-sport", "assets");

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function syncThemeAssets() {
  console.log("--------------------------------------------------");
  console.log("Sincronização de Assets: Build Frontend -> Tema WordPress");
  console.log("--------------------------------------------------");

  if (!fs.existsSync(srcDir)) {
    console.error(`Erro: Diretório de build não encontrado em ${srcDir}`);
    console.error("Execute primeiro 'npm run build'.");
    process.exit(1);
  }

  // Garantir existência da pasta de destino
  fs.mkdirSync(themeAssetsDir, { recursive: true });

  // 1. Limpar e copiar ficheiros de build compilados (.output/public/assets -> wordpress/vinilart-sport/assets/build)
  const assetsSrc = path.join(srcDir, "assets");
  const buildDest = path.join(themeAssetsDir, "build");
  if (fs.existsSync(buildDest)) {
    fs.rmSync(buildDest, { recursive: true, force: true });
  }
  if (fs.existsSync(assetsSrc)) {
    copyDirRecursive(assetsSrc, buildDest);
    console.log(`✔ Bundles compilados copiados para ${buildDest}`);
  }

  // 2. Limpar e copiar recursos de marca (brand)
  const brandSrc = path.join(srcDir, "brand");
  const brandDest = path.join(themeAssetsDir, "brand");
  if (fs.existsSync(brandDest)) {
    fs.rmSync(brandDest, { recursive: true, force: true });
  }
  if (fs.existsSync(brandSrc)) {
    copyDirRecursive(brandSrc, brandDest);
    console.log(`✔ Recursos de marca (brand) copiados para ${brandDest}`);
  }

  // 3. Limpar e copiar recursos de catálogo (catalog)
  const catalogSrc = path.join(srcDir, "catalog");
  const catalogDest = path.join(themeAssetsDir, "catalog");
  if (fs.existsSync(catalogDest)) {
    fs.rmSync(catalogDest, { recursive: true, force: true });
  }
  if (fs.existsSync(catalogSrc)) {
    copyDirRecursive(catalogSrc, catalogDest);
    console.log(`✔ Recursos do catálogo copiados para ${catalogDest}`);
  }

  // 4. Identificar ficheiros principais de entrada (Entry JS e Entry CSS)
  let entryJs = "";
  let entryCss = "";
  const allAssets = fs.existsSync(assetsSrc) ? fs.readdirSync(assetsSrc) : [];

  for (const file of allAssets) {
    if (file.startsWith("index-") && file.endsWith(".js")) {
      entryJs = `assets/build/${file}`;
    }
    if (file.startsWith("styles-") && file.endsWith(".css")) {
      entryCss = `assets/build/${file}`;
    }
  }

  // 5. Gerar manifest JSON para o tema WordPress
  const manifest = {
    theme: "VinilArt Sport",
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    entry: entryJs,
    css: entryCss,
    filesCount: allAssets.length,
  };

  const manifestPath = path.join(themeAssetsDir, "assets-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  // Limpeza de pastas residuais antigas se existirem
  const legacyAssetsSubdir = path.join(themeAssetsDir, "assets");
  if (fs.existsSync(legacyAssetsSubdir)) {
    fs.rmSync(legacyAssetsSubdir, { recursive: true, force: true });
  }

  console.log(`✔ Manifest gerado com sucesso em ${manifestPath}`);
  console.log(`  - Entry JS:  ${entryJs || "Não detetado"}`);
  console.log(`  - Entry CSS: ${entryCss || "Não detetado"}`);
  console.log("--------------------------------------------------");
  console.log("Sincronização concluída com sucesso.");
}

syncThemeAssets();
