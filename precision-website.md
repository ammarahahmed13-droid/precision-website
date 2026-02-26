# Precision Website — Bricks Builder Notes

## Key Gotchas
- **CSS variables don't resolve inside Bricks Code elements** (especially with "Render without wrapper" ON). Always use hardcoded values (hex colors, px, font names) instead of var(--custom-prop).
- **Bricks overrides flexbox properties** on elements inside Code blocks. For marquee/scrolling layouts, use `display: inline-block` + `white-space: nowrap` instead of flex. This is the only reliable way to prevent line wrapping.
- **Logos use `display: inline-flex`** with `vertical-align: middle` for inline flow controlled by `white-space: nowrap`.

## Working Scroll Bar (Logo Marquee) Approach
- Single `.logo-strip-track` with `display: inline-block` and `white-space: nowrap`
- All logos (Set A + Set B clone) are flat children — no nested wrapper divs
- Spacing via `margin` not flex `gap`
- Animation: `@keyframes marquee { 0% { translateX(0) } 100% { translateX(-50%) } }`
- Hover pauses animation

## Design Tokens (Hardcoded)
- Background base: #0B0B1E (sections), #0B0B1A (scroll bar)
- Card surface: #15152E
- Text primary: #FFFFFF
- Text secondary: #D1D5DC
- Text muted: #7B7B8E
- Accent cyan: #00BFFF
- Accent purple: #7B68EE / #A78BFA
- Accent red: #F87171
- Accent magenta: #C71585
- Font: 'Inter', sans-serif
- Always use `!important` on heading colors — Bricks theme overrides h2/h3 with yellow/gold on frontend
- Always use `-webkit-text-fill-color: #FFFFFF !important` on heading tags for the same reason

## Font Sizes (Established — ALL in px, never rem)
### Section Header
- Section label (e.g. "METHODOLOGY"): 13px, weight 600, letter-spacing 0.12em, with 28px × 1.5px cyan line `::before`
- Section heading: 48px base → 40px mobile → 64px tablet → 72px desktop
- Section subtext: 20px base → 18px mobile → 20px tablet → 21px desktop, max-width 820px

### Card Content
- Card tag/heading (h3): 21px desktop, 19px mobile
- Card subtitle (uppercase): 12px, letter-spacing 0.10em
- Card body: 16px desktop, 15px mobile
- Card blockquote: 15px desktop, 14px mobile

### Section Structure (consistent across all Bricks Code Blocks)
- Section padding: 80px 24px (mobile: 60px 0, tablet+: 120px 40px)
- Inner container: max-width 1120px, margin 0 auto, no inner padding
- Header: flat elements with individual margins (label mb 24px, heading mb 24px, subtext margin 28px auto 72px auto)
- Card border-radius: 32px, padding: 36px 32px (mobile: 28px 24px), gap: 18px
- Grid gap: 24px (tablet+: 28px)
- Cards grid max-width: 960px

## Mobile Carousel Arrow Pattern
- Used for sections with horizontally scrollable cards on mobile (<768px)
- Cards become `flex: 0 0 86vw` with `scroll-snap-type: x mandatory`
- Arrow buttons: 44px circles, border `rgba(255,255,255,0.12)`, bg `rgba(21,21,46,0.80)`
- Chevron SVGs: 16x16, stroke #D1D5DC
- Arrow placement logic:
  - First card (only next arrow): `justify-content: flex-end` (right side)
  - Middle card (both arrows): `justify-content: center`
  - Last card (only prev arrow): `justify-content: flex-start` (left side)
- Hidden arrows use `display: none` (not visibility:hidden) so they don't take space
- Nav hidden entirely on screens ≤360px (swipe only)

## Card Hover Effects
- Default (cyan): border `rgba(0,191,255,0.25)`, glow `rgba(0,191,255,0.10)`
- Purple variant: border `rgba(139,111,238,0.30)`, glow `rgba(139,111,238,0.14)`
- Red variant: border `rgba(224,53,101,0.28)`, glow `rgba(224,53,101,0.12)`
- All cards: `translateY(-3px)` on hover (disabled on mobile)

## ROI Calculator Section
- Card bg (top half): #0F0F24, border-radius 32px desktop / 28px mobile
- Bottom half (results panel): #1A1A36, applied via JS `style.setProperty` (CSS alone gets stripped by Bricks blanket reset)
- Mobile seamless split: negative margins on results panel to reach card edges, bottom-only border-radius `0 0 28px 28px`
- Divider hidden on mobile (`display: none`), visible vertical line on desktop via grid `1fr 1px 1fr`
- **Key lesson: Use JS inline styles for backgrounds on inner divs** — Bricks blanket reset kills CSS backgrounds regardless of specificity

## Conversion Accelerator Panel Sizes (CONFIRMED — use px)
- Panel title: 36px desktop, 28px mobile
- Panel desc: 18px desktop, 16px mobile
- Deliverable text: 15px both
- Deliverable check circle: 26px, border-radius 50%, bg var(--acc-color-bg), border 1.5px solid var(--acc-color)
- Goal title: 18px, Goal text: 14px
- Sidebar: width 270px, period 12px, name 15px, icon wrap 38px
- Period badge: 12px, Phase label: 13px
- Mobile badges: position relative (not absolute) to avoid overlapping title
- Mobile sidebar: flex-wrap nowrap, hide text, icons only (40px)
- Mobile double-tap fix: 400ms debounce via lastTapTime, inline opacity transition
- CSS variables (--acc-color, --acc-color-bg, --acc-color-border) set via JS on wrapper DO work in Bricks
- **Use px not rem for ALL Bricks Code element content** — rem renders unpredictably. This applies to every section, not just panels

## Logo Assets
- Hosted at: s70.7b8.myftpupload.com/wp-content/uploads/2026/02/
- 13 logos: foodpanda, delivery-hero, talabat, daraz, alibaba-group, snapp-express, instagopher, weave-social, growthmentor, petal, rask, star-rapid, bazaar
- Custom height overrides: foodpanda (52/58px), daraz (52/58px), bazaar (56/62px)
