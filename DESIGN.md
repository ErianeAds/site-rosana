# Design System Document: The Executive Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Authority"**

This design system moves away from the "template-heavy" look of standard career coaching sites and toward the high-end, editorial feel of a global management consultancy. The aesthetic is built on the principle of **The Architectural Authority**: a layout that feels curated, grounded, and intentionally spaced. 

We achieve this through a "less, but better" approach. We leverage asymmetric layouts—where text might be offset from imagery—and heavy typographic scale shifts to create a sense of professional gravity. The goal is to make the user feel they are not just looking at a website, but reading a bespoke white paper or a premium executive portfolio.

---

## 2. Colors & Tonal Logic
The palette is rooted in deep, authoritative Navy (`primary`) and accented with a sophisticated Gold (`secondary`). 

### The "No-Line" Rule
To maintain a high-end feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries between content blocks must be defined through:
- **Background Color Shifts:** Use a transition from `surface` to `surface-container-low` to define a new content area.
- **Intentional Whitespace:** Use the Spacing Scale to let the eye breathe.

### Surface Hierarchy & Nesting
Think of the UI as a physical desk of premium stationery. Layers are stacked to create depth:
1.  **Base Layer:** `surface` (#f8f9ff) - The canvas.
2.  **Structural Sections:** `surface-container-low` (#eff4ff) - Large background blocks.
3.  **Actionable Elements:** `surface-container-lowest` (#ffffff) - High-importance cards or white-space areas that need to "pop" against the subtle blue-grey background.

### The "Glass & Gradient" Rule
For floating elements (like navigation bars or hovering CTAs), use **Glassmorphism**:
- **Background:** `surface` at 80% opacity.
- **Effect:** `backdrop-filter: blur(12px)`.
- **Polish:** For primary CTAs, use a subtle linear gradient from `primary` (#001e40) to `primary_container` (#003366) at a 135-degree angle. This provides a "satin" finish rather than a flat, digital-only fill.

---

## 3. Typography: Editorial Rhythm
The typography pairing is designed to evoke trust through tradition (Serif) and clarity through modernity (Sans).

*   **Display & Headlines (Noto Serif):** These are the "voice" of the mentor. Large, high-contrast serif headers convey wisdom and McKinsey-style authority.
    *   *Usage:* Use `display-lg` for hero statements. Keep tracking tight (-0.02em) to ensure it feels like a physical headline.
*   **Body & Titles (Inter):** This is the "engine" of the information. Inter provides a clinical, high-tech contrast to the serif headings.
    *   *Usage:* Use `body-lg` (1rem) for general copy. Ensure a generous line-height (1.6) to prevent the "wall of text" feel common in corporate documents.
*   **The Signature Label:** Use `label-md` in all-caps with a 0.05em letter spacing for small headers (e.g., "FEATURED INSIGHTS") to create a refined, curated feel.

---

## 4. Elevation & Depth
In this system, depth is a tool for focus, not just decoration.

*   **The Layering Principle:** Instead of shadows, stack `surface-container` tiers. Place a `surface-container-highest` card on a `surface-container` background to create a "soft lift."
*   **Ambient Shadows:** If a card must float (e.g., a testimonial), use an ambient shadow:
    *   `box-shadow: 0 12px 40px rgba(11, 28, 48, 0.06);` (using a tinted version of `on_surface`).
*   **The "Ghost Border" Fallback:** If a container needs more definition, use the `outline-variant` (#c3c6d1) at **15% opacity**. It should be barely visible—a "suggestion" of a line rather than a boundary.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#001e40) with `on_primary` text. Use `md` (0.375rem) roundedness. 
*   **Secondary (The Gold Standard):** Use `secondary` (#735b25) for high-conversion CTAs. This color is reserved for "Success" actions (Book a Call, Enroll).
*   **Tertiary:** No background, `primary` text, with a subtle `secondary` underline (2px) that expands on hover.

### Cards & Lists
*   **Rules:** No dividers. 
*   **Execution:** Separate list items by increasing the vertical padding and using a `surface_container_low` background on hover.
*   **Consultancy Cards:** Use `surface_container_lowest` for the card body. The top edge can feature a 4px "accent bar" in `secondary` (Gold) to denote premium content.

### Input Fields
*   **Style:** Minimalist. Only a bottom border using `outline` (#737780) at 30% opacity. 
*   **Focus State:** The border transitions to `primary` (Navy) with a 2px weight. Helper text should always use `label-sm`.

### Signature Component: The "Executive Pull-Quote"
*   **Design:** A wide-span component using `surface_container_high`. 
*   **Typography:** Large `headline-lg` in `notoSerif`, italicized, with a `secondary_fixed_dim` (Gold) quote mark icon offset to the top-left.

---

## 6. Do's and Don'ts

### Do:
*   **Asymmetry:** Place an image on the right that breaks the grid container slightly to the top.
*   **Tonal Depth:** Use `on_surface_variant` for sub-headers to create a hierarchy of "importance" in text.
*   **Breathing Room:** Use at least 80px of vertical space between major sections.

### Don't:
*   **Don't use 100% Black:** Always use `on_surface` (#0b1c30) for text. It’s a deep navy-black that feels more expensive than pure black.
*   **Don't use High-Contrast Borders:** Never use a solid dark border around a card. It breaks the "Architectural" flow.
*   **Don't Overuse Gold:** The Gold (`secondary`) is a high-value accent. If more than 10% of the screen is Gold, the "premium" feel is lost and it becomes "loud."