import type { UserModule } from '~/types'

export const install: UserModule = () => {
  globalThis.console.info(
    '%c ',
    // eslint-disable-next-line @typescript-eslint/quotes
    `padding-left:360px;padding-top:80.75px;background-repeat:no-repeat;background-image:url("data:image/svg+xml,%3Csvg class='animation' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 80.75'%3E%3Cstyle%3E@keyframes draw%7B40%25,80%25%7Bopacity:1;stroke-dashoffset:0;stroke:%23ec0062%7D95%25,to%7Bstroke-dashoffset:0;opacity:0%7D%7D*%7Bbox-sizing:border-box%7D.line%7Bfill:none;stroke:%23F2F2F2;stroke-width:4.75;stroke-linecap:round;stroke-miterlimit:10;stroke-dasharray:200;animation:draw 7s infinite ease-in-out%7D.line-forwards%7Bstroke-dashoffset:200%7D%3C/style%3E%3Cpath class='line line-forwards' d='M2.38 6.55v71.28M2.38 42.19h54.04M64.42 6.55v71.28M143.91 6.73H81.87v71.28h62.04M90.91 42.37h43.68M171.36 8.73l10-2v65.1M161.36 77.83h40M238.13 8.73l10-2v65.1M228.13 77.83h40M294.9 6.55v71.28M304.9 6.55h44.04v71.28H304.9'/%3E%3C/svg%3E")`,
  )
}

// source svg:
// <svg class="animation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80.75">
//   <style>
//     * {
//       box-sizing: border-box;
//     }

//     @keyframes draw {
//       40%, 80% {
//         opacity: 1;
//         stroke-dashoffset: 0;
//         stroke: #ec0062;
//       }
//       95%, 100% {
//         stroke-dashoffset: 0;
//         opacity: 0;
//       }
//     }
//     .line {
//       fill: none;
//       stroke: #F2F2F2;
//       stroke-width: 4.75;
//       stroke-linecap: round;
//       stroke-miterlimit: 10;
//       stroke-dasharray: 200;
//       animation: draw 7s infinite ease-in-out;
//     }
//     .line-reverse {
//       stroke-dashoffset: -200;
//     }
//     .line-forwards {
//       stroke-dashoffset: 200;
//     }
//   </style>

//   <!-- H -->
//   <line class="line line-forwards" x1="2.38" y1="6.55" x2="2.38" y2="77.83"></line>
//   <line class="line line-forwards" x1="2.38" y1="42.19" x2="56.42" y2="42.19"></line>
//   <line class="line line-forwards" x1="64.42" y1="6.55" x2="64.42" y2="77.83"></line>

//   <!-- E -->
//   <polyline class="line line-forwards" points="143.91,6.73 81.87,6.73 81.87,78.01 143.91,78.01"></polyline>
//   <line class="line line-forwards" x1="90.91" y1="42.37" x2="134.59" y2="42.37"></line>

//   <!-- 1 -->
//   <polyline class="line line-forwards" points="171.36,8.73 181.36,6.73 181.36,71.83"></polyline>
//   <line class="line line-forwards" x1="161.36" y1="77.83" x2="201.36" y2="77.83"></line>

//   <!-- 1 -->
//   <polyline class="line line-forwards" points="238.13,8.73 248.13,6.73 248.13,71.83"></polyline>
//   <line class="line line-forwards" x1="228.13" y1="77.83" x2="268.13" y2="77.83"></line>

//   <!-- 0 -->
//   <line class="line line-forwards" x1="294.9" y1="6.55" x2="294.9" y2="77.83"></line>
//   <polyline class="line line-forwards" points="304.9,6.55 348.94,6.55 348.94,77.83 304.9,77.83"></polyline>
// </svg>
