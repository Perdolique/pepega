---
version: alpha
name: Pepega Product Design
description: "A warm, playful, and minimal interface for Twitch tools."
colors:
  primary: "#ff5c2b"
  primary-hover: "#ff7045"
  on-primary: "#26201a"
  paper: "#fff4dd"
  surface: "#fffdf7"
  surface-muted: "#f6e7c9"
  surface-featured: "#fff0bd"
  ink: "#26201a"
  ink-secondary: "#5c5347"
  ink-muted: "#7a6e60"
  shadow-ink: "#26201a"
  sun: "#ffd84d"
  sun-hover: "#ffe270"
  on-sun: "#26201a"
  rose: "#ffb9cc"
  on-rose: "#26201a"
  sky: "#a5dcff"
  on-sky: "#26201a"
  mint: "#a8e6bd"
  on-mint: "#173a24"
  danger: "#c92f2f"
  danger-hover: "#b92323"
  on-danger: "#fffdf7"
  twitch: "#9146ff"
  on-twitch: "#ffffff"
  telegram: "#229ed9"
  on-telegram: "#102a36"
  overlay-plate: "rgba(38, 32, 26, 0.92)"
  overlay-copy: "#fffdf7"
  dark-primary: "oklch(0.68 0.20 38)"
  dark-primary-hover: "oklch(0.74 0.19 42)"
  dark-on-primary: "oklch(0.20 0.03 38)"
  dark-paper: "oklch(0.18 0.012 70)"
  dark-surface: "oklch(0.24 0.014 70)"
  dark-surface-muted: "oklch(0.29 0.018 72)"
  dark-surface-featured: "oklch(0.31 0.055 72)"
  dark-ink: "oklch(0.93 0.025 80)"
  dark-ink-secondary: "oklch(0.78 0.025 75)"
  dark-ink-muted: "oklch(0.68 0.024 72)"
  dark-shadow-ink: "oklch(0.08 0.005 70)"
  dark-sun: "oklch(0.78 0.14 82)"
  dark-sun-hover: "oklch(0.83 0.13 84)"
  dark-on-sun: "oklch(0.22 0.04 82)"
  dark-rose: "oklch(0.72 0.12 355)"
  dark-on-rose: "oklch(0.20 0.03 350)"
  dark-sky: "oklch(0.73 0.095 232)"
  dark-on-sky: "oklch(0.20 0.03 235)"
  dark-mint: "oklch(0.75 0.10 148)"
  dark-on-mint: "oklch(0.19 0.03 148)"
  dark-danger: "#ff7870"
  dark-danger-hover: "#ff918a"
  dark-on-danger: "#301313"
typography:
  display-hero:
    fontFamily: "Baloo 2, Arial Rounded MT Bold, system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: -0.04em
  headline-page:
    fontFamily: "Baloo 2, Arial Rounded MT Bold, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-section:
    fontFamily: "Baloo 2, Arial Rounded MT Bold, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.01em
  headline-card:
    fontFamily: "Baloo 2, Arial Rounded MT Bold, system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 800
    lineHeight: 1.15
  data-value:
    fontFamily: "Baloo 2, Arial Rounded MT Bold, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1
  body-lg:
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  label-lg:
    fontFamily: "Baloo 2, Arial Rounded MT Bold, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.2
  label-sm:
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.25
  metadata:
    fontFamily: "ui-monospace, SFMono-Regular, Cascadia Code, Menlo, Consolas, monospace"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
  kicker:
    fontFamily: "ui-monospace, SFMono-Regular, Cascadia Code, Menlo, Consolas, monospace"
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.08em
rounded:
  cell: 6px
  control: 10px
  inner: 12px
  card: 16px
  feature: 20px
  bubble: 18px
  full: 999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px
  page-bottom: 80px
