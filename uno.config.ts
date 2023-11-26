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
    ['site-bg', {
      'background-color': '#D9AFD9',
      'background-image': 'linear-gradient(var(--bg-gradient-angle), #D9AFD9 0%, #97D9E1 100%)',
    }],
    ['content-bg', {
      'background-color': 'var(--content-bg-color)',
    }],
  ],
  safelist: 'prose m-auto text-left'.split(' ')
    .concat(
      socials.map(({ icon }) => icon),
    ),
})

function parseColor(color: string) {
  return color.startsWith('$') ? `var(--${color.slice(1)})` : color
}
