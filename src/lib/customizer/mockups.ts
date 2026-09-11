/**
 * Mockups neutros da VinilArt Sport.
 *
 * Não representam materiais, técnicas de produção ou especificações físicas.
 * Servem apenas como bases visuais brancas para o personalizador online.
 *
 * O objetivo é nunca "queimar" um design no próprio mockup:
 * o produto fica branco e a arte do cliente é renderizada pelo Konva.
 */

function svgData(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const studioGradientsAndFilters = `
  <defs>
    <!-- Deep premium studio background -->
    <radialGradient id="bg" cx="50%" cy="48%" r="68%">
      <stop offset="0%" stop-color="#151922"/>
      <stop offset="55%" stop-color="#0b0e13"/>
      <stop offset="100%" stop-color="#030406"/>
    </radialGradient>

    <!-- Shell white surface with subtle anatomical 3D depth and rim lighting -->
    <linearGradient id="whiteShell" x1="12%" y1="0%" x2="88%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="25%" stop-color="#fafbfd"/>
      <stop offset="65%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <!-- Physical edge bevel and thickness rim (3D injection molded border) -->
    <linearGradient id="edgeBevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#cbd5e1" stop-opacity="0.6"/>
      <stop offset="75%" stop-color="#94a3b8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#475569" stop-opacity="0.7"/>
    </linearGradient>

    <!-- Subtle specular surface reflection (gloss) -->
    <linearGradient id="specularGloss" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="30%" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.32"/>
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <!-- Jersey athletic knit texture simulation -->
    <linearGradient id="jerseyShade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="45%" stop-color="#f8fafc"/>
      <stop offset="85%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <!-- Jersey side panel shadow -->
    <linearGradient id="jerseySideShadowLeft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </linearGradient>

    <linearGradient id="jerseySideShadowRight" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </linearGradient>

    <!-- Realistic physical drop shadow with ambient occlusion -->
    <filter id="physicalShadow" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="30" stdDeviation="26" flood-color="#000000" flood-opacity="0.88"/>
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
`;

export const shinGuardSingleWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioGradientsAndFilters}

  <rect width="800" height="800" fill="url(#bg)"/>

  <!-- Physical ground shadow / ambient contact shadow -->
  <ellipse cx="400" cy="740" rx="180" ry="26" fill="#000000" opacity="0.85" filter="blur(12px)"/>
  <ellipse cx="400" cy="735" rx="130" ry="15" fill="#000000" opacity="0.95"/>

  <!-- Shin Guard Body -->
  <g filter="url(#physicalShadow)">
    <!-- Outer rear backing edge (subtle dark contour peeking through) -->
    <path
      d="
        M400 42
        C498 42 584 82 589 190
        C594 280 579 420 559 560
        C544 657 488 729 400 739
        C312 729 256 657 241 560
        C221 420 206 280 211 190
        C216 82 302 42 400 42
        Z
      "
      fill="#1e242d"
      opacity="0.9"
    />

    <!-- Base Shell: Anatomical contour (exact approved single source of truth contour) -->
    <path
      d="
        M400 45
        C495 45 580 85 585 190
        C590 280 575 420 555 560
        C540 655 485 725 400 735
        C315 725 260 655 245 560
        C225 420 210 280 215 190
        C220 85 305 45 400 45
        Z
      "
      fill="url(#whiteShell)"
      stroke="url(#edgeBevel)"
      stroke-width="3.5"
    />

    <!-- Subtle inner rim highlight -->
    <path
      d="
        M400 52
        C488 52 570 90 575 192
        C580 278 566 415 547 552
        C533 644 480 714 400 724
        C320 714 267 644 253 552
        C234 415 220 278 225 192
        C230 90 312 52 400 52
        Z
      "
      fill="none"
      stroke="#ffffff"
      stroke-opacity="0.75"
      stroke-width="2"
    />

    <!-- Anatomical ridge / subtle longitudinal gloss sheen -->
    <path
      d="
        M320 70
        C365 52 435 52 480 70
        C445 220 430 420 415 710
        C385 710 365 420 320 70
        Z
      "
      fill="url(#specularGloss)"
      opacity="0.8"
    />
  </g>
