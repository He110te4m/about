import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { socials } from './src/configs/site'

export default defineConfig({
  shortcuts: [
    ['center-full', 'flex items-center justify-around'],
    ['color-link', 'color-$color-primary'],
    ['color-info', 'color-$info-color'],
    ['link', 'color-link cursor-pointer transition-320 hover:color-$color-primary-l10 active:color-$color-primary-d10'],
    ['card', 'card-shadow-$separator-color b-rd-2 b-1 b-color-$separator-color content-bg p-8'],
    ['group-title', 'group-shadow color-$bg-color select-none font-sans'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'Source Code Pro',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  rules: [
    [/^g-name-(.+)$/, ([, name]) => ({ 'grid-area': name })],
    ['color-title', { color: '#000000' }],
    [/^card-shadow-(.+)$/, ([, color]) => ({ 'box-shadow': `0 0 4px 0 ${parseColor(color)}` })],
    ['group-shadow', { 'text-shadow': '0 0 2px var(--title-color)' }],
    ['content-bg', {
      'background-color': 'var(--content-bg-color)',
    }],
    ['flex-min', { flex: '0 0 auto' }],

    [/^scroll$/, () => `
::-webkit-scrollbar {
  --at-apply: w-2 h-2;
}

::-webkit-scrollbar-corner {
  --at-apply: bg-transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #262626;
  --at-apply: b-rd-1 transition;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #434343;
}
::-webkit-scrollbar-thumb:active {
  background-color: #8c8c8c;
}

::-webkit-scrollbar-track {
  --at-apply: bg-transparent b-rd-50%;
}

::-webkit-scrollbar-button {
  display: none;
}
`],
  ],
  safelist: 'prose m-auto text-left'.split(' ')
    .concat(
      socials.map(({ icon }) => icon),
    ),
})

function parseColor(color: string) {
  return color.startsWith('$') ? `var(--${color.slice(1)})` : color
}
