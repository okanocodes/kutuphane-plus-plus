---
name: Midnight & Ember
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393e'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f24'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e8'
  on-surface-variant: '#cbc4ce'
  inverse-surface: '#e3e1e8'
  inverse-on-surface: '#2f3035'
  outline: '#958f98'
  outline-variant: '#4a454d'
  surface-tint: '#d3beeb'
  primary: '#d3beeb'
  on-primary: '#38294d'
  primary-container: '#1a0b2e'
  on-primary-container: '#88769f'
  inverse-primary: '#68577e'
  secondary: '#ffb4a4'
  on-secondary: '#630e00'
  secondary-container: '#aa2000'
  on-secondary-container: '#ffbeaf'
  tertiary: '#d3bbff'
  on-tertiary: '#3f008d'
  tertiary-container: '#1b0044'
  on-tertiary-container: '#9261ef'
  error: '#EF4444'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eddcff'
  primary-fixed-dim: '#d3beeb'
  on-primary-fixed: '#231437'
  on-primary-fixed-variant: '#4f4065'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#8c1900'
  tertiary-fixed: '#ebddff'
  tertiary-fixed-dim: '#d3bbff'
  on-tertiary-fixed: '#250059'
  on-tertiary-fixed-variant: '#581db3'
  background: '#121318'
  on-background: '#e3e1e8'
  surface-variant: '#34343a'
  ember-orange: '#FF5D3A'
  midnight-violet: '#1A0B2E'
  vivid-purple: '#5B21B6'
  accent-gold: '#FFB800'
  accent-pink: '#FF3D81'
  success: '#10B981'
typography:
  display-lg:
    fontFamily: Clash Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-h1:
    fontFamily: Clash Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-h1-mobile:
    fontFamily: Clash Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-h2:
    fontFamily: Clash Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
  headline-h3:
    fontFamily: Clash Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
  label-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
  metadata-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 24px
  margin-desktop: 32px
  margin-mobile: 16px
---

## Brand & Style

This design system reimagines library management through the lens of modern ed-tech and streaming platforms. It rejects the traditional "institutional" aesthetic in favor of a **Bold, Energetic, and Academic** personality. The visual language is high-contrast and tech-forward, designed to feel more like a premium SaaS product than a static catalog.

The design style is **Corporate / Modern** with a **High-Contrast** edge. It utilizes deep, saturated backgrounds, vibrant accent "glows," and generous whitespace to balance high information density with a dynamic, cinematic feel. The interface is optimized for both professional librarians and students, providing a sophisticated environment for "compiled knowledge."

## Colors

The palette is anchored by the "Midnight & Ember" duo-tone. The default mode is **dark**, emphasizing the streaming-platform aesthetic. 

- **Primary (Midnight):** Used for deep backgrounds and structural anchoring.
- **Secondary (Ember):** The high-priority action color for "Reserve" and "Borrow" functions.
- **Tertiary (Vivid Purple):** Used for primary branding elements, active states, and navigation.
- **Neutral:** A cool, high-clarity white/gray used for maximum legibility against dark backgrounds.

**Gradients** should be used sparingly for high-impact areas like hero banners and empty states:
- **Hero:** `linear-gradient(135deg, #5B21B6 0%, #FF3D81 100%)`
- **Warm:** `linear-gradient(135deg, #FF5D3A 0%, #FFB800 100%)`

## Typography

The typography system creates a sharp distinction between editorial headings and functional data.

- **Headings:** Use Clash Display for all display and headline levels. This adds a geometric, modern character to the library's identity. 
- **Body:** Inter is the workhorse for all UI elements, tables, and long-form descriptions, ensuring readability across all devices.
- **Data/Metadata:** JetBrains Mono is utilized specifically for ISBNs, QR codes, call numbers, and dates. This technical touch reinforces the "compiled knowledge" theme.

Full support for Turkish characters is mandatory across all typefaces. Ensure proper kerning for characters like *ğ, ü, ş, ı, ö, ç*.

## Layout & Spacing

The design system employs a **Fluid Grid** model based on a **4px base unit**.

- **Desktop:** 12-column grid, 1280px max-width, 24px gutters.
- **Tablet:** 8-column grid.
- **Mobile:** 4-column grid with 16px side margins.

Spacing should follow the defined scale to maintain a rhythmic vertical flow. Use `xl` (32px) and `xxl` (48px) for section breathing room, while `sm` and `md` handle internal component grouping. Tables should remain dense but legible, utilizing `label-sm` typography with `sm` (8px) vertical padding.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Glows**.

- **Surface Layers:** In dark mode, the base background is `primary-900`. Secondary surfaces (sidebars, card backgrounds) use `primary-700` to create subtle separation without heavy borders.
- **Interactive Depth:** Primary action buttons and featured book covers utilize a soft, tinted glow (`--shadow-glow-accent`) rather than traditional black shadows. This creates a "backlit" effect reminiscent of high-end entertainment apps.
- **Overlays:** Modals and drawers use a backdrop blur (glassmorphism) to maintain context while focusing user attention.
- **State Changes:** Hover states on cards should include a subtle upward translation (-4px) combined with an intensified glow.

## Shapes

The shape language is **Rounded**, balancing modern approachability with structured professional design.

- **Primary Radius:** 0.5rem (8px) for inputs and small buttons.
- **Large Radius:** 1rem (16px) for cards and book cover images.
- **Extra Large Radius:** 1.5rem (24px) for modals and hero panels.
- **Pill Shape:** Used for search bars, badges, and status chips to distinguish them from actionable buttons.

Book covers should strictly maintain a **2:3 aspect ratio** with rounded corners to ensure a consistent grid appearance.

## Components

- **Buttons:** Primary buttons use `ember-orange` with white text. Secondary buttons use `vivid-purple`. Both feature a subtle scale down (0.97) interaction on click.
- **Input Fields:** Use a dark `primary-700` background with a `neutral-400` placeholder. On focus, the border shifts to `vivid-purple` with a 2px offset ring.
- **Chips & Badges:** Categorical chips (e.g., "Fiction", "History") use pill shapes with low-opacity `vivid-purple` backgrounds. Status badges (e.g., "Available") use solid `success` green.
- **Cards:** Book cards should prioritize the cover art. Text metadata is tucked beneath the cover using `label-sm`.
- **Search Bar:** A prominent, full-width pill-shaped search bar with a persistent search icon and `vivid-purple` focus ring.
- **Navigation:** The sidebar uses a vertical layout with `ember-orange` active indicators (left-side border) for the current page.
- **Lists:** Data tables use a "zebra-free" approach, relying on subtle `neutral-200` dividers and a row hover effect (`primary-100` at 5% opacity).