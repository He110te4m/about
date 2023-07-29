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
  ],
  safelist: 'prose m-auto text-left'.split(' ')
    .concat(
      socials.map(({ icon }) => icon),
    ),
})
