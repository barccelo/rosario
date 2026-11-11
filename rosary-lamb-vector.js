/* Ilustración vectorial definitiva de Cordero de Dios.
   Trazos nativos en la paleta del Rosario; sin WebP, canvas ni filtros.
   Una sola figura, con codo completo y margen transparente inferior. */
window.rosarioLambVectorSVG = String.raw`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 430"
     preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true">
  <defs>
    <linearGradient id="lambSkin" x1="8%" y1="5%" x2="75%" y2="95%">
      <stop offset="0" stop-color="#ffe1c0"/>
      <stop offset=".43" stop-color="#ffc3a7"/>
      <stop offset="1" stop-color="#ed9987"/>
    </linearGradient>
    <linearGradient id="lambArm" x1="15%" y1="0%" x2="70%" y2="100%">
      <stop offset="0" stop-color="#ffd9b9"/>
      <stop offset=".65" stop-color="#ffb69d"/>
      <stop offset="1" stop-color="#ee9b86"/>
    </linearGradient>
    <linearGradient id="lambShirt" x1="9%" y1="3%" x2="75%" y2="95%">
      <stop offset="0" stop-color="#fff9ed"/>
      <stop offset=".58" stop-color="#f1e7d5"/>
      <stop offset="1" stop-color="#d8cdbb"/>
    </linearGradient>
    <linearGradient id="lambHair" x1="0" y1="0" x2="100%" y2="90%">
      <stop offset="0" stop-color="#b97952"/>
      <stop offset=".51" stop-color="#975736"/>
      <stop offset="1" stop-color="#78432f"/>
    </linearGradient>
  </defs>

  <!-- Todo el contorno comparte exactamente la misma tinta del tema. -->
  <g stroke="var(--rosario-lamb-ink,#967f9c)" stroke-width="4.4"
     stroke-linejoin="round" stroke-linecap="round">
    <!-- Brazo colgante detrás del torso: anatómicamente separado del que reza. -->
    <path d="M244 315 C260 313 274 328 276 347 L281 379
             Q284 405 263 406 Q243 407 241 384 L235 331Z"
          fill="url(#lambSkin)"/>
    <path d="M262 351 Q268 376 266 396" stroke="#fff1d9"
          stroke-width="7" opacity=".47" fill="none"/>

    <!-- Cuello y sombra debajo de la barbilla. -->
    <path d="M139 189 L140 231 Q148 249 166 250 Q188 251 197 232
             L190 187Z" fill="url(#lambSkin)"/>
    <path d="M142 217 Q165 229 192 214" fill="none"
          stroke="#cf8d81" opacity=".42" stroke-width="5"/>

    <!-- Camisa completa con hombros y dobladillo curvo; no corta el codo. -->
    <path d="M131 235 Q102 230 78 242 Q46 253 34 285
             L20 331 Q16 344 27 352 L58 362 Q69 361 76 349
             L78 390 Q158 405 239 391 L241 346
             Q252 358 266 354 L286 346 L273 294
             Q263 257 237 245 L200 233
             Q188 253 166 255 Q143 252 131 235Z"
          fill="url(#lambShirt)"/>
    <path d="M127 238 Q140 261 165 264 Q188 264 203 238"
          fill="none" stroke-width="5" opacity=".85"/>
    <path d="M72 318 Q79 343 78 387 M240 320 Q240 353 240 390"
          fill="none" stroke-width="3.4" opacity=".76"/>
    <path d="M42 337 Q54 343 67 345 M249 344 Q266 352 282 340"
          stroke-width="4" fill="none" opacity=".7"/>
    <path d="M103 259 Q88 294 94 332" fill="none"
          stroke="#fffdfa" stroke-width="10" opacity=".44"/>
    <path d="M211 273 Q226 301 229 324" fill="none"
          stroke="#c5b8ad" stroke-width="5" opacity=".29"/>

    <!-- Rostro: misma expresión recogida de ojos cerrados. -->
    <path d="M112 120 Q108 154 120 177
             C123 199 143 217 166 220
             C194 222 216 200 222 171
             Q226 156 222 140 C231 132 232 117 222 110
             C206 87 146 87 112 120Z"
          fill="url(#lambSkin)"/>
    <path d="M120 142 Q122 179 142 198" fill="none"
          stroke="#ffe9d0" stroke-width="10" opacity=".38"/>
    <path d="M205 149 Q211 140 218 146" fill="none"
          stroke="#fff0d6" stroke-width="5" opacity=".55"/>

    <!-- Cabello de una pieza, con mechones redondeados. -->
    <path d="M116 143
             C101 137 94 128 99 112
             C87 116 78 109 80 95
             Q82 88 92 87
             C77 84 76 73 85 66
             C91 76 105 74 120 67
             Q151 42 176 47 Q196 47 205 62
             C222 61 231 75 229 86
             C243 98 238 119 227 132
             L219 144 Q210 133 206 120
             Q196 112 194 102 Q176 112 159 108
             C148 122 134 121 125 117
             Q120 133 116 143Z"
          fill="url(#lambHair)"/>
    <path d="M97 94 Q109 100 128 88 Q148 73 168 71"
          fill="none" stroke="#d99166" stroke-width="5" opacity=".65"/>
    <path d="M126 114 Q144 114 158 99 M194 103 Q209 108 215 126"
          fill="none" stroke="var(--rosario-lamb-ink,#967f9c)" stroke-width="3.2" opacity=".54"/>
    <path d="M195 61 Q213 75 215 91" fill="none"
          stroke="#d18b62" stroke-width="4" opacity=".53"/>

    <!-- Ojos, nariz y boca en tinta del rosario; nunca negros. -->
    <path d="M131 162 Q140 174 152 162 M178 162 Q190 173 201 159"
          fill="none" stroke-width="4.5"/>
    <path d="M164 167 Q158 177 166 181"
          fill="none" stroke-width="3.4"/>
    <path d="M155 196 Q166 193 178 195"
          fill="none" stroke-width="3.5"/>
    <path d="M124 179 Q130 181 136 180 M194 182 Q201 184 205 181"
          fill="none" stroke="#ee8f86" stroke-width="4" opacity=".3"/>

    <!-- Puño sobre el corazón y UN solo antebrazo continuo.
         El codo queda cerrado y redondeado en y=403, dentro del viewBox. -->
    <path d="M45 313
             C34 321 26 341 25 359
             C21 379 33 398 52 404
             C70 410 85 401 107 389
             L210 328
             C220 325 229 314 229 304
             C232 297 229 290 222 287
             C222 277 213 272 205 279
             C198 276 190 278 187 286
             C180 282 172 289 175 299
             L180 315
             L98 361
             C81 370 69 372 60 366
             C49 357 51 336 58 321Z"
          fill="url(#lambArm)"/>
    <path d="M47 328 Q34 363 47 381 Q56 395 76 388"
          fill="none" stroke="#ffe1c4" stroke-width="9" opacity=".63"/>
    <path d="M77 379 Q106 367 140 345" fill="none"
          stroke="#fbe7d0" stroke-width="6" opacity=".3"/>
    <!-- Nudillos y pliegues del puño. -->
    <path d="M188 285 Q189 299 199 304
             M204 280 Q205 290 210 294
             M218 287 Q220 295 218 299"
          fill="none" stroke-width="2.9" opacity=".6"/>
    <path d="M178 313 Q181 323 190 327"
          fill="none" stroke="#e89b86" stroke-width="3.5" opacity=".53"/>

    <!-- Tres rayos suaves que señalan el gesto, también temáticos. -->
    <path d="M259 253 L268 239 M272 274 L287 266 M253 244 L256 234"
          fill="none" stroke-width="5.6" opacity=".84"/>
  </g>
</svg>`;