</svg>
`);

export const shinGuardPairWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  ${studioGradientsAndFilters}

  <rect width="1200" height="900" fill="url(#bg)"/>

  <!-- Contact Shadows -->
  <ellipse cx="380" cy="815" rx="185" ry="26" fill="#000000" opacity="0.85" filter="blur(14px)"/>
  <ellipse cx="820" cy="815" rx="185" ry="26" fill="#000000" opacity="0.85" filter="blur(14px)"/>
  <ellipse cx="380" cy="810" rx="125" ry="15" fill="#000000" opacity="0.95"/>
  <ellipse cx="820" cy="810" rx="125" ry="15" fill="#000000" opacity="0.95"/>

  <!-- Left Shin Guard -->
  <g filter="url(#physicalShadow)" transform="translate(380 435) rotate(-3) translate(-400 -390)">
    <path
      d="
        M400 42
        C498 42 584 82 589 190
        C594 280 579 420 559 560
        C544 657 488 729 400 739
        C312 729 256 657 241 560
        C221 420 206 280 211 190
        C216 82 302 42 400 42
        Z
      "
      fill="#1e242d"
      opacity="0.9"
    />
    <path
      d="
        M400 45
        C495 45 580 85 585 190
        C590 280 575 420 555 560
        C540 655 485 725 400 735
        C315 725 260 655 245 560
        C225 420 210 280 215 190
        C220 85 305 45 400 45
        Z
      "
      fill="url(#whiteShell)"
      stroke="url(#edgeBevel)"
      stroke-width="3.5"
    />
    <path
      d="
        M320 70
        C365 52 435 52 480 70
        C445 220 430 420 415 710
        C385 710 365 420 320 70
        Z
      "
      fill="url(#specularGloss)"
      opacity="0.8"
    />
  </g>

  <!-- Right Shin Guard -->
  <g filter="url(#physicalShadow)" transform="translate(820 435) rotate(3) translate(-400 -390)">
    <path
      d="
        M400 42
        C498 42 584 82 589 190
        C594 280 579 420 559 560
        C544 657 488 729 400 739
        C312 729 256 657 241 560
        C221 420 206 280 211 190
        C216 82 302 42 400 42
        Z
      "
      fill="#1e242d"
      opacity="0.9"
    />
    <path
      d="
        M400 45
        C495 45 580 85 585 190
        C590 280 575 420 555 560
        C540 655 485 725 400 735
        C315 725 260 655 245 560
        C225 420 210 280 215 190
        C220 85 305 45 400 45
        Z
      "
      fill="url(#whiteShell)"
      stroke="url(#edgeBevel)"
      stroke-width="3.5"
    />
    <path
      d="
        M320 70
        C365 52 435 52 480 70
        C445 220 430 420 415 710
        C385 710 365 420 320 70
        Z
      "
      fill="url(#specularGloss)"
      opacity="0.8"
    />
  </g>
</svg>
`);

export const shinGuardDetailWhite = shinGuardSingleWhite;