components:
  page-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  page-dark:
    backgroundColor: "{colors.dark-paper}"
    textColor: "{colors.dark-ink}"
    typography: "{typography.body-md}"
  panel-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: 24px
  panel-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.card}"
    padding: 24px
  panel-quiet-light:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inner}"
    padding: 16px
  panel-quiet-dark:
    backgroundColor: "{colors.dark-surface-muted}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.inner}"
    padding: 16px
  panel-featured-light:
    backgroundColor: "{colors.surface-featured}"
    textColor: "{colors.ink}"
    rounded: "{rounded.feature}"
    padding: 24px
  panel-featured-dark:
    backgroundColor: "{colors.dark-surface-featured}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.feature}"
    padding: 24px
  button-primary-light:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
  button-primary-dark:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
  button-primary-light-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-primary-dark-hover:
    backgroundColor: "{colors.dark-primary-hover}"
    textColor: "{colors.dark-on-primary}"
  button-secondary-light:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.on-sun}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
  button-secondary-dark:
    backgroundColor: "{colors.dark-sun}"
    textColor: "{colors.dark-on-sun}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
  button-secondary-light-hover:
    backgroundColor: "{colors.sun-hover}"
    textColor: "{colors.on-sun}"
  button-secondary-dark-hover:
    backgroundColor: "{colors.dark-sun-hover}"
    textColor: "{colors.dark-on-sun}"
  button-danger-light:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
  button-danger-dark:
    backgroundColor: "{colors.dark-danger}"
    textColor: "{colors.dark-on-danger}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
  button-danger-light-hover:
    backgroundColor: "{colors.danger-hover}"
    textColor: "{colors.on-danger}"
  button-danger-dark-hover:
    backgroundColor: "{colors.dark-danger-hover}"
    textColor: "{colors.dark-on-danger}"
  button-twitch:
    backgroundColor: "{colors.twitch}"
    textColor: "{colors.on-twitch}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
  button-telegram:
    backgroundColor: "{colors.telegram}"
    textColor: "{colors.on-telegram}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
  field-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.control}"
    height: 44px
  field-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.control}"
    height: 44px
  status-success-light:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.on-mint}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  status-success-dark:
    backgroundColor: "{colors.dark-mint}"
    textColor: "{colors.dark-on-mint}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  status-warning-light:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.on-sun}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  status-warning-dark:
    backgroundColor: "{colors.dark-sun}"
    textColor: "{colors.dark-on-sun}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  status-danger-light:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  status-danger-dark:
    backgroundColor: "{colors.dark-danger}"
    textColor: "{colors.dark-on-danger}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  status-info-light:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.on-sky}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  status-info-dark:
    backgroundColor: "{colors.dark-sky}"
    textColor: "{colors.dark-on-sky}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  stat-rose-light:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.on-rose}"
    typography: "{typography.data-value}"
    rounded: "{rounded.card}"
  stat-rose-dark:
    backgroundColor: "{colors.dark-rose}"
    textColor: "{colors.dark-on-rose}"
    typography: "{typography.data-value}"
    rounded: "{rounded.card}"
  stat-sky-light:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.on-sky}"
    typography: "{typography.data-value}"
    rounded: "{rounded.card}"
  stat-sky-dark:
    backgroundColor: "{colors.dark-sky}"
    textColor: "{colors.dark-on-sky}"
    typography: "{typography.data-value}"
    rounded: "{rounded.card}"
  overlay-plate:
    backgroundColor: "{colors.overlay-plate}"
    textColor: "{colors.overlay-copy}"
    rounded: "{rounded.bubble}"
    padding: 16px
  secondary-copy-light:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.body-sm}"
  secondary-copy-dark:
    textColor: "{colors.dark-ink-secondary}"
    typography: "{typography.body-sm}"
  muted-copy-light:
    textColor: "{colors.ink-muted}"
    typography: "{typography.metadata}"
  muted-copy-dark:
    textColor: "{colors.dark-ink-muted}"
    typography: "{typography.metadata}"
  shadow-layer-light:
    backgroundColor: "{colors.shadow-ink}"
    rounded: "{rounded.card}"
  shadow-layer-dark:
    backgroundColor: "{colors.dark-shadow-ink}"
    rounded: "{rounded.card}"
---

# Pepega Product Design

## Purpose

The project wiki defines what Pepega is, which tools it contains, and where the
product is going. This document defines how those tools look and behave: visual
hierarchy, layout, interaction, themes, responsiveness, and accessibility.

Preserve working product behavior and domain requirements when redesigning an
existing screen, but replace incidental demo styling instead of carrying it
forward. Build repeated treatments into shared Vue components and semantic CSS
custom properties. Do not reproduce this system with page-local literals.

Design only for product flows that exist. Introduce shared patterns after real
screens establish repetition rather than preparing speculative components for
future tools.

## Product Principles

- **Playful, not noisy.** Pepega should feel handmade, cheeky, and energetic,
  while important actions and changing states remain immediately scannable.
- **Operational first.** A streamer may use the product while live. Frequent
  actions, failures, queues, and statuses must be understandable at a glance.
