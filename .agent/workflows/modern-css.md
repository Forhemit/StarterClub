---
description: Expert guidance on writing modern, efficient CSS (2025-26 standards). Use when generating, refactoring, or reviewing CSS, SCSS, or Tailwind.
---

# Modern CSS Development Standards (2025-26)

You are an expert in modern CSS. When writing styles, strictly adhere to the latest stable features, prioritizing native CSS solutions over JavaScript or pre-processor complexity.

## Core Mandates

1. **Use Native Nesting**: Always use native CSS nesting with `&` instead of SCSS/Sass nesting.
2. **Container Queries over Media Queries**: Default to `@container` for component-level responsiveness. Only use `@media` for top-level page layout.
3. **Parent Selection**: Use `:has()` to style parents based on children, eliminating "state classes" controlled by JS (e.g., `card:has(input:checked)` instead of adding `.is-active` via JS).
4. **Modern Colors**: Use `oklch()` for all colors to ensure accessible perceptual uniformity and wider gamuts.
5. **Viewport Units**: Use `dvh`, `lvh`, and `svh` instead of `vh` to account for mobile browser UI bars.

---

## Feature Reference

### 1. Nesting (Native)

**❌ Avoid (Old):**
```css
.card { background: white; }
.card .title { font-size: 1.5rem; }
.card .title:hover { color: blue; }
```

**✅ Use (Modern):**
```css
.card {
  background: white;

  & .title {
    font-size: 1.5rem;

    &:hover {
      color: blue;
    }
  }
}
```

---

### 2. Container Queries

**❌ Avoid (Old):**
```css
@media (min-width: 768px) {
  .card { flex-direction: row; }
}
```

**✅ Use (Modern):**
```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

---

### 3. Parent Selection with `:has()`

**❌ Avoid (Old - requires JS):**
```css
.form-group.has-error .input { border-color: red; }
```
```javascript
// JS to toggle .has-error class
```

**✅ Use (Modern - pure CSS):**
```css
.form-group:has(input:invalid) {
  & .input {
    border-color: oklch(0.6 0.25 25); /* Red in oklch */
  }
}
```

---

### 4. Modern Colors with `oklch()`

**❌ Avoid (Old):**
```css
.button {
  background: hsl(220, 90%, 50%);
  color: #ffffff;
}
```

**✅ Use (Modern):**
```css
.button {
  background: oklch(0.55 0.2 260); /* Perceptually uniform blue */
  color: oklch(1 0 0); /* Pure white */
}
```

**oklch() Format:** `oklch(lightness chroma hue / alpha)`
- **Lightness**: 0 (black) to 1 (white)
- **Chroma**: 0 (gray) to ~0.37 (max saturation)
- **Hue**: 0-360 degrees (red=25, orange=70, yellow=100, green=145, cyan=195, blue=260, purple=300, pink=350)

---

### 5. Dynamic Viewport Units

**❌ Avoid (Old):**
```css
.hero {
  height: 100vh; /* Breaks on mobile with browser UI bars */
}
```

**✅ Use (Modern):**
```css
.hero {
  height: 100dvh; /* Dynamic: adjusts as browser UI shows/hides */
}

/* Alternatives */
.section {
  min-height: 100svh; /* Small: assumes UI is visible */
}
.fullscreen {
  height: 100lvh; /* Large: assumes UI is hidden */
}
```

---

### 6. Logical Properties

**❌ Avoid (Old):**
```css
.card {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-left: 2px solid blue;
}
```

**✅ Use (Modern):**
```css
.card {
  margin-inline: 1rem;
  padding-block: 2rem;
  border-inline-start: 2px solid oklch(0.55 0.2 260);
}
```

---

### 7. Modern Selectors

**`:where()` and `:is()` for reducing specificity and grouping:**
```css
/* Low specificity reset */
:where(h1, h2, h3, h4, h5, h6) {
  margin-block: 0;
}

/* Group selectors cleanly */
:is(article, section, aside) {
  & :is(h1, h2, h3) {
    color: oklch(0.3 0 0);
  }
}
```

**`:focus-visible` instead of `:focus`:**
```css
.button {
  &:focus-visible {
    outline: 2px solid oklch(0.6 0.2 260);
    outline-offset: 2px;
  }
}
```

---

### 8. Scroll-Driven Animations (2025)

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

---

### 9. Subgrid

**✅ Use for perfect alignment across nested grids:**
```css
.grid-parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.grid-child {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 3;
}
```

---

### 10. CSS Layers for Specificity Control

```css
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
  }
}

@layer base {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
  }
}

@layer components {
  .button {
    padding-inline: 1.5rem;
    padding-block: 0.75rem;
  }
}

@layer utilities {
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    clip: rect(0 0 0 0);
    overflow: hidden;
  }
}
```

---

## Tailwind CSS Considerations

When using Tailwind, leverage these modern features via custom CSS or plugins:

1. **Container queries**: Use `@tailwindcss/container-queries` plugin
2. **oklch colors**: Define in `tailwind.config.js` theme
3. **Logical properties**: Prefer `ms-4` (margin-start) over `ml-4`
4. **Custom CSS**: For advanced features not in Tailwind, use `@layer` in your CSS

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'oklch(0.55 0.2 260)',
        secondary: 'oklch(0.7 0.15 180)',
      },
    },
  },
}
```

---

## Audit Checklist

When reviewing CSS, check for:

- [ ] **Nesting**: Is native CSS nesting used instead of flat selectors?
- [ ] **Container Queries**: Are component-level breakpoints using `@container`?
- [ ] **:has() Selector**: Are parent states handled in CSS instead of JS classes?
- [ ] **oklch() Colors**: Are colors using perceptually uniform `oklch()`?
- [ ] **Viewport Units**: Is `dvh`/`svh`/`lvh` used instead of `vh`?
- [ ] **Logical Properties**: Are `inline`/`block` logical properties used?
- [ ] **Focus States**: Is `:focus-visible` used instead of `:focus`?
- [ ] **Layers**: Is `@layer` used for specificity management?
- [ ] **Subgrid**: Are nested grids using `subgrid` for alignment?
- [ ] **Scroll Animations**: Are scroll-driven animations using `animation-timeline: view()`?
