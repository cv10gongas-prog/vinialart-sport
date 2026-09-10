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

const darkBackground = `
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="#171b22"/>
      <stop offset="60%" stop-color="#090b0f"/>
      <stop offset="100%" stop-color="#030405"/>
    </radialGradient>

    <linearGradient id="whiteShell" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="42%" stop-color="#f9fafb"/>
      <stop offset="72%" stop-color="#e9edf1"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>

    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity=".42"/>
      <stop offset="58%" stop-color="#ffffff" stop-opacity=".08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <filter id="shadow" x="-40%" y="-40%" width="180%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="18"/>
      <feOffset dy="18"/>
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 .65 0"
      />
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
`;

export const shinGuardSingleWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${darkBackground}

  <rect width="800" height="800" fill="url(#bg)"/>

  <ellipse
    cx="400"
    cy="730"
    rx="165"
    ry="22"
    fill="#000"
    opacity=".55"
  />

  <g filter="url(#shadow)">
    <path
      d="
        M400 82
        C510 82 568 145 565 260
        L548 555
        C543 650 490 704 400 719
        C310 704 257 650 252 555
        L235 260
        C232 145 290 82 400 82
        Z
      "
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="7"
    />

    <path
      d="
        M400 102
        C485 102 535 151 532 256
        L517 548
        C513 624 470 674 400 688
        C330 674 287 624 283 548
        L268 256
        C265 151 315 102 400 102
        Z
      "
      fill="none"
      stroke="#ffffff"
      stroke-opacity=".72"
      stroke-width="3"
    />

    <path
      d="
        M310 125
        C365 95 420 102 458 116
        C419 210 402 344 395 640
        C349 570 325 450 310 125
        Z
      "
      fill="url(#shine)"
      opacity=".7"
    />
  </g>
</svg>
`);

export const shinGuardPairWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  ${darkBackground}

  <rect width="1200" height="900" fill="url(#bg)"/>

  <ellipse cx="405" cy="808" rx="205" ry="28" fill="#000" opacity=".6"/>
  <ellipse cx="795" cy="808" rx="205" ry="28" fill="#000" opacity=".6"/>

  <g filter="url(#shadow)" transform="translate(-20 0)">
    <path
      d="
        M420 100
        C530 100 588 160 585 270
        L568 615
        C563 700 510 755 420 770
        C330 755 277 700 272 615
        L255 270
        C252 160 310 100 420 100
        Z
      "
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="7"
    />

    <path
      d="
        M335 145
        C390 112 450 118 485 132
        C442 244 424 403 418 688
        C370 610 345 455 335 145
        Z
      "
      fill="url(#shine)"
      opacity=".72"
    />
  </g>

  <g filter="url(#shadow)" transform="translate(380 0)">
    <path
      d="
        M420 100
        C530 100 588 160 585 270
        L568 615
        C563 700 510 755 420 770
        C330 755 277 700 272 615
        L255 270
        C252 160 310 100 420 100
        Z
      "
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="7"
    />

    <path
      d="
        M335 145
        C390 112 450 118 485 132
        C442 244 424 403 418 688
        C370 610 345 455 335 145
        Z
      "
      fill="url(#shine)"
      opacity=".72"
    />
  </g>
</svg>
`);

export const shinGuardDetailWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${darkBackground}
  <rect width="800" height="800" fill="url(#bg)"/>

  <g transform="translate(-40 -85) scale(1.18)" filter="url(#shadow)">
    <path
      d="
        M400 82
        C510 82 568 145 565 260
        L548 555
        C543 650 490 704 400 719
        C310 704 257 650 252 555
        L235 260
        C232 145 290 82 400 82
        Z
      "
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="7"
    />

    <path
      d="
        M315 120
        C365 93 430 101 470 120
        C420 255 405 420 400 660
        C355 575 328 415 315 120
        Z
      "
      fill="url(#shine)"
      opacity=".78"
    />
  </g>