- **Progressive disclosure.** Show the next useful choice first. Keep advanced,
  administrative, and destructive actions behind clearly labelled menus or
  sections until they are needed.
- **Minimal by default.** Prefer normal spacing, text, rows, and dividers over a
  bordered container. A surface should group content only when the grouping
  materially improves comprehension.
- **One loud moment.** Give each view one dominant sticker, call to action, or
  featured result. Supporting controls and dense data should be calmer.
- **Role-aware.** Make the current role, channel context, permissions, balance,
  and unavailable actions explicit when they affect a decision.
- **Responsive by composition.** Reflow components around their available
  space. Do not shrink a desktop dashboard into an unreadable mobile page.
- **Consistent semantics.** Color, labels, icons, and position must communicate
  the same meanings across settings, queues, dashboards, and overlays.

## Experience Modes

### Public and onboarding

Public pages use one compact shared shell, a small mascot, concise copy, and one
clear next action. Login, permissions, and connection status must be direct and
unambiguous.

Keep explanatory copy in a readable column of about `60ch`. The primary action
must remain visually dominant and reachable on narrow screens.

### Authenticated product

The product shell is optimized for repeat use. It must scale from a small set of
destinations to grouped areas for engagement, content, automation, insights,
integrations, and settings without hard-coding those groups into every page.

Use a compact top bar on wide screens. On compact screens, keep the brand and a
single menu containing navigation, account actions, and theme selection.

Product pages use a hierarchy of page title, optional context and primary
action, then sections. Dense settings, tables, and queues use quiet panels;
hard-shadow sticker cards are reserved for summary, emphasis, or interaction.

### Stream overlays

Overlays are transparent compositions rendered above video, not application
pages. Never apply the paper page background or product navigation to them.
Place text and media on high-contrast plates or outlined stickers that remain
legible over bright and dark footage.

Design overlay units independently so alerts, chat messages, goals, polls, and
reactions can be positioned in common broadcast safe areas. Keep essential
content inside the inner 90 percent of the frame and avoid covering the usual
camera and chat regions unless the overlay is explicitly configured to do so.

Overlay animation may be more expressive than product motion, but it must have
a bounded entrance, readable hold, and bounded exit. Repeated events must queue,
coalesce, or stack predictably instead of covering one another.

## Color

The light theme resembles warm stationery rather than a white application
canvas. The dark theme uses the same warm hue family and is a first-class mode
for people operating the product in dim streaming setups.

- **Paper** fills application and public page backgrounds.
- **Surface** is the default card, menu, field, and dialog fill.
- **Muted surface** groups dense settings, table controls, and nested content
  without creating another heavy sticker layer.
- **Featured surface** is reserved for one promoted, urgent, or time-sensitive
  panel per region.
- **Ink** carries text, icons, structural outlines, and light-theme hard
  shadows. Avoid pure black as the dominant color.
- **Primary orange** marks the principal action, active selection, or highest
  energy highlight. Do not use it for every clickable element.
- **Sun, rose, and sky** distinguish peer categories, chart series, or summary
  tiles. They do not imply success or failure by themselves.
- **Mint, sun, danger, and sky** are the semantic success, warning, error, and
  informational fills respectively.
- **Twitch and Telegram** colors are provider identity tokens. Use them only
  when the provider itself is part of the meaning, such as connect or account
  actions; they do not replace product action colors.

Text and icons on filled accents must use the matching `on-*` token. Never rely
on color alone for state, series, or severity: pair it with a label, icon,
pattern, or position. Charts must keep a stable series-to-color mapping within
the same view and provide direct labels or a legend.

## Typography

Typography has three voices with different jobs.

- **Display:** Baloo 2 at weights 700 or 800 for public hero text, page and
  section headings, featured numbers, short button labels, and playful badges.
- **Body:** the system sans-serif stack for instructions, form values, tables,
  navigation, and long copy. Use 16px for normal reading and 14px for dense
  secondary interfaces.
- **Metadata:** the system monospace stack for timestamps, counters, status
  details, IDs, compact legends, and technical values. Use it selectively.

Keep long copy near `60ch`. Use tabular numerals for balances, analytics,
prices, timers, and queue positions. Do not use Baloo 2 for paragraphs, table
bodies, long form labels, or multiline error messages.

The 64px hero is a public-page maximum, not an application default. Reduce it
to approximately 44px on compact screens. Application page titles use 40px on
wide screens and approximately 32px on compact screens.

## Layout and Responsive Behavior

