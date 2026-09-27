# SA'A SMART WORKS UI/UX Direction

## Purpose

This is the visual and interaction standard for SA'A SMART WORKS. Use it when creating new public pages, login screens, dashboards, admin modules, forms, empty states, and future Eatery surfaces.

The goal is a premium, calm, capable interface: practical enough for repeated operational work, distinctive enough to feel like SA'A SMART WORKS, and restrained enough to preserve trust.

The canonical implementation is the root Next.js application:

- Routes: `app/`
- Shared components: `src/components/`
- Global visual system: `app/globals.css`
- Brand media: `public/`
- Icons: Heroicons
- Font: Figtree from Google Fonts CDN

Do not treat the old `project/` folder as the design source. It is legacy reference material only.

### 0. Utility-first styling

Use Tailwind utility classes as the default styling mechanism for screens, layouts, forms, and admin surfaces. Keep custom CSS classes limited to shared tokens, reset rules, and a small number of reusable primitives that are genuinely shared across multiple screens.

Do not keep adding page-specific class names to the global stylesheet. If a pattern is repeated across multiple components, extract it into a shared utility or token; otherwise prefer a direct Tailwind class composition in the component.

This keeps the design system maintainable and prevents the global stylesheet from turning into a dumping ground of one-off page styling.

## Design Principles

### 1. Practical confidence

Every screen should answer three questions quickly:

1. What is this page for?
2. What can I do next?
3. What information do I need to understand before acting?

Use strong hierarchy, direct labels, visible actions, and restrained decoration.

### 2. Premium through composition

Premium does not mean adding more effects. Use:

- generous whitespace;
- precise alignment;
- clear type scale;
- layered but soft shadows;
- selective translucent surfaces;
- consistent control heights;
- high-quality imagery;
- purposeful motion.

Never wrap every paragraph in a card. Use full-width bands for page sections and cards only for repeated items or genuinely framed tools.

### 3. Glass is a material, not a default background

Use glass for:

- the floating navbar;
- repeated service cards;
- FAQ rows;
- proof tiles;
- floating controls over imagery;
- future compact dashboard controls.

Do not use glass behind long reading passages or dense tables where contrast and scanning matter more.

### 4. No invented product state

Do not present deferred capabilities as live. Authentication, inquiry persistence, email delivery, storage, and Eatery workflows are not complete unless implemented.

Use labels such as `Coming later`, `Not available yet`, or a disabled action with a clear explanation when necessary.

## Brand Tokens

The current source of truth is `app/globals.css`, but the implementation pattern is utility-first: semantic CSS tokens are defined once, then consumed through Tailwind utilities in components.

```css
:root {
	--color-primary: #ffa64d;
	--color-ink: #1f2933;
	--color-muted: #66717d;
	--color-surface: #f6f7f8;
	--color-card: #ffffff;
	--color-dark: #172b3a;
	--shadow-card: 0 18px 45px rgb(31 41 51 / 8%), 0 2px 8px rgb(31 41 51 / 5%);
}
```

### Token usage rule

Prefer semantic utility usage such as:

```tsx
<div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
	<button className="bg-primary text-primary-foreground hover:bg-primary/90">
		Sign in
	</button>
</div>
```

Do not hard-code the same hex values repeatedly inside JSX. Use the semantic token names or their Tailwind equivalents instead of introducing page-specific color constants in multiple places.

### Color usage

| Token   | Value     | Use                                                 |
| ------- | --------- | --------------------------------------------------- |
| Primary | `#FFA64D` | Main CTA, active indicators, icon wells, highlights |
| Ink     | `#1F2933` | Main text and headings                              |
| Muted   | `#66717D` | Supporting text, metadata, inactive navigation      |
| Surface | `#F6F7F8` | Page background                                     |
| Card    | `#FFFFFF` | Form surfaces and elevated content                  |
| Dark    | `#172B3A` | Footer, dark bands, high-contrast media surfaces    |

The approved dark-blue brand value remains a project decision. `--color-dark` is the current interface surface, not a final brand approval.

### Transparency recipes

Use these exact families instead of introducing random opacity values:

```css
/* Glass surface */
background: rgb(255 255 255 / 72%);
backdrop-filter: blur(22px) saturate(140%);
border: 1px solid rgb(255 255 255 / 72%);
box-shadow:
	0 18px 45px rgb(31 41 51 / 10%),
	inset 0 1px 0 rgb(255 255 255 / 90%);

/* Soft card */
box-shadow:
	0 18px 45px rgb(31 41 51 / 8%),
	0 2px 8px rgb(31 41 51 / 5%);

/* Dark image readability layer */
background: linear-gradient(
	to top,
	rgb(8 22 30 / 84%) 0%,
	rgb(8 22 30 / 48%) 12%,
	rgb(8 22 30 / 0%) 34%
);
```