export const shinGuardBackWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioGradientsAndFilters}

  <rect width="800" height="800" fill="url(#bg)"/>

  <ellipse cx="400" cy="740" rx="170" ry="24" fill="#000000" opacity="0.8" filter="blur(10px)"/>

  <g filter="url(#physicalShadow)">
    <!-- Rear Lining / Back contour -->
    <path
      d="
        M400 45
        C495 45 580 85 585 190
        C590 280 575 420 555 560
        C540 655 485 725 400 735
        C315 725 260 655 245 560
        C225 420 210 280 215 190
        C220 85 305 45 400 45
        Z
      "
      fill="#1c222b"
      stroke="#2e3846"
      stroke-width="4"
    />

    <!-- Rear geometric pattern -->
    <circle cx="400" cy="220" r="10" fill="#12161c"/>
    <circle cx="360" cy="250" r="10" fill="#12161c"/>
    <circle cx="440" cy="250" r="10" fill="#12161c"/>
    <circle cx="400" cy="280" r="10" fill="#12161c"/>
    <circle cx="360" cy="310" r="10" fill="#12161c"/>
    <circle cx="440" cy="310" r="10" fill="#12161c"/>
    <circle cx="400" cy="340" r="10" fill="#12161c"/>
    <circle cx="360" cy="370" r="10" fill="#12161c"/>
    <circle cx="440" cy="370" r="10" fill="#12161c"/>
    <circle cx="400" cy="400" r="10" fill="#12161c"/>
    <circle cx="370" cy="430" r="10" fill="#12161c"/>
    <circle cx="430" cy="430" r="10" fill="#12161c"/>
    <circle cx="400" cy="460" r="10" fill="#12161c"/>
    <circle cx="380" cy="490" r="10" fill="#12161c"/>
    <circle cx="420" cy="490" r="10" fill="#12161c"/>
    <circle cx="400" cy="520" r="10" fill="#12161c"/>
    <circle cx="400" cy="550" r="8" fill="#12161c"/>

    <!-- Comfort Foam Border Stitching -->
    <path
      d="
        M400 65
        C475 65 550 100 555 190
        C560 270 545 405 528 540
        C515 628 470 695 400 708
        C330 695 285 628 272 540
        C255 405 240 270 245 190
        C250 100 325 65 400 65
        Z
      "
      fill="none"
      stroke="#3b4859"
      stroke-dasharray="6,6"
      stroke-width="2"
    />
  </g>
</svg>
`);

export const jerseyFrontWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioGradientsAndFilters}

  <rect width="800" height="800" fill="url(#bg)"/>

  <!-- Ambient shadow under shirt -->
  <ellipse cx="400" cy="740" rx="250" ry="26" fill="#000000" opacity="0.85" filter="blur(16px)"/>

  <g filter="url(#physicalShadow)">
    <!-- Realistic Jersey Silhouette: Shoulders, Collar, Sleeves, Torso -->
    <path
      d="
        M275 145
        L350 115
        C370 145 430 145 450 115
        L525 145
        L670 220
        L615 350
        L545 315
        L550 710
        C550 715 480 725 400 725
        C320 725 250 715 250 710
        L255 315
        L185 350
        L130 220
        Z
      "
      fill="url(#jerseyShade)"
      stroke="#cbd5e1"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <!-- Side panel depth shading -->
    <path d="M255 315 L250 710 L275 710 L280 315 Z" fill="url(#jerseySideShadowLeft)" />
    <path d="M545 315 L550 710 L525 710 L520 315 Z" fill="url(#jerseySideShadowRight)" />

    <!-- Athletic Ribbed V-Collar with inner shadow -->
    <path
      d="M350 115 C370 155 430 155 450 115 C435 170 365 170 350 115 Z"
      fill="#f8fafc"
      stroke="#94a3b8"
      stroke-width="2"
    />
    <path d="M360 120 C375 145 425 145 440 120" fill="none" stroke="#64748b" stroke-width="1.5"/>

    <!-- Subtle raglan sleeve seams -->
    <path d="M275 145 L255 315" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4"/>
    <path d="M525 145 L550 315" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4"/>

    <!-- Athletic sleeve cuff hem -->
    <line x1="130" y1="220" x2="185" y2="350" stroke="#cbd5e1" stroke-width="2.5"/>
    <line x1="670" y1="220" x2="615" y2="350" stroke="#cbd5e1" stroke-width="2.5"/>

    <!-- Gentle body drape wave / specular sheen -->
    <path
      d="
        M310 160
        C370 140 430 140 490 160
        C460 380 440 550 420 720
        C380 720 350 550 310 160
        Z
      "
      fill="url(#specularGloss)"
      opacity="0.3"
    />
  </g>
</svg>
`);

