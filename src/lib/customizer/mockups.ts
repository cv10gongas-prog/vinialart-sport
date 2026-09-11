/**
 * Mockups neutros da VinilArt Sport.
 *
 * Não representam materiais, técnicas de produção ou especificações físicas.
 * Servem apenas como bases visuais brancas para o personalizador online.
 *
 * Regras:
 * - o produto é sempre neutro (branco) e nunca traz arte "queimada";
 * - a arte do cliente é desenhada pelo Konva por cima da base;
 * - os ficheiros `*Overlay` só contêm sombra/luz transparente e são
 *   desenhados ACIMA da arte, para o design parecer aplicado no produto.
 *
 * IMPORTANTE: os contornos (silhuetas) não podem mudar — as áreas de
 * impressão em `configs/` dependem destas coordenadas.
 */

function svgData(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/** Silhuetas — fonte única de verdade. Não alterar. */
const SHIN_GUARD_PATH = `
  M400 45
  C495 45 580 85 585 190
  C590 280 575 420 555 560
  C540 655 485 725 400 735
  C315 725 260 655 245 560
  C225 420 210 280 215 190
  C220 85 305 45 400 45
  Z
`;

const SHIN_GUARD_BACKING_PATH = `
  M400 40
  C500 40 586 81 591 190
  C596 281 581 421 561 561
  C546 659 489 731 400 741
  C311 731 254 659 239 561
  C219 421 204 281 209 190
  C214 81 300 40 400 40
  Z
`;

const JERSEY_PATH = `
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
`;

const JERSEY_BACK_PATH = `
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
`;

const FLAG_PATH = `
  M106 130
  C240 85 360 175 490 130
  C590 95 680 145 730 130
  L730 550
  C680 565 590 515 490 550
  C360 595 240 505 106 550
  Z
`;

/** Fundo de estúdio + filtros partilhados. */
const studioDefs = `
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="#22262f"/>
      <stop offset="48%" stop-color="#111419"/>
      <stop offset="100%" stop-color="#05070a"/>
    </radialGradient>

    <linearGradient id="floor" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </linearGradient>

    <!-- Superfície branca com curvatura: luz em cima/esquerda, queda à direita -->
    <linearGradient id="shell" x1="6%" y1="0%" x2="96%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="34%" stop-color="#fbfcfe"/>
      <stop offset="72%" stop-color="#eef1f6"/>
      <stop offset="100%" stop-color="#dfe4ec"/>
    </linearGradient>

    <radialGradient id="shellCurve" cx="38%" cy="26%" r="78%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="58%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#8d97a8" stop-opacity="0.28"/>
    </radialGradient>

    <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#c3ccd9" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#5b6b7b" stop-opacity="0.6"/>
    </linearGradient>

    <filter id="soften" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>

    <filter id="softenSmall" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>

    <filter id="dropShadow" x="-40%" y="-30%" width="180%" height="180%">
      <feDropShadow dx="0" dy="26" stdDeviation="24" flood-color="#000000" flood-opacity="0.7"/>
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.45"/>
    </filter>

    <filter id="weave" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix"
        values="0 0 0 0 0.55  0 0 0 0 0.58  0 0 0 0 0.64  0 0 0 0.16 0"/>
    </filter>
  </defs>
`;

const studioBackdrop = (w: number, h: number) => `
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="url(#floor)"/>
`;

const contactShadow = (cx: number, cy: number, rx: number) => `
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.16}" fill="#000000" opacity="0.62" filter="url(#soften)"/>
  <ellipse cx="${cx}" cy="${cy - 4}" rx="${rx * 0.6}" ry="${rx * 0.09}" fill="#000000" opacity="0.8" filter="url(#softenSmall)"/>
`;

/* -------------------------------------------------------------------------- */
/* Caneleiras                                                                  */
/* -------------------------------------------------------------------------- */

const shinGuardBody = `
  <g filter="url(#dropShadow)">
    <!-- espessura / bordo traseiro -->
    <path d="${SHIN_GUARD_BACKING_PATH}" fill="#20262f"/>
    <path d="${SHIN_GUARD_BACKING_PATH}" fill="none" stroke="#3a4351" stroke-width="2"/>

    <!-- corpo -->
    <path d="${SHIN_GUARD_PATH}" fill="url(#shell)"/>
    <path d="${SHIN_GUARD_PATH}" fill="url(#shellCurve)" opacity="0.85"/>
    <path d="${SHIN_GUARD_PATH}" fill="none" stroke="url(#rim)" stroke-width="3"/>

    <!-- textura muito ligeira -->
    <g clip-path="url(#shinClip)" opacity="0.5">
      <rect x="200" y="30" width="400" height="720" filter="url(#weave)"/>
    </g>

    <!-- bordo interior iluminado + oclusão nas laterais -->
    <g clip-path="url(#shinClip)">
      <path d="${SHIN_GUARD_PATH}" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="8" filter="url(#softenSmall)"/>
      <path d="${SHIN_GUARD_PATH}" fill="none" stroke="#7b8698" stroke-opacity="0.55" stroke-width="20" filter="url(#soften)"/>
      <!-- brilho longitudinal central -->
      <ellipse cx="352" cy="330" rx="70" ry="290" fill="#ffffff" opacity="0.55" filter="url(#soften)"/>
      <!-- sombra do lado direito (curvatura) -->
      <ellipse cx="575" cy="390" rx="90" ry="330" fill="#5f6b7d" opacity="0.5" filter="url(#soften)"/>
      <!-- contacto inferior -->
      <ellipse cx="400" cy="742" rx="150" ry="46" fill="#6b7688" opacity="0.55" filter="url(#soften)"/>
    </g>
  </g>
`;

const shinClipDef = `
  <defs>
    <clipPath id="shinClip"><path d="${SHIN_GUARD_PATH}"/></clipPath>
  </defs>
`;

export const shinGuardSingleWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioDefs}
  ${shinClipDef}
  ${studioBackdrop(800, 800)}
  ${contactShadow(400, 752, 175)}
  ${shinGuardBody}