</svg>
`);

export const shinGuardBackWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${darkBackground}
  <rect width="800" height="800" fill="url(#bg)"/>

  <ellipse cx="400" cy="730" rx="165" ry="22" fill="#000" opacity=".55"/>

  <g filter="url(#shadow)">
    <path
      d="
        M400 82
        C510 82 568 145 565 260
        L548 555
        C543 650 490 704 400 719
        C310 704 257 650 252 555
        L235 260
        C232 145 290 82 400 82
        Z
      "
      fill="#f7f8fa"
      stroke="#d4d9df"
      stroke-width="7"
    />

    <path
      d="
        M400 112
        C480 112 525 160 522 260
        L507 548
        C503 615 462 664 400 676
        C338 664 297 615 293 548
        L278 260
        C275 160 320 112 400 112
        Z
      "
      fill="#e9edf1"
      stroke="#d9dde2"
      stroke-width="3"
    />

    <path
      d="M245 330 H555"
      stroke="#bcc3ca"
      stroke-width="18"
      stroke-linecap="round"
    />

    <path
      d="M255 490 H545"
      stroke="#bcc3ca"
      stroke-width="18"
      stroke-linecap="round"
    />
  </g>
</svg>
`);

export const jerseyFrontWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${darkBackground}
  <rect width="800" height="800" fill="url(#bg)"/>

  <ellipse cx="400" cy="710" rx="225" ry="24" fill="#000" opacity=".5"/>

  <g filter="url(#shadow)">
    <path
      d="
        M280 175
        L355 125
        C370 155 430 155 445 125
        L520 175
        L655 245
        L590 365
        L535 330
        L535 680
        L265 680
        L265 330
        L210 365
        L145 245
        Z
      "
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="6"
      stroke-linejoin="round"
    />

    <path
      d="M355 125 C370 205 430 205 445 125"
      fill="none"
      stroke="#d6dbe0"
      stroke-width="12"
    />

    <path
      d="M305 190 C345 168 392 170 430 182 L405 630 C355 575 325 435 305 190 Z"
      fill="url(#shine)"
      opacity=".6"
    />
  </g>
</svg>
`);

export const jerseyBackWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${darkBackground}
  <rect width="800" height="800" fill="url(#bg)"/>

  <ellipse cx="400" cy="710" rx="225" ry="24" fill="#000" opacity=".5"/>

  <g filter="url(#shadow)">
    <path
      d="
        M280 175
        L350 135
        C375 155 425 155 450 135
        L520 175
        L655 245
        L590 365
        L535 330
        L535 680
        L265 680
        L265 330
        L210 365
        L145 245
        Z
      "
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="6"
      stroke-linejoin="round"
    />
  </g>
</svg>
`);

export const flagWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${darkBackground}
  <rect width="800" height="800" fill="url(#bg)"/>

  <g filter="url(#shadow)">
    <rect x="112" y="120" width="18" height="585" rx="9" fill="#aeb5bd"/>

    <path
      d="
        M130 150
        C245 105 345 195 455 150
        C565 105 650 175 690 160
        L690 555
        C575 600 500 505 390 550
        C275 598 205 520 130 555
        Z
      "
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="5"
    />

    <path
      d="
        M155 175
        C280 145 355 215 465 172
        C555 138 620 185 660 180
      "
      fill="none"
      stroke="#fff"
      stroke-width="9"
      opacity=".65"
    />
  </g>
</svg>
`);

export const supporterItemWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${darkBackground}
  <rect width="800" height="800" fill="url(#bg)"/>

  <g filter="url(#shadow)">
    <path
      d="
        M105 315
        Q120 275 165 285
        H635
        Q680 275 695 315
        L675 485
        Q670 520 625 515
        H175
        Q130 520 125 485
        Z
      "
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="6"
    />

    <path d="M125 330 L75 305 M125 365 L70 350 M125 400 L70 400 M125 435 L70 450 M675 330 L725 305 M675 365 L730 350 M675 400 L730 400 M675 435 L730 450"
      stroke="#eef0f3"
      stroke-width="9"
      stroke-linecap="round"
    />
  </g>
</svg>
`);

export const printSurfaceWhite = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  ${darkBackground}
  <rect width="800" height="800" fill="url(#bg)"/>

  <g filter="url(#shadow)">
    <rect
      x="175"
      y="100"
      width="450"
      height="600"
      rx="10"
      fill="url(#whiteShell)"
      stroke="#d5dae0"
      stroke-width="6"
    />

    <rect
      x="205"
      y="130"
      width="390"
      height="540"
      rx="4"
      fill="#fff"
      stroke="#edf0f2"
      stroke-width="3"
    />
  </g>
</svg>
`);