export const jerseyBackWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioGradientsAndFilters}

  <rect width="800" height="800" fill="url(#bg)"/>

  <ellipse cx="400" cy="740" rx="250" ry="26" fill="#000000" opacity="0.85" filter="blur(16px)"/>

  <g filter="url(#physicalShadow)">
    <path
      d="
        M275 145
        L345 125
        C375 140 425 140 455 125
        L525 145
        L670 220
        L615 350
        L545 315
        L550 710
        C550 715 480 725 400 725
        C320 725 250 715 250 710
        L255 315
        L185 350
        L130 220
        Z
      "
      fill="url(#jerseyShade)"
      stroke="#cbd5e1"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <!-- Side panel depth shading -->
    <path d="M255 315 L250 710 L275 710 L280 315 Z" fill="url(#jerseySideShadowLeft)" />
    <path d="M545 315 L550 710 L525 710 L520 315 Z" fill="url(#jerseySideShadowRight)" />

    <!-- Back Collar Trim with athletic neckline tape -->
    <path
      d="M345 125 C375 140 425 140 455 125"
      fill="none"
      stroke="#94a3b8"
      stroke-width="3"
    />

    <!-- Sleeve seams -->
    <path d="M275 145 L255 315" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4"/>
    <path d="M525 145 L550 315" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4"/>

    <!-- Sleeve hems -->
    <line x1="130" y1="220" x2="185" y2="350" stroke="#cbd5e1" stroke-width="2.5"/>
    <line x1="670" y1="220" x2="615" y2="350" stroke="#cbd5e1" stroke-width="2.5"/>
  </g>
</svg>
`);

export const flagWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioGradientsAndFilters}

  <rect width="800" height="800" fill="url(#bg)"/>

  <!-- Flag and Mast -->
  <g filter="url(#physicalShadow)">
    <!-- Flagpole (Mast) with brushed aluminum look -->
    <rect x="90" y="100" width="16" height="630" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
    <circle cx="98" cy="100" r="14" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <!-- Pole highlight reflection -->
    <line x1="94" y1="105" x2="94" y2="720" stroke="#f1f5f9" stroke-width="2" opacity="0.6"/>

    <!-- Flowing wavy flag cloth with organic ripple curves (Exact approved FLAG_CONTOUR_POINTS) -->
    <path
      d="
        M106 130
        C240 85 360 175 490 130
        C590 95 680 145 730 130
        L730 550
        C680 565 590 515 490 550
        C360 595 240 505 106 550
        Z
      "
      fill="url(#whiteShell)"
      stroke="#cbd5e1"
      stroke-width="2"
    />

    <!-- Mast attachment grommets -->
    <circle cx="118" cy="160" r="6" fill="#64748b" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="118" cy="340" r="6" fill="#64748b" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="118" cy="520" r="6" fill="#64748b" stroke="#e2e8f0" stroke-width="2"/>

    <!-- Subtle wave ripples / highlights -->
    <path
      d="
        M220 105
        C310 140 330 350 320 575
        M470 135
        C560 170 580 370 570 540
      "
      fill="none"
      stroke="#ffffff"
      stroke-width="8"
      opacity="0.35"
    />
  </g>
</svg>
`);

export const supporterItemWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioGradientsAndFilters}
  <rect width="800" height="800" fill="url(#bg)"/>
  <g filter="url(#physicalShadow)">
    <rect x="180" y="200" width="440" height="400" rx="16" fill="url(#whiteShell)" stroke="#cbd5e1" stroke-width="2"/>
    <!-- Clean merchandise / quote placeholder icon -->
    <circle cx="400" cy="350" r="50" fill="#00c8ff" opacity="0.15"/>
    <path d="M380 350 L395 365 L425 335" fill="none" stroke="#00c8ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="400" y="450" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="3">ARTIGO SOB MEDIDA</text>
    <text x="400" y="485" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="1">PEDIDO PERSONALIZADO</text>
  </g>
</svg>
`);

export const printSurfaceWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioGradientsAndFilters}
  <rect width="800" height="800" fill="url(#bg)"/>

  <g filter="url(#physicalShadow)">
    <rect
      x="175"
      y="100"
      width="450"
      height="600"
      rx="10"
      fill="url(#whiteShell)"
      stroke="#cbd5e1"
      stroke-width="4"
    />

    <rect
      x="205"
      y="130"
      width="390"
      height="540"
      rx="4"
      fill="#ffffff"
      stroke="#e2e8f0"
      stroke-width="2"
    />
  </g>
</svg>
`);