Avoid heavy black overlays, full-page blur, neon colors, and decorative blobs.

## Typography

### Font

Use Figtree as the product font. It is loaded in `app/globals.css`.

```css
font-family: "Figtree", sans-serif;
```

Do not introduce Inter, Roboto, Arial, or a second display family for new UI. Existing fallback declarations may remain for compatibility, but new components should inherit Figtree.

### Type scale

Use responsive sizes only for true display headings. Do not scale every text element with the viewport.

| Role       | Recommended size             | Line height | Weight     |
| ---------- | ---------------------------- | ----------- | ---------- |
| Page H1    | `clamp(2.35rem, 5vw, 4rem)`  | `1.12`      | 700        |
| Section H2 | `clamp(1.8rem, 3vw, 2.8rem)` | `1.12`      | 700        |
| Card H3    | `1.2rem`                     | `1.12`      | 700        |
| Body lead  | `1.12rem`                    | `1.65`      | 400        |
| Body       | `1rem`                       | `1.65`      | 400        |
| Eyebrow    | `.72rem`                     | normal      | 800        |
| Metadata   | `.75rem` to `.86rem`         | `1.4`       | 600 to 800 |

Headings should wrap naturally. Use a `max-width` in characters for readability; do not force long words into cramped controls.

## CSS Hygiene And Global Styles

The global stylesheet is not a catch-all for one-off page styling. It should remain concise and intentional.

Use it for:

- root theming tokens;
- shared resets and base typography;
- a very small set of reusable primitives that genuinely repeat across multiple pages;
- rare cross-cutting utilities such as glass surfaces or shell scaffolding only when they are not adequately expressed by Tailwind composition.

Do not use it for:

- admin-specific card styles;
- one-off form treatment;
- page-local button classes;
- repeated layout patterns that can be expressed with utility classes.

When in doubt, prefer the component-local Tailwind class string over a new global CSS selector.

## Layout Geometry

### Container

The shared `.shell` is the standard content rail:

```css
.shell {
	width: min(100% - 2.5rem, 72rem);
	margin-inline: auto;
}
```

This means:

- desktop maximum content width: `72rem` / `1152px`;
- standard horizontal gutter: `1.25rem` / `20px` on smaller screens;
- effective wide-screen gutter: `1.25rem` minimum;
- content remains centered.

Do not create page-specific container widths unless the content type requires it.

### Section spacing

Use `.section-space` for major bands:

```css
.section-space {
	padding-block: 5rem;
}
```

Use smaller spacing for compact controls and larger whitespace only for a true hero. Do not stack multiple `5rem` paddings around small pieces of content.

### Grid guidance

- Three equal columns: service summaries and comparable categories.
- Two columns: FAQ intro/list, detail intro/capabilities, contact information/form.
- One column: mobile layouts, narrow forms, long service lists.
- Every grid must collapse intentionally at the `52rem` breakpoint.
- Dense lists should use full-width rows or two equal columns depending on the task.

## Navigation

The navbar is a floating glass capsule inside a sticky header.

### Desktop dimensions

- Header top padding: `.75rem`.
- Inner minimum height: `4.5rem`.
- Inner horizontal padding: `0.75rem` right, `1.25rem` left.
- Border radius: `999px`.
- Glass blur: `22px`.
- Saturation: `140%`.
- Navigation gap: `.25rem`.
- Navigation link padding: `.65rem .9rem`.
- CTA radius: `999px`.
- CTA padding: `.72rem 1rem`.

### Navigation behavior

- Use `aria-current="page"` on the active route.
- Nested service URLs must keep Services active.
- Active desktop links use the orange 2px underline, not a filled background.
- The CTA says what happens next: `Start a conversation`.
- Mobile uses a visible menu button with `aria-expanded` and `aria-controls`.
- Mobile menu rows are at least `.8rem` vertical padding and remain touch-friendly.

### Logo

Use the shared `Logo` primitive and the official `/favicon.png` asset. Do not draw a replacement mark in CSS or SVG.

Current visible brand treatment:

- asset: `48px` by `48px`;
- radius: `.85rem`;
- brand text: `SA'A SMART WORKS`;
- no apostrophe or whitespace in the displayed brand name;
- no line wrap in the brand name.

## Buttons And Links

### Primary button

Use the existing `.button` pattern:

- background: `#FFA64D`;
- text: ink color;
- radius: `.5rem`;
- padding: `.8rem 1.1rem`;
- icon gap: `.5rem`;
- font size: `.88rem`;
- font weight: `800`.