</svg>
`);

/** Sombreado transparente desenhado ACIMA da arte (produto com design). */
export const shinGuardShadeOverlay = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <clipPath id="c"><path d="${SHIN_GUARD_PATH}"/></clipPath>
    <filter id="b" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
    <linearGradient id="side" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0d1218" stop-opacity="0.34"/>
      <stop offset="22%" stop-color="#0d1218" stop-opacity="0.05"/>
      <stop offset="52%" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="82%" stop-color="#0d1218" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0d1218" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="vert" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0d1218" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#c)">
    <rect width="800" height="800" fill="url(#side)"/>
    <rect width="800" height="800" fill="url(#vert)"/>
    <ellipse cx="348" cy="300" rx="52" ry="230" fill="#ffffff" opacity="0.22" filter="url(#b)"/>
    <path d="${SHIN_GUARD_PATH}" fill="none" stroke="#0d1218" stroke-opacity="0.45" stroke-width="14" filter="url(#b)"/>
  </g>
</svg>
`);

export const shinGuardPairWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  ${studioDefs}
  ${shinClipDef}
  ${studioBackdrop(1200, 900)}
  ${contactShadow(380, 828, 180)}
  ${contactShadow(820, 828, 180)}
  <g transform="translate(380 440) rotate(-4) translate(-400 -390)">${shinGuardBody}</g>
  <g transform="translate(820 440) rotate(4) translate(-400 -390)">${shinGuardBody}</g>
