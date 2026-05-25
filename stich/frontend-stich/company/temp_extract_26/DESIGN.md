---
name: Lumina Intelligence
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e4'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fe'
  surface-container: '#efecf8'
  surface-container-high: '#e9e6f3'
  surface-container-highest: '#e4e1ed'
  on-surface: '#1b1b23'
  on-surface-variant: '#464554'
  inverse-surface: '#303038'
  inverse-on-surface: '#f2effb'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#8127cf'
  on-secondary: '#ffffff'
  secondary-container: '#9c48ea'
  on-secondary-container: '#fffbff'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#fcf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ed'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  max_width: 1280px
---

## Brand & Style

The design system is engineered to evoke a sense of "Effortless Precision." It targets high-growth tech talent and modern recruiters who demand a tool that feels as intelligent as the AI powering it. The aesthetic is a sophisticated blend of **Minimalism** and **Glassmorphism**, drawing heavy influence from the high-fidelity execution of Stripe and Linear. 

The emotional response should be one of calm confidence—professional enough for enterprise utility, yet vibrant enough to feel like the future of work. Visual depth is achieved through translucent layers, microscopic border details, and intentional white space, ensuring the interface feels "airy" despite the density of data.

## Colors

This design system utilizes a high-clarity light mode palette. The core identity is driven by the blue-to-purple gradient, reserved for primary actions, branding elements, and AI-state indicators. 

- **Functional Accents:** Emerald green signifies high "JobFit" scores and success states. Warm orange is utilized for "in-review" statuses and attention-required alerts. Soft pink is used sparingly for decorative highlights or secondary AI insights.
- **Backgrounds:** Surfaces use a tiered system of light neutrals. The base layer is a soft off-white, while interactive cards leverage semi-transparency and backdrop-blur to create a "glass" effect that maintains legibility over subtle background mesh gradients.

## Typography

The design system relies exclusively on **Inter** to project a clean, systematic, and utilitarian feel. The hierarchy is established through aggressive scale and weight contrast rather than multiple typefaces.

- **Headlines:** Use tight letter-spacing and heavy weights for a modern, editorial look.
- **Body:** Prioritizes readability with generous line heights and standard tracking.
- **Labels:** Small, uppercase labels with increased tracking are used for metadata, categories, and secondary job details to provide a technical, structured feel.

## Layout & Spacing

The design system employs a **Fixed Grid** philosophy for dashboard views and a **Fluid Content** model for mobile-responsive states. 

- **Grid:** A 12-column grid with 24px gutters is the standard for desktop. 
- **Rhythm:** All spacing follows a 4px/8px incremental scale. 
- **Containers:** Content is housed in "glass" containers with consistent 32px or 40px internal padding to maintain the premium, spacious atmosphere characteristic of high-end SaaS tools.

## Elevation & Depth

Depth in this design system is created through a "Stacking" logic using **Glassmorphism** and **Ambient Shadows**:

1.  **Level 0 (Base):** Subtle radial gradients (#f9fafb to #eff6ff).
2.  **Level 1 (Cards):** Background blur (20px), white opacity (70%), and a 1px solid border (white 40%) to catch light. A very soft, diffused shadow (Y: 4px, Blur: 20px, Opacity: 4%) is applied.
3.  **Level 2 (Popovers/Modals):** Increased blur (40px) and a more pronounced shadow (Y: 12px, Blur: 32px, Opacity: 8%) to signify priority.

Shadow colors should never be pure black; they are tinted with a hint of the primary blue to maintain the vibrant tech aesthetic.

## Shapes

The shape language is defined by the **rounded-xl** standard. This specific radius (12px-16px) is applied to all primary containers and cards to soften the technical nature of the AI platform and make it feel more approachable. 

- **Interactive Elements:** Buttons and input fields use a slightly smaller 12px radius to maintain a crisp, functional appearance.
- **Badges:** Small badges (e.g., job tags) use a fully rounded "pill" shape (9999px) to contrast against the structured rectangular grid of the cards.

## Components

- **Buttons:** Primary buttons feature the blue/purple gradient with a white label and a subtle inner-glow effect on hover. Secondary buttons use a transparent background with a 1px "glass" border.
- **Glass Cards:** The signature component. These must include a `backdrop-filter: blur(12px)` and a top-weighted white-to-transparent border to simulate reflected light on an edge.
- **Modern Inputs:** Input fields are minimal, featuring only a bottom border or a very faint 1px surround. On focus, the border transitions to the primary gradient.
- **Refined Badges:** Used for "Match %" or "Skills." They should use a low-opacity version of the accent colors (Emerald, Orange, Pink) with high-contrast text.
- **AI Insight Chips:** Specialized components that pulse slightly with the primary gradient to indicate real-time AI processing or suggestions.
- **Job Lists:** Use a "Hover-Lift" effect where the card background increases in opacity and the shadow deepens when the user interacts.