Hover should use a small upward movement of `2px` and a soft shadow. Do not add bounce or large scale effects.

### Text links

Use text links for low-emphasis navigation and inline discovery. Pair with a Heroicon when the action is directional. Use `aria-label` when an icon-only control would otherwise be ambiguous.

### Icon buttons

- Use Heroicons only.
- Provide an accessible label.
- Keep the hit area at least `2.5rem` square.
- Use the orange surface for primary directional controls.
- Use a translucent white surface over imagery.

## Cards And Glass Panels

Cards are for repeated, comparable items. They should not become page wrappers.

### Standard card

- Radius: `1rem`.
- Padding: `1.5rem`.
- Background: `--color-card`.
- Shadow: `--shadow-card`.
- Gap: `.8rem`.

### Premium glass card

Use:

- border: `1px solid rgb(255 255 255 / 78%)`;
- radius: `1.5rem` for large panels;
- background: `linear-gradient(120deg, rgb(255 255 255 / 78%), rgb(255 255 255 / 42%))`;
- `backdrop-filter: blur(20px) saturate(125%)`;
- layered shadow and one inset highlight.

### Service cards

Service category cards are full-width vertical panels. Their inner capability list can use two columns on desktop and one column on mobile.

Each capability tile should have:

- minimum height: `3.2rem`;
- gap: `.7rem`;
- radius: `.85rem`;
- padding: `.65rem .75rem`;
- a numbered `.service-bullet` tile;
- a full-width row on narrow screens.

## Media And Carousels

The shared component is `src/components/shared/image-carousel.tsx`.

### Full-bleed carousel

Use on non-home public page heroes when imagery should lead the page:

- width: `100%`;
- height: `calc(100svh - navbar offset)` when a viewport hero is intended;
- image uses `next/image` with `fill` and `object-fit: cover`;
- dark readability gradient rises from the bottom;
- controls sit over the image in translucent circular buttons;
- text animates in on mount and slide changes.

Do not make the full-bleed carousel sticky unless the page specifically needs persistent media. It must end before cards and content continue.

### Contained homepage carousel

Use the `contained` prop for a visual section within the homepage flow:

- width: `min(100% - 2.5rem, 72rem)`;
- centered with `margin-inline: auto`;
- vertical padding: `1rem 0 5rem`;
- frame height: `clamp(24rem, 48vw, 38rem)`;
- radius: `1.5rem`;
- shadow: `0 24px 60px rgb(31 41 51 / 14%)`.

### Carousel text

- Use a short eyebrow/credit.
- Use a clear label as the headline.
- Add one supporting paragraph.
- Use gradient headline text sparingly: white to pale orange to primary orange.
- Never put long paragraphs over a busy image without a bottom readability layer.

### Motion

- Image entrance: approximately `900ms`, premium ease curve.
- Copy entrance: approximately `800ms`, delayed by `120ms`.
- Autoplay interval: approximately `5.5s`.
- Hover pauses autoplay.
- Respect `prefers-reduced-motion` by disabling animation and transitions.

## Homepage Sections

### What we do

Use three comparable service cards. Each card needs:

- a category-specific Heroicon;
- a visible category number;
- short title and tagline;
- a clear route to the service detail page;
- consistent height and spacing.

### Why work with us

Use a split layout:

- left: short explanation plus four proof tiles;
- right: visual business-unit teaser or supporting media;
- proof tiles are glass surfaces with numbered labels and semantic icons;
- use real text, not generic marketing filler.

### Eatery teaser

SA’A Eatery is a future business unit. It may appear as a visual teaser, but it must be labelled honestly, for example:

- `Coming later`
- `Future business unit`

Do not link to an unimplemented Eatery route or imply that ordering, wallets, or menus are live.

### FAQ

The FAQ is the last homepage main-content section before the footer.

- Use one open item at a time.
- Trigger must be a real `<button>`.
- Include `aria-expanded` and `aria-controls`.
- Use a grid row transition from `0fr` to `1fr`.
- Rotate the plus icon `45deg` when open.
- Use opacity and translate transitions for answer text.
- Disable motion under `prefers-reduced-motion`.

## Footer

The footer is a dark, high-contrast information band.

### Desktop structure

Use four columns:

1. Brand, mission, and conversation CTA.
2. Company links.
3. Service category links.
4. Contact details.

Current layout proportions are approximately:

```css
grid-template-columns: 1.6fr repeat(3, 1fr);
gap: 2rem;
```

Footer link text uses subdued white, changing to primary orange on hover. The bottom bar uses a top divider and small metadata text.

### Footer rules