</svg>
`);

export const shinGuardDetailWhite = shinGuardSingleWhite;

export const shinGuardBackWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioDefs}
  <defs>
    <clipPath id="shinClipBack"><path d="${SHIN_GUARD_PATH}"/></clipPath>
    <linearGradient id="backShade" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#2b333f"/>
      <stop offset="60%" stop-color="#1d232c"/>
      <stop offset="100%" stop-color="#141920"/>
    </linearGradient>
  </defs>
  ${studioBackdrop(800, 800)}
  ${contactShadow(400, 752, 170)}

  <g filter="url(#dropShadow)">
    <path d="${SHIN_GUARD_BACKING_PATH}" fill="#e6eaf1"/>
    <path d="${SHIN_GUARD_PATH}" fill="url(#backShade)"/>
    <g clip-path="url(#shinClipBack)">
      <path d="${SHIN_GUARD_PATH}" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="10" filter="url(#softenSmall)"/>
      <ellipse cx="360" cy="320" rx="80" ry="260" fill="#ffffff" opacity="0.07" filter="url(#soften)"/>
      <rect x="180" y="30" width="440" height="740" filter="url(#weave)" opacity="0.6"/>
    </g>
    <path d="${SHIN_GUARD_PATH}" fill="none" stroke="#414c5c" stroke-width="3"/>
  </g>
</svg>
`);

/* -------------------------------------------------------------------------- */
/* Equipamento                                                                 */
/* -------------------------------------------------------------------------- */

function jerseyBody(path: string, collar: string): string {
  return `
  <g filter="url(#dropShadow)">
    <path d="${path}" fill="url(#shell)"/>
    <path d="${path}" fill="url(#shellCurve)" opacity="0.7"/>

    <g clip-path="url(#jerseyClip)">
      <!-- textura de malha discreta -->
      <rect x="100" y="100" width="600" height="660" filter="url(#weave)" opacity="0.7"/>

      <!-- volume: laterais, ombros e queda -->
      <ellipse cx="150" cy="470" rx="95" ry="300" fill="#8a94a4" opacity="0.5" filter="url(#soften)"/>
      <ellipse cx="655" cy="470" rx="95" ry="300" fill="#8a94a4" opacity="0.55" filter="url(#soften)"/>
      <ellipse cx="400" cy="180" rx="230" ry="70" fill="#ffffff" opacity="0.75" filter="url(#soften)"/>
      <ellipse cx="400" cy="720" rx="260" ry="60" fill="#7f8a9b" opacity="0.5" filter="url(#soften)"/>

      <!-- dobras suaves -->
      <path d="M330 300 C318 430 322 560 336 700" fill="none" stroke="#8b95a6" stroke-opacity="0.5" stroke-width="16" filter="url(#soften)"/>
      <path d="M470 320 C482 450 478 570 464 700" fill="none" stroke="#8b95a6" stroke-opacity="0.45" stroke-width="14" filter="url(#soften)"/>
      <path d="M300 250 C280 330 275 420 288 520" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="10" filter="url(#soften)"/>

      <!-- axilas / cavas -->
      <ellipse cx="262" cy="318" rx="60" ry="42" fill="#7d8798" opacity="0.55" filter="url(#soften)"/>
      <ellipse cx="540" cy="318" rx="60" ry="42" fill="#7d8798" opacity="0.55" filter="url(#soften)"/>
    </g>

    <!-- costuras e bainhas -->
    <path d="${path}" fill="none" stroke="#c8d0dc" stroke-width="2" stroke-linejoin="round"/>
    <path d="M275 145 L255 315" stroke="#d5dbe4" stroke-width="2" fill="none"/>
    <path d="M525 145 L550 315" stroke="#d5dbe4" stroke-width="2" fill="none"/>
    <path d="M185 350 L130 220" stroke="#cfd6e0" stroke-width="3" fill="none"/>
    <path d="M615 350 L670 220" stroke="#cfd6e0" stroke-width="3" fill="none"/>
    <path d="M250 706 C320 716 480 716 550 706" fill="none" stroke="#cfd6e0" stroke-width="3"/>

    ${collar}
  </g>
  `;
}

const jerseyClipFront = `
  <defs><clipPath id="jerseyClip"><path d="${JERSEY_PATH}"/></clipPath></defs>
`;

const jerseyClipBack = `
  <defs><clipPath id="jerseyClip"><path d="${JERSEY_BACK_PATH}"/></clipPath></defs>
`;