Use a 4px base spacing rhythm. Prefer the named spacing tokens over one-off
values. Normal control and card gaps are 8px, 12px, 16px, or 24px; page sections
use 48px or 64px depending on density.

The system uses three layout ranges as composition guides, not device labels:

- **Compact:** below 768px. Use one main column, 16px page gutters, full-width
  primary actions where helpful, and drawers for secondary navigation.
- **Medium:** from 768px. Use 24px gutters and two-column compositions only
  when both columns remain useful and readable.
- **Wide:** from 1024px. Show the complete product top bar and allow useful data
  grids. Cap the main product canvas near 1440px.

Public content may use a centered 1180px canvas with a narrower reading column.
Authenticated pages should fill useful horizontal space instead of inheriting a
single editorial column. Use CSS Grid for page structure and container queries
for reusable cards, filters, and queue entries whose layout depends on their
actual slot.

The page itself must never overflow horizontally. Wide tables, timelines, and
visualizations may scroll inside a clearly bounded region with an affordance
that more content is available. Keep the first identifying column visible when
doing so materially improves comprehension.

On compact screens, transform data instead of merely squeezing it:

- Collapse secondary filters behind a clearly labeled control.
- Convert non-comparative table rows into labeled cards.
- Preserve tables when cross-row comparison is the task, using contained
  horizontal scrolling instead.
- Move secondary actions into a visible overflow menu, never an undiscoverable
  hover state.
- Keep destructive and primary actions separated to prevent accidental taps.

## Elevation, Borders, and Shape

The identity comes from the warm palette, Baloo 2 headings, rounded controls,
the Pepega mascot, and a small amount of deliberate graphic emphasis.

- Hard shadows and rotation are rare decorative accents. Use them for at most
  one playful object in a region, never as the default treatment for sections,
  navigation, forms, settings, or rows.
- Quiet panels, dense table regions, and nested settings use a 1px or 2px
  outline without an offset shadow.
- Dialogs and drawers use stronger separation than their contents; nested
  controls do not each need another shadow.

Hover may move an interactive sticker by `-1px` and grow its shadow by the same
amount. Pressed controls move toward the shadow and collapse it. Never replace
hard graphic depth with gradients, glass surfaces, glows, or soft SaaS shadows.

Cards use a 16px radius, featured panels 20px, inner groups 12px, controls 10px,
speech bubbles 18px, and pills a fully rounded radius. Avatars are circular.
Dashed borders are reserved for empty drop areas, optional slots, or clearly
temporary placeholders.

Rotations between `-1deg` and `1deg` may appear on one featured sticker, media
thumbnail, result, or peer summary tile. Keep navigation, fields, tables, long
text, dialogs, and entire page sections level.

## App Shell and Navigation

The wide product shell has a compact top bar and a flexible main canvas. Keep
Dashboard, Notifications, and Account visible; place Admin, theme, and logout
inside the user menu.

Navigation supports active state and badges when they carry real information.
Use product orange sparingly for the active marker.
Keep provider connection status and current channel context visually distinct
from navigation destinations.

The compact shell uses a top bar for identity, channel context, and menu access.
A bottom navigation is appropriate only for three to five stable, high-frequency
destinations; do not mirror a large desktop navigation into a crowded bottom bar.

Every page header contains the page title and may contain one primary action.
Context switches, date ranges, and secondary actions follow the title rather
than competing with it. Breadcrumbs are for genuine hierarchy, not decoration.

## Components

### Buttons and links

Default buttons are at least 44px high, 2px outlined, fully rounded, and use the
display face for short labels. Icon-only controls are at least 44px square and
require an accessible name and a tooltip when their meaning is not universal.

- **Primary:** orange, once per action group.
- **Secondary:** sun yellow for a friendly alternative or neutral surface for
  lower emphasis.
- **Destructive:** danger fill for the final destructive action, not for merely
  opening a confirmation dialog.
- **Provider:** provider color only for actions whose meaning is specifically
  Twitch, Telegram, or another connected service.
- **Ghost:** no shadow and no persistent fill, for compact toolbars and tertiary
  actions.

Buttons physically depress on activation. Disabled buttons remove their shadow,
reduce contrast without hiding the label, and never serve as the only
explanation for an unavailable action.

Text links remain underlined. Use a 2px primary underline with a 3px offset.
Visible keyboard focus uses a 3px high-contrast outline with a 2px offset and
must not be clipped by an ancestor.

### Fields and settings

Text inputs, selects, comboboxes, and textareas use the surface fill, 2px ink
border, 10px radius, and a minimum 44px control height. Labels sit above fields.
Placeholder text never replaces a label.

