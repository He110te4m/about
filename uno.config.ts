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
    ['layout', {
      'display': 'grid',
      'grid-template': '40px 1fr 40px / 320px 1fr',
      'grid-template-areas': [
        '"sidebar header"',
        '"sidebar main"',
        '"sidebar footer"',
      ].join('\r\n'),
    }],
    ['color-title', { color: '#000000' }],
  ],
  safelist: 'prose m-auto text-left'.split(' ')
    .concat(
      socials.map(({ icon }) => icon),
    ),
})