export const jerseyFrontWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioDefs}
  ${jerseyClipFront}
  ${studioBackdrop(800, 800)}
  ${contactShadow(400, 748, 245)}
  ${jerseyBody(
    JERSEY_PATH,
    `
    <path d="M350 115 C370 155 430 155 450 115 C436 172 364 172 350 115 Z" fill="#f4f7fb" stroke="#a9b3c1" stroke-width="2"/>
    <path d="M358 122 C374 148 426 148 442 122" fill="none" stroke="#8d97a6" stroke-width="2"/>
  `,
  )}
</svg>
`);

export const jerseyBackWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioDefs}
  ${jerseyClipBack}
  ${studioBackdrop(800, 800)}
  ${contactShadow(400, 748, 245)}
  ${jerseyBody(
    JERSEY_BACK_PATH,
    `
    <path d="M345 125 C375 140 425 140 455 125" fill="none" stroke="#a9b3c1" stroke-width="4"/>
    <path d="M345 133 C375 148 425 148 455 133" fill="none" stroke="#c9d1dc" stroke-width="2"/>
  `,
  )}
</svg>
`);

export const jerseyShadeOverlay = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <filter id="b" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="20"/>
    </filter>
    <linearGradient id="v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0d1218" stop-opacity="0.26"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#v)"/>
  <path d="M330 200 C318 400 322 560 336 740" fill="none" stroke="#0d1218" stroke-opacity="0.2" stroke-width="18" filter="url(#b)"/>
  <path d="M470 220 C482 420 478 580 464 740" fill="none" stroke="#0d1218" stroke-opacity="0.16" stroke-width="16" filter="url(#b)"/>
  <ellipse cx="250" cy="470" rx="60" ry="260" fill="#0d1218" opacity="0.16" filter="url(#b)"/>
  <ellipse cx="552" cy="470" rx="60" ry="260" fill="#0d1218" opacity="0.18" filter="url(#b)"/>
</svg>
`);

/* -------------------------------------------------------------------------- */
/* Bandeira                                                                    */
/* -------------------------------------------------------------------------- */

export const flagWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioDefs}
  <defs>
    <clipPath id="flagClip"><path d="${FLAG_PATH}"/></clipPath>
    <linearGradient id="pole" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6c7684"/>
      <stop offset="35%" stop-color="#dfe5ee"/>
      <stop offset="70%" stop-color="#8b95a3"/>
      <stop offset="100%" stop-color="#4b5462"/>
    </linearGradient>
  </defs>
  ${studioBackdrop(800, 800)}

  <ellipse cx="420" cy="700" rx="290" ry="34" fill="#000000" opacity="0.5" filter="url(#soften)"/>

  <g filter="url(#dropShadow)">
    <rect x="90" y="96" width="16" height="632" rx="8" fill="url(#pole)"/>
    <circle cx="98" cy="96" r="13" fill="#dfe5ee" stroke="#4b5462" stroke-width="2"/>

    <path d="${FLAG_PATH}" fill="url(#shell)"/>
    <g clip-path="url(#flagClip)">
      <rect x="100" y="80" width="640" height="500" filter="url(#weave)" opacity="0.8"/>
      <!-- ondulação: vales e cristas -->
      <path d="M200 60 C250 220 230 420 210 620" fill="none" stroke="#8d97a8" stroke-opacity="0.6" stroke-width="46" filter="url(#soften)"/>
      <path d="M300 60 C340 240 330 430 310 620" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="40" filter="url(#soften)"/>
      <path d="M430 60 C470 240 460 430 440 620" fill="none" stroke="#8d97a8" stroke-opacity="0.55" stroke-width="44" filter="url(#soften)"/>
      <path d="M560 60 C600 240 590 430 570 620" fill="none" stroke="#ffffff" stroke-opacity="0.8" stroke-width="38" filter="url(#soften)"/>
      <path d="M680 60 C710 240 700 430 686 620" fill="none" stroke="#8d97a8" stroke-opacity="0.5" stroke-width="40" filter="url(#soften)"/>
      <!-- sombra junto ao mastro -->
      <rect x="106" y="60" width="60" height="540" fill="#7d8798" opacity="0.5" filter="url(#soften)"/>
    </g>
    <path d="${FLAG_PATH}" fill="none" stroke="#c8d0dc" stroke-width="2"/>

    <circle cx="120" cy="160" r="6" fill="#6c7684" stroke="#e6eaf1" stroke-width="2"/>
    <circle cx="120" cy="340" r="6" fill="#6c7684" stroke="#e6eaf1" stroke-width="2"/>
    <circle cx="120" cy="520" r="6" fill="#6c7684" stroke="#e6eaf1" stroke-width="2"/>
  </g>
</svg>
`);

