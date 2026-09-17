# Uizard — Style Reference
> violet aurora over obsidian — a single charged accent glowing against an ink-dark product canvas

**Theme:** dark

Uizard operates as a midnight creative studio: near-black canvases absorb attention while a single violet glow (#a881fe) acts as the room's neon sign, drawing the eye to generation moments. The interface stays overwhelmingly achromatic — white type, graphite borders, ink-black surfaces — so that the purple accent reads as functional electricity, not decoration. Typography is confident and modern: Satoshi Variable carries the product voice at comfortable weights, while Clash Grotesk breaks through at display scale for hero headlines with tight tracking. Components feel contained and architectural — cards with hairline graphite borders, pills and inputs softened to 8-12px radii, and a signature purple outer-glow shadow on the primary action that makes it appear to emit light rather than sit on a surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Violet Glow | `#a881fe` | `--color-violet-glow` | Primary action fill, brand accent, hero glow origin, logo mark — the charged purple that signals generation and AI intent |
| Deep Iris | `linear-gradient(0deg, rgb(100,25,255), rgb(168,129,254))` | `--color-deep-iris` | Gradient deep stop, brand purple core — anchors hero radial bloom and logo gradient ramp |
| Soft Lilac | `linear-gradient(189.47deg, rgb(204,178,255) 4.76%, rgb(100,25,255) 92.85%)` | `--color-soft-lilac` | Gradient highlight stop — outer edge of brand gradient where violet dissolves into the dark canvas |
| Signal Blue | `#1e90ff` | `--color-signal-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Obsidian | `#0b0b0b` | `--color-obsidian` | Page canvas, card surface — the foundational darkness everything floats on |
| Void Black | `#000000` | `--color-void-black` | Deepest surface tier, shadow base — used for shadow color and deepest elevation sink |
| Graphite | `#2e2e2e` | `--color-graphite` | Card and container borders — hairline outlines that separate dark surfaces without lifting them |
| Carbon | `#212121` | `--color-carbon` | Secondary borders, subtle dividers on dark sections |
| Slate | `#525252` | `--color-slate` | Muted border accent for low-emphasis containers and section dividers |
| Frost | `#f5f5f5` | `--color-frost` | Primary text on dark surfaces, hairline borders — the default ink |
| Pure White | `#ffffff` | `--color-pure-white` | Headline text, input field fill, high-emphasis foreground — maximum contrast moments |
| Pewter | `#aeaeae` | `--color-pewter` | Muted body text, secondary copy, metadata — reads as quiet information |

## Tokens — Typography

### Satoshi-Variable — Primary UI and body typeface
- **Substitute:** Inter / General Sans
- **Weights:** 400, 480, 540, 560, 640
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 40px
- **Line height:** 1.00–1.43
- **Role:** Primary UI and body typeface

### ClashGrotesk-Variable — Display headline typeface
- **Substitute:** Clash Display / Space Grotesk Bold
- **Weights:** 540
- **Sizes:** 72px
- **Line height:** 1.00
- **Letter spacing:** -0.008em at 72px
- **Role:** Display headline typeface — reserved for the hero statement.

## Tokens — Spacing & Shapes

**Base unit:** 4px
**Density:** comfortable

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 9999px |
| inputs | 8px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(3, 3, 3, 0.12) 0px 12px 30px -4px` | `--shadow-xl` |
| md (Primary CTA glow) | `rgba(168, 129, 254, 0.64) 0px 2px 12px 0px, rgb(168, 129, 254) 0px 1px 1px 0px inset` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary CTA Button (Violet)
Filled violet (#a881fe) with white Satoshi 16px/540 text, 12px border-radius, 12px 24px padding. Signature outer glow: rgba(168,129,254,0.64) 0px 2px 12px with an inset 1px 1px highlight.

### Secondary CTA Button (Blue)
Filled Signal Blue (#1e90ff) with white Satoshi 14px/540 text, 8px border-radius, 8px 16px padding.

### Generation Prompt Bar
White (#ffffff) input field, 8px radius, ~56px height, Satoshi 16px/400 placeholder text in gray. Attached right-side violet Generate button (12px radius).

### Cards
Obsidian (#0b0b0b) fill, 1px Graphite (#2e2e2e) border, 16px radius, 24px padding.