- Only link to implemented routes.
- Keep email as a real `mailto:` link.
- Do not invent social channels or phone numbers.
- Keep the footer useful on mobile by collapsing to one column.

## Forms And Inputs

Forms must be designed for eventual server-side validation.

### Input geometry

- Full available width inside its grid cell.
- Border: `1px solid rgb(31 41 51 / 18%)`.
- Radius: `.5rem`.
- Padding: `.75rem`.
- Background: white.
- Two-column form grid on desktop.
- Single-column form grid on mobile.
- Long fields such as subject and message span the full grid.

### Labels

- Use a real `<label htmlFor="...">` for every field.
- Keep optional text inline with the label.
- Use useful placeholders, not examples that look like submitted data.
- Use `autocomplete` where appropriate.
- Match names to `src/validation/inquiry.ts`:
  - `name`
  - `email`
  - `phone`
  - `organization`
  - `categoryId`
  - `serviceId`
  - `subject`
  - `message`

### Focus

Inputs should not jump or create extra layout space on focus. Use an inset focus border:

```css
outline: none;
border-color: var(--color-primary);
box-shadow: inset 0 0 0 1px var(--color-primary);
```

Keep the global visible focus treatment for buttons and links.

## Login Page Recipe

Authentication is not implemented yet. When it is added, use this structure:

- Full surface background, not a marketing hero.
- Centered form shell, maximum width approximately `28rem`.
- Logo at `48px`.
- Heading no larger than `2.25rem`.
- One primary action.
- Clear field errors below the relevant field.
- Password visibility control as an accessible icon button.
- Keep provider buttons or social login out unless the provider is approved.
- Do not claim authentication works until server authorization exists.

Suggested visual structure:

```text
full page surface
  centered glass form panel
    brand mark
    heading
    supporting line
    labelled fields
    primary submit button
    recovery/support link
```

## Dashboard/Admin Page Recipe

Admin pages should be denser and more operational than public marketing pages.

- Keep the shared brand tokens but reduce decorative glass.
- Use a stable sidebar or top navigation.
- Use page-level sections rather than nested card stacks.
- Use cards only for metrics, repeated records, and framed tools.
- Use compact row heights around `3.25rem` to `4rem`.
- Prefer tables, filters, badges, and clear empty states.
- Keep main content max width around `80rem` if tables require it.
- Maintain visible focus, keyboard navigation, and clear status text.
- Authorization must be server-side; hiding a link is not authorization.

### Dashboard hierarchy

1. Page title and one-sentence context.
2. Primary action aligned to the title.
3. Summary metrics or status strip.
4. Filters/search.
5. Main table/list.
6. Empty, loading, and error states.

Avoid hero-sized headings in admin screens. Use compact headings that support scanning.

## Responsive Rules

### Wide desktop

- Use the `72rem` shell.
- Keep primary content aligned to the same left edge.
- Use two- and three-column layouts only when comparison benefits.
- Do not stretch text lines indefinitely.

### Tablet and small desktop: below `52rem`

- Collapse navigation links into the mobile menu.
- Collapse two-column content into one column where readability improves.
- Keep cards full width.
- Make form grids one column.
- Keep touch targets at least `2.5rem` square.

### Narrow mobile: below `34rem`

- Shell width becomes `calc(100% - 1.5rem)`.
- Hero padding reduces to approximately `3.5rem`.
- Capability and proof grids become one column.
- Footer becomes one column.
- Carousel controls move inward to `1.25rem`.
- Never allow text or CTA labels to overflow a parent.

## Accessibility Requirements

Every new page must include:

- semantic landmarks;
- one meaningful page H1;
- labels associated with controls;
- keyboard-visible focus;
- accessible names for icon-only buttons;
- `aria-current` for active navigation;
- `aria-expanded` and `aria-controls` for disclosure controls;
- no color-only status meaning;
- sufficient contrast over glass and images;
- reduced-motion support;
- no disabled-looking control presented as live functionality.

## Implementation Checklist

Before calling a new page complete:

- [ ] Uses the root App Router route structure.
- [ ] Uses shared shell, header, footer, and tokens.
- [ ] Uses Figtree and the approved color tokens.
- [ ] Has one clear H1 and an intentional content hierarchy.
- [ ] Uses Heroicons rather than a new icon library.
- [ ] Uses real routes and does not invent unavailable integrations.
- [ ] Works below `52rem` and below `34rem`.
- [ ] Has empty/loading/error states where data is asynchronous.
- [ ] Has keyboard and reduced-motion behavior.
- [ ] Keeps component responsibilities focused and generally below 200 lines.
- [ ] Uses `next/image` for content images and whitelists remote hosts in `next.config.ts`.
- [ ] Keeps domain/database logic out of presentation components.