export const flagShadeOverlay = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <clipPath id="c"><path d="${FLAG_PATH}"/></clipPath>
    <filter id="b" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <g clip-path="url(#c)">
    <path d="M200 60 C250 220 230 420 210 620" fill="none" stroke="#0d1218" stroke-opacity="0.28" stroke-width="44" filter="url(#b)"/>
    <path d="M300 60 C340 240 330 430 310 620" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="36" filter="url(#b)"/>
    <path d="M430 60 C470 240 460 430 440 620" fill="none" stroke="#0d1218" stroke-opacity="0.26" stroke-width="42" filter="url(#b)"/>
    <path d="M560 60 C600 240 590 430 570 620" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="34" filter="url(#b)"/>
    <path d="M680 60 C710 240 700 430 686 620" fill="none" stroke="#0d1218" stroke-opacity="0.22" stroke-width="38" filter="url(#b)"/>
    <rect x="106" y="60" width="56" height="540" fill="#0d1218" opacity="0.24" filter="url(#b)"/>
  </g>
</svg>
`);

/* -------------------------------------------------------------------------- */
/* Superfícies neutras (adeptos / impressão)                                   */
/* -------------------------------------------------------------------------- */

export const supporterItemWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioDefs}
  <defs>
    <clipPath id="panelClip"><rect x="150" y="180" width="500" height="440" rx="20"/></clipPath>
  </defs>
  ${studioBackdrop(800, 800)}
  ${contactShadow(400, 646, 220)}

  <g filter="url(#dropShadow)">
    <rect x="150" y="180" width="500" height="440" rx="20" fill="url(#shell)"/>
    <g clip-path="url(#panelClip)">
      <rect x="150" y="180" width="500" height="440" filter="url(#weave)" opacity="0.7"/>
      <ellipse cx="290" cy="280" rx="220" ry="150" fill="#ffffff" opacity="0.8" filter="url(#soften)"/>
      <ellipse cx="620" cy="600" rx="180" ry="130" fill="#8a94a4" opacity="0.45" filter="url(#soften)"/>
    </g>
    <rect x="150" y="180" width="500" height="440" rx="20" fill="none" stroke="url(#rim)" stroke-width="3"/>
  </g>
</svg>
`);

export const printSurfaceWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${studioDefs}
  <defs>
    <clipPath id="sheetClip"><rect x="175" y="100" width="450" height="600" rx="8"/></clipPath>
  </defs>
  ${studioBackdrop(800, 800)}
  ${contactShadow(400, 716, 235)}

  <g filter="url(#dropShadow)">
    <rect x="175" y="100" width="450" height="600" rx="8" fill="url(#shell)"/>
    <g clip-path="url(#sheetClip)">
      <ellipse cx="300" cy="200" rx="260" ry="200" fill="#ffffff" opacity="0.85" filter="url(#soften)"/>
      <ellipse cx="600" cy="680" rx="200" ry="160" fill="#8a94a4" opacity="0.4" filter="url(#soften)"/>
    </g>
    <rect x="175" y="100" width="450" height="600" rx="8" fill="none" stroke="url(#rim)" stroke-width="3"/>
  </g>
</svg>
`);
