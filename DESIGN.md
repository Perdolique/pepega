---
version: alpha
name: Pepega
description: Warm paper, bold outlines, hard shadows, and clear tools for Twitch communities.
colors:
  primary: "#FFD84D"
  primary-hover: "#FFE070"
  page: "#FFF4DD"
  surface: "#FFFDF7"
  subtle: "#F1E3C4"
  text: "#26201A"
  muted: "#5C5347"
  shadow: "#26201A"
  accent: "#FF5C2B"
  rose: "#FFB9CC"
  sky: "#A5DCFF"
  mint: "#B9E6A6"
  on-fill: "#26201A"
  success: "#245530"
  warning: "#704B00"
  warning-surface: "#FFF0BD"
  danger: "#A52A27"
  danger-surface: "#FFE0DA"
  on-danger: "#FFFDF7"
  overlay: "#26201A99"
  dark-primary: "#D4AC50"
  dark-primary-hover: "#E1BC67"
  dark-page: "#1E1A16"
  dark-surface: "#2B2520"
  dark-subtle: "#3C342B"
  dark-text: "#F5EBD8"
  dark-muted: "#C7BAA8"
  dark-shadow: "#0C0A08"
  dark-accent: "#F58A66"
  dark-rose: "#D897B3"
  dark-sky: "#91BDDB"
  dark-mint: "#A6C993"
  dark-on-fill: "#26201A"
  dark-success: "#A6C993"
  dark-warning: "#E1BC67"
  dark-warning-surface: "#D4AC50"
  dark-danger: "#FFAAA4"
  dark-danger-surface: "#E49AA1"
  dark-on-danger: "#26201A"
  dark-overlay: "#0C0A08B8"
typography:
  display:
    fontFamily: '"Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif'
    fontSize: 4.25rem
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.02em
  display-compact:
    fontFamily: '"Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif'
    fontSize: 2.5rem
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.02em
  page-title:
    fontFamily: '"Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif'
    fontSize: 2.5rem
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -0.01em
  page-title-compact:
    fontFamily: '"Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif'
    fontSize: 2rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.01em
  section:
    fontFamily: '"Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif'
    fontSize: 1.75rem
    fontWeight: 800
    lineHeight: 1.2
  card-title:
    fontFamily: '"Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif'
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  metric:
    fontFamily: '"Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif'
    fontSize: 2rem
    fontWeight: 800
    lineHeight: 1.15
  body:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: 0.875rem
    fontWeight: 700
    lineHeight: 1.4
  button:
    fontFamily: '"Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif'
    fontSize: 1rem
    fontWeight: 700
    lineHeight: 1.25
  meta:
    fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace'
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.04em
rounded:
  none: 0px
  control: 10px
  card: 14px
  bubble: 16px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  control-min: 44px
  page-max: 880px
  wide-max: 1120px
  form-max: 640px
  dialog-max: 480px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-fill}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "{spacing.md}"
---

# Pepega design system

## Overview

**Design revision:** 1.0. **Research date:** 2026-10-04. **Rollout:** target specification; the application has not yet been redesigned.

This file defines the new visual identity and UI/UX rules for Pepega. Use it for the full redesign and for later changes to existing or new features. The old visual design is not a source for colors, layout, typography, or component appearance. Existing routes, data contracts, permissions, and useful behavior remain product requirements.

The direction is **warm, playful neobrutalism**: cream paper, rounded display type, dark outlines, flat color blocks, and solid offset shadows. This is a useful description, not a verified name used by the reference's author. Exact rules below matter more than the style label.

### How to use this file

1. Read this overview, the foundations, and the recipe for the affected page.
2. Identify the user's task, the real data, and the states the change can reach.
3. Build with the tokens and component contracts here. Check narrow layouts and both themes before adding decoration.
4. Use the acceptance checklist before calling the work complete. Update this file when a shared design decision changes.