Use the body face for values and labels; reserve display type for short group
titles. Helper, validation, and character-count text appears directly below the
field. Errors preserve the user's value, describe the corrective action, and
use danger color plus an icon or explicit error label.

Checkboxes and radios use native semantics with custom visible controls.
Switches are only for settings that take effect immediately; use checkboxes for
choices submitted as part of a larger form. Segmented controls switch among a
small set of peer views, not arbitrary form values.

Group settings by user goal in quiet panels. Place save status near the action
that caused it. For long settings pages, use a sticky local action bar only when
users could otherwise lose unsaved changes outside the viewport.

### Cards and panels

Start with ordinary sections separated by whitespace or a divider. Add a quiet
surface when several controls or values must read as one object. Reserve cards
for independent objects whose boundary matters. Avoid more than one bordered
layer and never build a wall of equally loud cards.
Clickable cards need a clear title and interaction state; do not make arbitrary
blank areas behave like hidden buttons.

### Status, identity, and permissions

Status badges combine concise text with color and, when useful, an icon. Use
semantic colors consistently: mint for success or online, sun for pending or
warning, danger for failed or blocked, and sky for informational states.

Represent asynchronous and real-time lifecycles explicitly. Common states
include draft, scheduled, queued, processing, active, paused, completed, failed,
expired, and disabled. Use only the states that belong to the feature; do not
invent a universal lifecycle enum for unrelated data.

Show the acting role or channel context wherever it changes available actions.
When an unavailable action is useful for discovery, keep it visible with a
short reason. Hide controls that would reveal data or capabilities the user is
not allowed to know about.

Avatars identify users or channels, not generic categories. Pair unfamiliar
avatars with a display name. Provider marks identify the connected service and
must not be used as decorative accent icons.

### Data, analytics, and financial views

Metric tiles use Baloo 2 values with tabular numerals and short body or
monospace labels. Include the time range and comparison basis near the metric;
color alone never communicates increase as good or bad.

Charts live in quiet panels so the data remains louder than the container. Use
sun, rose, sky, mint, and primary orange as a stable categorical palette. Add
direct labels, legends, and accessible text summaries. Avoid decorative 3D,
gradients, excessive grid lines, and animation that makes values difficult to
compare.

Tables use body type at 14px to 16px, sticky headers when rows extend beyond a
viewport, and right-aligned tabular numerals. Keep the primary object identity
at the start of the row and actions at the end. Sorting, selection, pagination,
filters, and date ranges must expose their current state in text.

Financial values always include currency or unit. Destructive adjustments,
purchases, and payouts require a summary of amount, recipient, and resulting
state before confirmation.

### Queues, requests, and moderation

Use a structured list or table for song, video, game, content, alert, and other
request queues. Each entry exposes identity, requester, age or scheduled time,
current state, and the next relevant action without opening a detail view.

Preserve queue position when it is meaningful. Drag handles appear only when
manual reordering is supported; keyboard users need equivalent move actions.
Bulk selection and moderation actions belong in a contextual toolbar that
states how many entries are affected.

Approve and reject are distinct actions with explicit labels. Rejection or
moderation reasons belong in a dialog only when the reason is required; do not
interrupt every quick action with unnecessary confirmation.

### Economy, rewards, polls, and goals

Balances and prices always include their unit and use tabular numerals. A
purchase or redemption card shows the benefit, price, eligibility, availability,
and fulfillment state before the action.

Confirm irreversible purchases with item, price, current balance, and resulting
balance. Temporary bans, challenges, and other socially disruptive rewards need
plain-language consequences rather than playful ambiguity.

Polls prioritize the question, options, voting state, and closing time. Results
use labels and values in addition to bar length. Goals show current value,
target, unit, deadline when relevant, and completed state without hiding the
underlying numbers.

### Dialogs, drawers, toasts, and menus

Dialogs use the paper or surface fill, 16px radius, 2px outline, and hard shadow.
Use them for focused decisions or short tasks, not as a substitute for a full
settings page. Destructive confirmation names the affected object and places
the safe action before the destructive action in reading order.

Use a drawer for compact navigation, filters, or supporting detail that benefits
from retaining page context. Menus contain short actions, never long forms.
Toasts acknowledge background results and link to recovery when possible; they
must not be the only location of a critical error.

### Loading, empty, error, and offline states

Every data-bearing region defines loading, empty, error, and stale or offline
behavior before implementation.

