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
    ['color-sep', 'color-$separator-color'],
    ['color-link', 'color-$primary-color'],
    ['color-info', 'color-$info-color'],
    ['link', 'color-link cursor-pointer hover:decoration-underline'],
    ['card', 'card-shadow b-rd-2 b-1 b-color-sep'],
    ['group-title', 'group-shadow color-$bg-color select-none font-sans op-50'],
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
    ['card-shadow', { 'box-shadow': '0 0 4px 0 var(--separator-color)' }],
    ['group-shadow', { 'text-shadow': '0 0 2px var(--title-color)' }],
  ],
  safelist: 'prose m-auto text-left'.split(' ')
    .concat(
      socials.map(({ icon }) => icon),
    ),
})