The YAML block holds exact color, type, spacing, radius, and component values. The body defines their use, responsive changes, and behavior. Use `spacing.control-min` as a minimum control height, not a clipping limit. In dark mode, resolve each component color through the theme mapping in [Colors](#colors).

This follows the core structure of Google's [DESIGN.md format](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md), which is still alpha. `version: alpha` describes that format, not Pepega's design revision. The file is a human and agent contract; it does not automatically load into an agent or generate application CSS. Include it in the context of UI tasks. Repository instructions still control development workflow.

Explicit task requirements and product contracts take priority over decorative choices. When this document and its implementation disagree, resolve the difference in the same change. Do not silently treat old CSS, a new screenshot of the reference, or a generic UI kit as a replacement specification.

### Product scope

Pepega serves Twitch streamers and viewers. People need to understand setup, connect services, and change settings without losing their place. The visual tone can be playful; operational feedback must be clear.

The initial inventory comes from repository commit `d3a1b65`. It records behavior and available data, not the old appearance.

| Surface | Current contract | Redesign goal |
| --- | --- | --- |
| `/` | Public entry page | Explain the supported service and offer Twitch sign-in or a return to the dashboard. |
| `/login`, `/auth/twitch` | Twitch OAuth, loading, failure, return destination | Make the external sign-in step and recovery clear. Preserve the return destination. |
| `/dashboard` | Authenticated placeholder | Show a useful next setup action using existing account, channel, and notification data. |
| `/account` | Viewer/streamer role; Telegram channel creation, verification, deletion | Make account state visible and channel setup easy to resume. |
| `/notifications` | Streamer access; `stream.online` webhook creation and registration | Separate connection state from notification configuration. |
| `/settings/notifications/stream-online` | Notification record, verified Telegram channel selection, message, destinations, deletion | Guide one complete setup task with clear prerequisites. |
| `/admin` | Subscription fetch and removal | Use a compact, readable operations view; preserve admin access rules. |

The README mentions polls, rewards, and auctions. No matching UI routes were found in this inventory. They are future design cases, not features to advertise as available. A heatmap, public activity feed, sponsor rail, browser subscription, and email signup are reference features, not new Pepega requirements.

### Reference audit

The user-selected visual reference was inspected live on the research date. Evidence includes screenshots, computed styles, and public CSS. The findings below define the design direction without depending on an external site's identity or asset URLs.

| Observed layer | Measured or tested evidence |
| --- | --- |
| Page | Centered 880px outer frame; 24px desktop and 16px mobile gutters. |
| Surfaces | `#FFF4DD` paper, `#FFFDF7` cards, `#26201A` ink; 2px borders. |
| Shape and depth | 14px cards; pill controls; solid 3px, 4px, and 6px offset shadows. |
| Type | Baloo 2 headings, system body, monospace metadata; large highlighted result. |
| Composition | Short introduction → controls → main result → three metrics → history → announcements. |
| Detail | Faint 18px dot grid, slight card rotation, colored metric tiles, speech bubbles. |
| Interaction | Pressed controls lose shadow. Email expands inline and receives focus. Language menu closes with Escape and restores focus. History expands from three entries to all entries. |
| Responsive | At 640px, controls simplify and graph cells shrink; history scrolls inside its panel. |
| Themes | Warm dark surfaces, pale outlines, black shadows, and muted fills preserve the identity. |

Desktop light/dark and mobile light were inspected visually. Widths 1440, 768, 390, and 320 CSS pixels were checked. Notification permissions, subscription submission, reaction writes, delivery, and unavailable server-error states were not tested. This is a design audit, not an accessibility certification.

### What Pepega takes from the reference

| Keep | Adapt for Pepega |
| --- | --- |
| Strong focal point | Lead with the next useful action or real state. Use a large number only when the number matters. |
| Paper, outline, and hard shadow | Use one shared surface system across navigation, forms, and feedback. |
| Rounded headings and small technical labels | Keep longer instructions in normal body type. Keep metadata readable on phones. |
| Color blocks and gentle irregularity | Reserve them for overview content. Forms and dense data stay level. |
| Inline expansion and progressive detail | Keep essential errors and next steps visible. Use a dialog only for a separate temporary task. |
| Warm dark mode | Define semantic theme pairs instead of applying an inversion filter. |

The reference's mobile metric labels reach 9px and graph cells reach 15px. Pepega uses larger type and targets below. Its small cream text on orange has about 3.03:1 contrast; Pepega uses dark text on that fill. Fixed sponsor rails and repeated decorative reactions do not fit the current setup tasks.

### Design principles

- **One clear task per page.** A user should find the page purpose, current state, and next action before reading secondary detail.
- **Playful edges, steady work area.** Use the expressive type, color, and shadow at page and section level. Keep fields, long text, and operational lists calm.
- **Visible truth.** Show missing setup, pending work, stale data, and failure as distinct states. An active Twitch connection alone does not prove that a notification is ready.
- **Consistent meaning.** Color names describe appearance; semantic roles describe meaning. A pink card is not automatically an error.
- **Useful density.** Group related content and allow space between tasks. Do not put every paragraph in another card.
- **Complete interaction.** Keyboard use, small screens, errors, and reduced motion are part of the design, not later polish.

## Colors

### Semantic mapping

Map the front matter to shared CSS custom properties. Components consume the role, not a light/dark branch. For example, `--color-surface` uses `colors.surface` in light mode and `colors.dark-surface` in dark mode.

| CSS role | Light token | Dark token | Use |
| --- | --- | --- | --- |
| `--color-page` | `page` | `dark-page` | Full page background. |
| `--color-surface` | `surface` | `dark-surface` | Panels, fields, menus, dialogs. |
| `--color-subtle` | `subtle` | `dark-subtle` | Neutral badges, disabled controls, quiet separators. |
| `--color-text` | `text` | `dark-text` | Main copy and headings. |
| `--color-muted` | `muted` | `dark-muted` | Supporting copy on page or surface. |
| `--color-border` | `text` | `dark-text` | Essential outlines and control boundaries. |
| `--color-focus` | `text` | `dark-text` | Keyboard focus outline. |
| `--color-shadow` | `shadow` | `dark-shadow` | Solid offset shadows. |
| `--color-primary` | `primary` | `dark-primary` | Main action and selected control fill. |
| `--color-primary-hover` | `primary-hover` | `dark-primary-hover` | Main action hover. |
| `--color-accent` | `accent` | `dark-accent` | Small emphasis and link underline decoration. |
| `--color-rose` | `rose` | `dark-rose` | Secondary overview tile. |
| `--color-sky` | `sky` | `dark-sky` | Informational fill or overview tile. |
| `--color-mint` | `mint` | `dark-mint` | Positive status fill. |
| `--color-on-fill` | `on-fill` | `dark-on-fill` | All yellow, orange, pink, blue, green, warning, and danger-tint fills. |
| `--color-success` | `success` | `dark-success` | Positive text on page or surface. |
| `--color-warning` | `warning` | `dark-warning` | Warning text on page or surface. |
| `--color-warning-surface` | `warning-surface` | `dark-warning-surface` | Warning badge or message background. |
| `--color-danger` | `danger` | `dark-danger` | Error text, error outline, destructive button fill. |
| `--color-danger-surface` | `danger-surface` | `dark-danger-surface` | Error badge or message background. |
| `--color-on-danger` | `on-danger` | `dark-on-danger` | Text on a solid destructive button. |
| `--color-overlay` | `overlay` | `dark-overlay` | Modal backdrop. |

The light identity values come from the reference. The semantic error colors and hex-based dark palette are Pepega decisions. They are not claimed as an exact copy of the reference's OKLCH dark theme.

Use neutral surfaces for most of a work page. The primary action may share yellow with a small status highlight, but it must remain the clearest action in its section. Use the rose and sky tiles only when a real comparison benefits from them. Do not cycle through colors for every form group.

A status includes a text label and, where useful, an icon. A color alone cannot mean selected, verified, failed, or required. Link text stays `text`; use an underline, including on hover. Orange may decorate the underline, but must not become small orange link text on cream.

### Contrast and themes

The target is WCAG 2.2 AA. Normal text needs at least 4.5:1; large text needs 3:1. Essential control boundaries and state graphics need 3:1 against adjacent colors. The project also keeps disabled labels readable, although inactive controls have WCAG exceptions. See [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

These ratios were calculated from the opaque sRGB tokens. Values below are rounded for display; validation must use the unrounded result.

| Foreground / background | Ratio | Intended use |
| --- | --- | --- |
| `muted` / `page` | 6.91:1 | Supporting light-theme copy. |
| `on-fill` / `primary` | 11.64:1 | Yellow action or highlight. |
| `on-fill` / `accent` | 5.23:1 | Small text on orange. |
| `on-danger` / `danger` | 6.97:1 | Destructive action in light mode. |
| `dark-text` / `dark-surface` | 12.79:1 | Main dark-theme copy. |
| `dark-muted` / `dark-surface` | 7.94:1 | Supporting dark-theme copy. |
| `dark-on-fill` / `dark-primary` | 7.53:1 | Yellow action in dark mode. |

Do not lower an entire component's opacity to create a disabled state. Use `subtle`, `muted`, the normal outline, and no shadow. Keep muted copy off colored fills; use `on-fill` there. Recheck any overlay, gradient, or translucent text background in its rendered state.

Support **System**, **Light**, and **Dark**. Start with the system preference and persist an explicit choice. Set `color-scheme` to match the active theme. Apply the same semantic variables before the first visible render so navigation does not flash the wrong theme. The theme control has a visible current value and an accessible name. It does not change layout or icon hit areas.

## Typography

### Type roles

| Token | Role and limits |
| --- | --- |
| `display` | One short hero value or message. Use `display-compact` below 640px. It is optional, not a heading required on every screen. |
| `page-title` | Page heading. Use `page-title-compact` below 640px. Allow wrapping. |
| `section` | Main task groups and important section headings. |
| `card-title` | Repeated feature cards and short panel titles. |
| `metric` | A real count or value, paired with its unit and label. Use tabular numerals. |
| `body` | Instructions, form values, user content, notification messages. |
| `small` | Hints, timestamps that need easy reading, table detail, secondary explanations. |
| `label` | Persistent field labels, status labels, and navigation. |
| `button` | Short product-owned action text. |
| `meta` | Short supplementary technical labels and IDs. Never the only text explaining an action or error. |

Keep the browser's root font size. Use `rem` for text. The default body is 16px at the usual root size; text inputs and textareas keep that size on mobile. Avoid 9–11px labels from the reference. Use uppercase only for brief metadata, with its token's letter spacing. Do not uppercase instructions, errors, navigation, or user names.

Use normal body type for channel handles, arbitrary user titles, and message previews. Baloo 2 gives English product headings the reference's rounded character. Its [published character subsets](https://github.com/google/fonts/blob/main/ofl/baloo2/METADATA.pb) do not include Cyrillic. Do not rely on a silent mix of font families inside a future Russian heading. If a Cyrillic UI locale is added, use [Nunito](https://github.com/google/fonts/blob/main/ofl/nunito/METADATA.pb) for the whole display and button family in that locale, then check line breaks and weight. This is a font rule, not a requirement to add localization now.

Use the existing font integration to serve the needed WOFF2 subsets and weights. Keep the font license with distributed assets. Show usable fallback text while the display face loads, and check that the swap does not move controls. A new font family is not needed for body or numeric metadata. [Font loading guidance](https://web.dev/articles/font-best-practices) informs this choice.

### Content and formatting

- Use sentence case and direct verbs: “Add channel”, “Verify channel”, “Connect Twitch”, “Save account type”.
- Keep visible UI copy in English for the current application. User messages may contain any supported script and emoji; preserve their content.
- Put the result before celebration: “Channel verified” is enough. One small playful detail can support success; errors stay direct and useful.
- Describe recovery: “We could not send the code. Check the bot's access and try again.” Keep raw technical errors in telemetry, not in visible copy.
- Use full labels for unfamiliar actions. An icon or a tooltip is not enough to explain “Register”.
- Format dates and numbers for the supported locale. When time affects a decision, show an absolute time and its time zone alongside relative time.
- Show a genuine zero as `0`. Show unavailable data as “Unavailable” or `—` with an explanation. Loading is not zero.

## Layout

### Shared frame and spacing

Use one centered page frame with border-box sizing. Its maximum outer width is `page-max` (880px), including 24px side padding. Below 640px use 16px side padding. The normal desktop content width is therefore 832px. A form's content can use `form-max` (640px). Use `wide-max` (1120px) only for a view with real columns that need comparison, such as the admin subscription list.

The header and main content share the same left and right edges. Keep the app header in normal document flow by default. At wide sizes it contains the Pepega mark, main navigation, theme control, and account actions. Below 640px move navigation to a labeled menu disclosure. Keep the current page visible and mark its link with `aria-current="page"`. Logout is an action, not a destination.

| Relationship | Default | Below 640px |
| --- | --- | --- |
| Main content top space | 32px | 24px |
| Independent task sections | 48px | 32px |
| Related panels | 24px | 16px |
| Panel padding | 24px | 16px |
| Form groups | 24px | 24px |
| Label → field; field → hint | 8px | 8px |
| Icon → label | 8px | 8px |
| Main content bottom space | 64px | 48px |

Use the spacing scale in front matter. A 2px stroke and the defined shadow offsets are deliberate exceptions to that spacing scale.

Use a card for an independent object or task group. Inside it, use headings, gaps, and dividers before adding another bordered surface. Most forms should have one level of card containment. Keep prose near 60–70 characters per line where space allows.

### Responsive rules

Breakpoints respond to available space, not to device names. The initial page breakpoint is 640px. It changes the header, gutters, type roles, and column count. A reusable panel can switch sooner if its own container is too narrow.

- Use one column below 640px. A group of three optional metric tiles becomes a vertical list; labels do not shrink to make three columns fit.
- Above 640px, use two columns only when both tasks remain readable. Independent overview metrics may use three columns with a 16px gap. Forms stay in reading order.
- At 320px, allow labels, buttons, names, and validation text to wrap. Use minimum heights, not fixed heights. Reserve space for shadows and focus rings.
- Keep primary action text visible. Secondary, universally understood controls may use an icon with an accessible name and a 44px target.
- Keep long handles and URLs inside their owner using wrapping. Truncate a repeated list value only when its full value is available through an accessible detail view.
- Contain necessary horizontal scrolling in a real data table or chart. Give the region a name and keyboard access. Never hide page overflow globally to conceal a broken layout.
- Preserve DOM order when columns stack. Do not move the main action ahead of the fields it submits.
- Dialogs must fit the viewport and on-screen keyboard. Their contents may scroll; the focused field and close action must remain reachable.

### Page recipes

These are target compositions. They do not claim that all required UI states already exist.

| Page | Composition | Main action and boundaries |
| --- | --- | --- |
| Public home | Compact brand header → short service explanation → one paper hero → brief explanation of supported setup. | “Continue with Twitch”; authenticated users get “Open dashboard”. Use the existing Pepega identity, not the reference author's portrait. |
| Sign-in and callback | Small centered panel → clear task title → provider action or connection state → recovery. | Start sign-in only from an explicit action. On callback failure, offer retry and return. No endless spinner. |
| Dashboard | Page heading → next setup step → relevant current setup summary. | Point to the first incomplete task. Show real role, verification, and notification state; do not fill the screen with invented engagement metrics. |
| Account | Heading → account type section → Telegram channel list and add action. | Role change uses labeled choices and explicit save. Each channel has a visible verification state and contextual actions. |
| Notifications | Heading → stream-online feature panel with connection state → configuration state and next step. | “Set up notifications”, “Connect Twitch events”, or a precise recovery action, depending on actual state. |
| Stream-online settings | Back link → heading and status → prerequisites → channel choice → message → submit → existing destinations → separate removal section. | Make it clear whether the action creates the notification record or adds a Telegram destination. |
| Admin | Heading → fetch/refresh action → result count or status → subscription rows. | Keep real identifiers and per-row removal. A wider frame is allowed; consumer pages do not inherit its density. |

The stream-online settings page should read in this order:

```text
Notifications / Stream online
Stream online notifications                 [connection state]

[Any missing prerequisite and its next action]

Telegram channel
( ) @channel_one   Verified
( ) @channel_two   Verified

Notification message
[Message field                                          ]
[Default-message explanation, preview, and character count]
[Add Telegram notification]

Existing destinations
[Provider | configured state]

Remove this notification
[Consequence text]  [Delete notification]
```

The current destination response provides provider and active state, but not its channel name or saved message. Do not invent these details or infer them from list order. A design that displays them needs a separately scoped data-contract change.

## Elevation & Depth

### Outline and shadow scale

All standard cards and controls use a **2px solid** `border` outline. Thin internal dividers may use 1px. Borders remain the same width in all states so content does not move.

| Role | Shadow | Use |
| --- | --- | --- |
| Flat | None | Form fields, badges, navigation, nested content, disabled controls. |
| Small | `3px 3px 0 var(--color-shadow)` | Buttons, compact menus. |
| Panel | `4px 4px 0 var(--color-shadow)` | Independent panels and optional metric tiles. |
| Emphasis | `6px 6px 0 var(--color-shadow)` | One hero panel or active dialog. |

Shadows are opaque, hard, and unblurred. They make the page feel like cut paper. Do not replace them with soft gray shadows, glow, glass blur, or a generic floating dashboard treatment. In dark mode, the pale outline separates a panel from its background; the shadow remains near-black.

Avoid hover lift on a noninteractive card. For a linked card, the whole card must have one clear destination. A panel with internal buttons is not also a giant hidden button.

### Motion

Use 120ms ease-out for button press/hover feedback and 180ms ease-out for opening a disclosure or popover. Favor opacity and small transforms. Do not animate height in a way that hides content or moves the active target during a click.

A small-shadow button moves `-1px, -1px` on hover and uses a 4px shadow. On press, it moves `3px, 3px` from its resting position and loses the shadow. Keep its layout box and focus target stable. On release it returns to the correct hover or rest state. Apply hover movement only where hover is available.

For `prefers-reduced-motion: reduce`, remove nonessential movement, entry animations, number rolls, and route transitions. Show final values immediately. Keep non-motion cues such as the outline, selected fill, and text. This includes the application's existing view transitions and animation library. See [reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

Use normal stacking for page content, then anchored popovers, then modal backdrops and dialogs. Toasts must not cover a dialog's controls. Keep errors owned by a dialog inside that dialog. No fixed promotional or decorative objects belong at the edges of the work area.

## Shapes

Use `card` radius for panels and menus, `control` for inputs and textareas, `bubble` only for real conversational or activity content, and `pill` for short buttons and badges. Circular icon buttons use equal dimensions and the pill radius. The shape stays consistent across themes.

Gentle irregularity is optional. A hero's decorative frame can rotate by -0.4 degrees, while its controls and reading area stay level. At widths of 640px or more, a group of three read-only overview tiles may use -1, +0.8, and -0.6 degrees. On narrow screens the tiles stay level. Do not rotate forms, menus, dialogs, tables, or destructive actions.

The hero may use a CSS dot texture: 1px dots on an 18px grid, with about 8% text-color opacity. This is decoration, not data. Keep it away from dense text and fields. One textured emphasis surface per page is enough. The application must remain recognizable with all decorative textures and rotations removed.

Use the existing Tabler icon set for actions and state cues. Use a 20px icon in normal controls and 16px in compact supporting content. Keep one stroke style. The target area is larger than the icon. Hide decorative icons from assistive technology; name icon-only controls by their action.

Use the existing Pepega asset only where it serves identity or a useful empty state. Product avatars and provider marks keep their true proportions. Give informative images useful alternative text and decorative images empty alternative text. Keep a stable fallback box for missing images. Do not copy the reference's portrait, sponsor assets, or written announcements.

## Components

### Shared interaction contract

Every new or redesigned interactive component defines its rest, hover, pressed, keyboard-focus, selected/expanded, disabled, and pending states where those states apply. A read-only value has no fake click affordance. This state coverage follows the approach in Carbon's [component checklist](https://www.carbondesignsystem.com/getting-started/contributing/component-checklist).

| State | Visual and behavioral rule |
| --- | --- |
| Rest | Correct role token, 2px outline, stable dimensions. |
| Hover | Small contrast or elevation change. No information available only on hover. |
| Pressed | Tactile shadow change on buttons; no layout shift or accidental second action. |
| Keyboard focus | 3px `focus` outline with 3px offset. Keep the gap clear against the local surface. Never rely on scaling alone. |
| Selected | Yellow fill, `on-fill` text, and semantic selected/checked state. Use a check or another visible marker when useful. |
| Disabled | `subtle` fill, `muted` text, outline, no shadow. Explain a missing prerequisite nearby. |
| Pending | Stable label and width, reserved spinner space, appropriate busy state. Prevent repeat submission without losing focus. |
| Invalid | `danger` outline plus linked error text. Keep the focus outline separate. |

Use at least a 44×44 CSS pixel target for standalone controls. Inline text links are the exception; keep clear line spacing and a visible underline. This is a Pepega usability choice, stricter than WCAG's [24px minimum with exceptions](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). A badge is not a control and does not need an artificial 44px height.

### Buttons and links

- Primary: yellow fill, `on-fill` text, pill radius, small shadow. Use one primary action in the active task group.
- Secondary: surface fill, text color, same outline and geometry. Hover may use the subtle fill.
- Quiet: underlined text link for navigation, or a flat labeled button for a low-priority action. Preserve the target size for standalone actions.
- Destructive: danger fill and `on-danger` text at the final confirmation. Keep the initial removal action separate from normal setup controls.
- Normal buttons have a minimum height of 44px, 16px horizontal padding, and an 8px icon gap. Allow multiline labels to increase height.
- A link navigates; a button changes state or submits. Style does not change that meaning.
- A pending operation keeps the same accessible purpose. Announce progress once; keep an error and retry action near the failed task.

### Panels, status badges, and lists

Panel anatomy is heading → optional necessary context → content → related actions. A header can include one status badge. Avoid repeating the same description inside both the page header and panel.

Status badges use `label` text, 4px vertical and 8px horizontal padding, a 2px outline, and no shadow. Use mint for positive state, warning-surface for waiting or attention, danger-surface for failure, and subtle for inactive state. All tinted status badges use `on-fill`; neutral badges use `text`. A blue informational badge also uses `on-fill`.

A Telegram channel row shows its handle, verification label, and appropriate action. “Verify channel” is visible for an unverified channel; it is not buried in an unlabeled hover menu. Keep removal available through a labeled contextual action. Long names wrap before pushing actions out of the panel.

Use real table markup when users compare columns, and a labeled list when each row is an independent object. Keep header labels available on narrow layouts. Preserve current selection and data during refresh. Rows that are not interactive do not lift on hover.

### Forms and choices

Give every field a persistent visible label. Put format help before it is needed, and place an error next to its field. Connect labels, help, and errors programmatically. Placeholder text is an example, not a label or a saved value.

Fields use the front matter's `field` tokens, a 2px border, and no shadow. Textareas start with enough room for at least four lines and can grow or resize vertically. Preserve the user's draft after correctable errors. For multiple errors after submit, use a focused error summary with links to the fields; for a small one-field task, focus the field and its linked error. Use `aria-invalid` for failed validation. Do not mark untouched fields as errors.

Use native radio buttons for one choice and checkboxes for independent choices. A pill-shaped segmented control is still a radio group when it selects one value. It is not a tab list unless it actually changes a tab panel. Arrow keys move among radio choices; labels remain clickable. See the [radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/).

For Telegram verification, use one code input that accepts paste and a numeric keyboard, not six unrelated boxes. Show the channel being verified and where the code is sent. Submit only when the user activates “Verify”; entering the last digit must not start a rate-limited request. Use these recovery states:

| Verification state | Feedback and next action |
| --- | --- |
| Ready to send | Explain the bot prerequisite and name the channel. Offer “Send code”. |
| Sending | Keep the dialog open and prevent a duplicate send. |
| Code sent | Confirm the destination and focus the code input. Offer “Verify”. |
| Send failed | Keep the setup context and restore “Try sending again”. Do not impose a local cooldown unless the API reports a rate limit. |
| Wrong code | Keep the value editable, identify the problem beside the field, and allow another explicit verification when the rate limit permits. |
| Code missing or expired | The current API combines these cases. Say “This code is unavailable or has expired” and offer “Send new code” when allowed; editing the old code is not the recovery. |
| Rate limited | Explain that the user must wait before retrying the affected operation. Do not invent an exact remaining duration. |
| Verified | Refresh the persisted channel state, clear the code, and return focus to the updated channel or next setup action. |

### Menus, disclosures, dialogs, and tooltips

Use a navigation disclosure containing normal links for the mobile app menu. It has an expanded state, closes with Escape, and returns focus to its trigger. Do not apply ARIA menu semantics to ordinary navigation unless the full menu keyboard model is implemented. Short secondary details can use native `details` and `summary`. See the [disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).

A popover uses the surface fill, card radius, 2px outline, and small shadow. Keep at least 8px between it and its trigger; flip or shift it to stay inside the viewport. Focused content is never clipped. Tooltips contain short nonessential help, open on keyboard focus as well as hover, and can be dismissed. Put interactive actions in a popover or dialog, not a tooltip.

A normal dialog uses `dialog-max` (480px); a task that needs more reading space may use `form-max` (640px). Keep at least 16px between the dialog and viewport edges. Use the emphasis shadow, overlay token, a visible title, and a clear close action. On small screens, use the same readable panel with internal scrolling; a full-screen wizard is not the default.

Follow the [modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): move focus inside, keep background content inert, contain Tab navigation, support Escape, and restore focus on close. Initial focus goes to the first useful field, explanatory heading, or Cancel for destructive confirmation. If the opener was removed, focus the next logical row or section action. Keep a failed submit inside the open dialog. Closing a dialog does not undo a server operation; reconcile its result without reopening a stale dialog.

### Async feedback and recovery

| State | What the user sees | Available next step |
| --- | --- | --- |
| Initial loading | Reserved panel structure and a short loading label. | Other independent page actions remain usable. |
| Background refresh | Existing data, with a quiet updating indication if useful. | Continue reading or editing. |
| Empty | What is missing and why the task needs it. | One relevant setup action. |
| Partial setup | Completed steps plus the missing prerequisite. | Continue from the missing step. |
| Submit pending | The current form and a stable busy action. | No duplicate submission; unrelated work remains available. |
| Success | Updated persisted state and short confirmation. | Continue with the next task. |
| Validation failure | The draft and precise field error. | Correct and resubmit. |
| Service failure | Plain explanation near the task, with prior useful data kept. | Retry or use the stated recovery. |
| Stale or unknown result | Last known state clearly identified; no invented success. | Refresh or reconcile before repeating a potentially completed write. |
| Access lost | Explanation of the missing account or permission. | Sign in again or return to an allowed page. |

Use one polite live announcement for a meaningful completion or status change. Do not announce every polling tick or character-count change. Reserve urgent alerts for blocking errors. A success toast can disappear after about 5 seconds if the result remains visible elsewhere. Actionable errors remain until resolved or dismissed; a toast alone cannot carry form recovery. See [status message guidance](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).

Do not add artificial delays to show off an animation. A fast response can go straight to the result. Ignore obsolete responses when the user has changed the relevant selection or left the task. Loading placeholders must not erase a valid draft or turn an unavailable result into an empty state.

### Current product state contracts

The source of truth for webhook states is [the webhook model](apps/pepega/shared/models/webhooks.ts). Use readable labels without changing their meaning.

| Stored state | User-facing label | Color role | Next step |
| --- | --- | --- | --- |
| `not_active` or no webhook | Not connected | Neutral | Create the connection if absent, then register it. |
| `pending` | Connecting | Warning | Wait for a confirmed state; prevent duplicate registration. |
| `active` | Twitch connected | Positive | Show notification and destination readiness separately. |
| `failed` | Connection failed | Danger | Explain failure and offer the supported retry. |
| `revoked` | Connection revoked | Warning | Explain the loss and guide supported reconnection. |
| Fetch failure or unknown value | Status unavailable | Neutral with explanatory error | Preserve the last known state if available; allow refresh. |

Model the setup journey as: Twitch sign-in → streamer role → Twitch event connection → Telegram channel added → channel verified → notification record created → destination with message saved. This is a dependency map, not a requirement to force one long wizard. Channel setup can happen independently; preserve completed work and return the user to the task that sent them to Account.

Important current contracts:

- `isStreamer` controls the consumer setup entry points. Viewer mode receives a clear explanation and a link to Account. Admin operations keep their existing access rules.
- Channel addition and verification are separate. Only verified channels may be selected as notification destinations.
- Codes are currently six digits. Code storage expires after five minutes. Successful code sends and verification checks have separate per-user one-minute rate limits; a failed delivery does not start a send cooldown. A repeated send can reuse an existing code, so do not restart a five-minute expiry display on every click. Use general wait/expiry guidance unless the server returns a reliable deadline.
- A notification message is limited to 500 characters by the shared application limit. Show a linked count using the same counting rule as validation. The current flow substitutes a default message for an empty draft: disclose and preview that default rather than relying on a placeholder.
- Connection creation, connection registration, notification creation, and destination creation are different operations. The UI can guide them, but must not report the whole setup as complete after only one succeeds.
- Show “Configured” only from the relevant connection, notification, and destination states. Do not label a notification “Delivered” without delivery evidence.
- Confirm destructive removal with the affected object's name and verified consequences. Do not promise undo, pause, or automatic restoration without supporting behavior.

Source entry points: [notification settings](apps/pepega/app/pages/settings/notifications/stream-online.vue), [notification models](apps/pepega/shared/models/notifications.ts), [message limit](apps/pepega/constants.ts), [channel code sending](apps/pepega/server/api/telegram/channel/[id]/send-code.post.ts), and [channel verification](apps/pepega/server/api/telegram/channel/[id]/verify.post.ts). Recheck these contracts when their implementation changes.

### Adding a future feature

Start with a short feature design brief in the task or PR:

```text
User and task:
Entry point and access:
Real data and source:
Main action and successful result:
Initial, empty, pending, failure, and partial states:
Existing layout recipe and component roles:
Keyboard order and narrow-screen behavior:
New shared decision, if any, and why existing rules do not cover it:
Evidence to check before release:
```

For a future poll, the same system could use a neutral form, a yellow main action, and text-labeled result bars. It would still need confirmed voting rules, result visibility, permissions, and empty/error states before implementation. A future auction needs its actual rules before deciding time, bids, or irreversible-action UI. These examples explain how to extend the design; they do not approve or define those features.

## Do's and Don'ts

### Practical guardrails

| Do | Avoid |
| --- | --- |
| Build recognizable paper surfaces from the shared tokens. | A generic gray dashboard with the new colors sprinkled on top. |
| Make one task and next action easy to find. | A large decorative hero on every settings screen. |
| Use color and type to explain hierarchy. | A different bright card for every paragraph or field. |
| Keep errors visible beside the task. | Auto-closing dialogs or disappearing toasts as the only error feedback. |
| Let mobile content wrap and stack. | Tiny labels, hidden primary action names, or page-level overflow clipping. |
| Keep states faithful to the API. | Fake activity, invented counters, or a “Connected” badge that implies delivery. |
| Use the new design for each fully migrated surface. | Mixing old controls and new panels in the same completed screen. |
| Reuse a component when its role and behavior match. | A universal abstraction built only for possible future features. |

### Implementation path

The current frontend uses Nuxt, Vue, CSS Modules, a global stylesheet, Nuxt Fonts/Icon, Reka UI, and motion-v. Keep these as implementation context, not as a visual template. This document does not require a new framework, CSS utility system, chart library, or component package.

1. Define the theme variables and type scale in the shared styling layer. Preserve reset behavior while replacing old appearance values. Ensure every variable resolves in both themes.
2. Rebuild the shared page frame, navigation, buttons, fields, panel, status badge, dialog, and feedback roles. Use appropriate accessible primitives already available in the project and verify their behavior.
3. Create a small development specimen with actual components: both themes, all button/field states, a long channel row, a validation error, and a dialog. This is validation work, not a new user-facing feature.
4. Migrate one complete journey first: Account channel setup and verification, then stream-online notification setup. Preserve data contracts and make missing error states explicit implementation work.
5. Apply the same foundations to sign-in, the public home, dashboard, and admin. Remove old styles only after checking remaining consumers.
6. Check the acceptance criteria below and record what was verified. Include screenshots of real implemented states in the PR.

Useful starting points are [the shared layout](apps/pepega/app/layouts/default.vue), [page wrapper](apps/pepega/app/components/PageBase.vue), [global styles](apps/pepega/app/assets/styles/base.css), [button](apps/pepega/app/components/SimpleButton.vue), [field](apps/pepega/app/components/TextInput.vue), and [dialog](apps/pepega/app/components/dialogs/ModalDialog.vue). These are migration locations, not appearance references.

### Acceptance checklist

- [ ] A first-time user can identify the page purpose, current state, and next action without opening a tooltip.
- [ ] The cream or warm-dark paper, rounded display type, 2px outlines, and hard shadows form one coherent system. Decoration supports the task.
- [ ] Both themes use the documented roles. Text, controls, status, and focus contrast pass in rendered states, not only in a token table.
- [ ] Check 320px, 390px, 768px, and 1440px widths, plus content near a breakpoint. There is no unintended page-level horizontal scroll.
- [ ] Check 200% text enlargement and reflow at 400% zoom on a 1280px-wide viewport. Necessary two-dimensional data can scroll within its own region. See [WCAG reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
- [ ] Keyboard users can reach and operate every control. Focus is visible, follows reading order, and is not hidden by overlays. See [focus visibility in context](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
- [ ] Dialogs handle initial focus, Tab, Shift+Tab, Escape, failure, close, and focus restoration. Menus and disclosures expose their state.
- [ ] Screen-reader checks cover the page title, landmarks, heading order, labels, errors, selected states, and one useful async announcement. Include a skip link to main content.
- [ ] Check reduced motion, forced colors, and missing or slow font loading. State and action meaning survive when decorative color or motion is unavailable.
- [ ] Check long channel names, Cyrillic messages, emoji, long unbroken text, the 500-character boundary, zero results, many rows, and a missing image.
- [ ] Exercise loading, partial setup, send-code failure, rate limit, expired/wrong code, registration failure, retry, refresh failure, and access loss where the changed journey can reach them.
- [ ] A failed write keeps useful input. An uncertain write is reconciled before duplication. Success reflects persisted data. Raw errors remain available in telemetry while the UI uses safe copy.
- [ ] Destructive actions name the object and consequence. If confirmation is open, the least destructive action receives safe initial focus.
- [ ] Use browser checks for changed flows and meaningful regression tests for logic. A replacement test must fail when its protected behavior is removed.

For changes to this document, run `vp run lint:markdown` and check tokens, links, and internal consistency. For UI implementation, use the repository's relevant lint, type, unit, and browser checks. Before publishing changes, run all commands required by `AGENTS.md`: `vp run lint:markdown`, `vp run lint:oxlint`, `vp run test:typecheck`, `vp run test:unit:ci`, and `vp run build`.

An optional DESIGN.md format linter can check front-matter syntax and references. Its alpha tooling may report colors as unreferenced when their use is defined in the prose or theme table. Check those roles before removing a token; do not add fake components just to suppress a warning. A format check cannot prove rendered accessibility.

This checklist defines future acceptance. Its unchecked boxes do not mean that application behavior was tested during the documentation task.

### Keeping DESIGN.md useful

The maintainer accepting a shared visual or interaction change is responsible for the matching update here. Keep documentation and implementation in the same PR when they change the same contract. Update an existing rule before adding a new overlapping paragraph.

- Change a token when its shared role changes; avoid page-specific copies of the same value.
- Add a component rule only for a real use case. Record its purpose, anatomy, variants, states, keyboard behavior, responsive behavior, and boundaries.
- A local composition of known components belongs with its feature. Promote it here when multiple real consumers need the same rule or when it defines a product-wide requirement.
- For a new shared pattern, record the need, the alternatives, and the validation evidence. GOV.UK's [contribution criteria](https://design-system.service.gov.uk/community/contribution-criteria/) are a useful model for deciding whether a pattern earns its place.
- Keep a compact decision record for major changes. Record the date, decision, reason, affected roles, and migration effect. Use Git history for the full chronology.
- If an exception is necessary, keep it beside the affected rule with its reason and scope. A temporary implementation gap needs an issue or task, not a second design standard.
- Revisit source links when changing a rule that depends on them. Reference-site changes do not automatically change Pepega's identity.
- If the file becomes hard to scan, move detailed examples to linked local documents while keeping the foundations and core contracts here. Do not duplicate authoritative token values across files.

Initial decisions:

| Date | Decision | Reason and migration effect |
| --- | --- | --- |
| 2026-10-04 | Adopt the paper, outline, rounded-type, hard-shadow direction. | User-selected reference; replaces old visual decisions across the application. |
| 2026-10-04 | Use semantic light/dark roles and explicit behavior contracts. | New features must preserve meaning, states, and readability across themes. |
| 2026-10-04 | Increase small-screen labels and standalone control targets. | Preserve the reference's character without inheriting its densest mobile details. |
| 2026-10-04 | Keep product scope grounded in current routes and APIs. | Design work must not turn planned features or partial setup into false user-facing claims. |

### Research sources and their use

These sources were reviewed on 2026-10-04. Their role is specific: the reference supplies visual evidence; system documentation supplies maintenance practices; accessibility sources supply interaction requirements. Their visual identities are not additional style references.

| Source | Decision informed |
| --- | --- |
| Visual reference audit recorded above | Direct visual, responsive, and interaction evidence. |
| [Google DESIGN.md specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md) and [tooling README](https://github.com/google-labs-code/design.md/blob/main/README.md) | Tokens plus rationale, stable section order, readable handoff to coding agents. |
| [DTCG format 2025.10](https://www.designtokens.org/TR/2025.10/format/) | Named token roles and references. Its JSON interchange format is distinct from this file's YAML schema. |
| [USWDS design tokens](https://designsystem.digital.gov/design-tokens/) | A limited set of reusable design values instead of arbitrary per-screen choices. |
| [Atlassian tokens](https://atlassian.design/tokens) and [token library](https://atlassian.design/components/tokens) | Semantic names, theme pairs, and role-based use. |
| [Carbon component checklist](https://www.carbondesignsystem.com/getting-started/contributing/component-checklist) | Documenting states, measurements, behavior, and evidence of completion. |
| [GOV.UK contribution criteria](https://design-system.service.gov.uk/community/contribution-criteria/) | When a shared pattern is useful enough to add and how to maintain it. |
| [GOV.UK patterns](https://design-system.service.gov.uk/patterns/) | Separating task-level guidance from individual component appearance. |
| [GOV.UK validation](https://design-system.service.gov.uk/patterns/validation/), [error messages](https://design-system.service.gov.uk/components/error-message/), and [error summary](https://design-system.service.gov.uk/components/error-summary/) | Recoverable forms, field-linked errors, useful wording, and retained input. |
| [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Color pairing and essential visual boundaries. |
| [W3C target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Touch targets, enlargement, and narrow-screen behavior. |
| [W3C focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) and [status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Visible keyboard position and restrained async announcements. |
| [WAI-ARIA dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), and [radio](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) patterns | Concrete keyboard, focus, and accessible-state contracts. |
| [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | A usable version without decorative movement. |
| [web.dev font guidance](https://web.dev/articles/font-best-practices), [Baloo 2 metadata](https://github.com/google/fonts/blob/main/ofl/baloo2/METADATA.pb), and [Nunito metadata](https://github.com/google/fonts/blob/main/ofl/nunito/METADATA.pb) | Font loading, character coverage, and deliberate future Cyrillic support. |