- Use skeletons only when the final shape is predictable. Use a compact spinner
  for isolated actions with no stable placeholder shape.
- Empty states say what is empty, why that matters, and offer one relevant next
  action when one exists.
- Error states retain successfully loaded surrounding content and offer retry
  or recovery appropriate to the failure.
- Stale and reconnecting states keep the last known value visible with its age;
  never present stale real-time data as current.

Loading indicators must not cause major layout shifts. Button-level work keeps
the label or replaces it with a same-width progress treatment and blocks only
the action that is actually pending.

### Overlay widgets

Overlay widgets use transparent roots and self-contained high-contrast plates.
They may reuse primary, sun, rose, sky, and mint accents, but the application
paper and dark theme do not determine the broadcast background.

Chat bubbles include identity, readable message text, and optional badges
without allowing badges to dominate the message. Alerts establish a clear
sequence: event identity, primary message, supporting value, then dismissal.
Goals and polls expose text values in addition to animated bars.

Provide variants for common placement and density rather than arbitrary color
customization that breaks the identity. User-supplied media must fit within a
bounded frame and must not push essential copy outside the safe region.

## Icons, Illustration, and Media

Use one coherent icon family with rounded 2px strokes. Icons clarify actions or
categories; they do not replace essential labels in unfamiliar navigation or
moderation tasks. Emoji may appear as decorative personality, never as the only
control icon or status signal.

Illustrations and stickers may use imperfect outlines, flat fills, halftone or
paper texture, and small rotations. Keep textures subtle enough that text and
controls remain crisp. Do not place decorative characters behind form values,
charts, or table rows.

Use square or circular crops for avatars and channel identity. Content media
such as game art and video thumbnails uses a consistent aspect ratio within a
collection. Always reserve media dimensions to prevent layout shifts.

## Motion and Feedback

Product motion is quick and tactile:

- 80ms to 150ms for button presses, hover responses, and compact selections.
- 160ms to 240ms for menus, drawers, toasts, and small state transitions.
- 240ms to 400ms for a featured result, completed goal, or deliberate sticker
  entrance.

Animate transform and opacity when practical. Do not animate page layout simply
to make it feel busy. New real-time items may highlight briefly, but their
position and timestamp must explain what changed after the highlight ends.

Respect `prefers-reduced-motion` in the product and in user-facing overlay
previews. Remove decorative movement and replace essential animated progress
with an immediate final state or a non-moving equivalent.

Every mutation provides feedback at the scope where it happened: pressed and
pending state on the control, updated state on the affected object, and a toast
only when the result would otherwise be easy to miss.

## Accessibility and Content

- Maintain WCAG AA text contrast in both themes and over arbitrary stream
  footage. Use a plate or outline when the background cannot be predicted.
- Provide a visible keyboard focus indicator for every interactive element.
- Keep pointer targets at least 44px by 44px unless a dense data control has an
  equally usable expanded target.
- Use semantic HTML and native interaction behavior before adding custom
  keyboard handling.
- Announce meaningful asynchronous results and real-time additions without
  repeatedly interrupting assistive technology users.
- Do not encode status, chart series, queue position, or selection with color
  alone.
- Keep labels concrete and short. Playful copy may add personality, but errors,
  permissions, prices, destructive actions, and financial consequences must be
  literal and unambiguous.

## Do's and Don'ts

- **Do** use semantic tokens and shared primitives instead of approximate colors
  or page-local recreations.
- **Do** keep the warm palette, rounded display type, body font, themes, and
  monospace metadata consistent across every surface.
- **Do** choose density according to the task: expressive for promotion and
  results, calm for settings, queues, and analytics.
- **Do** design every data region for loading, empty, error, stale, and compact
  states.
- **Do** keep provider identity, product actions, and semantic severity as
  separate color roles.
- **Do** test layouts with long channel names, large values, translated copy,
  and realistic queue or table density.
- **Don't** copy the current demo UI as a visual reference or preserve its
  tokens solely for compatibility.
- **Don't** add gradients, glass surfaces, glows, or blurry SaaS shadows.
- **Don't** use pure white or pure black as dominant application colors.
- **Don't** give every card a rotation, loud fill, and hard shadow.
- **Don't** use Baloo 2 for paragraphs, tables, dense settings, or multiline
  errors.
- **Don't** build a feature-specific visual pattern when an existing screen
  archetype already communicates the same job.
- **Don't** turn broad product ideas into unused components before a real screen
  requires them.
