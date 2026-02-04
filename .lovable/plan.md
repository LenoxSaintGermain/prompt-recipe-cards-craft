
# Transformation Plan: Prompt & Context Engineering Library

## Vision: From "Perplexity Recipe Cards" to a Universal AI Mastery Platform

We're transforming this application from a Perplexity-specific tool into a sophisticated **Prompt & Context Engineering Library** that helps users learn how others leverage LLMs. Think Apple's design philosophy: clean, minimal, purposeful, with subtle micro-interactions that delight.

---

## 1. Brand & Terminology Refresh

### Current State
- "Perplexity Enterprise Prompt Recipe Card"
- "Recipe Card Library"
- `perplexityChatLink` field throughout
- References to Perplexity Training collections

### New Direction
| Old Term | New Term |
|----------|----------|
| Recipe Card | Prompt Pattern / Pattern Card |
| Recipe Card Library | Pattern Library |
| Perplexity Chat Link | Live Demo Link |
| "Recipe Name" | "Pattern Title" |
| "Prompt Recipe Card" | "AI Pattern" |

### Files to Update
- `RecipeCardEditor.tsx` - terminology in UI
- `RecipeCardLibrary.tsx` - header text, descriptions
- `RecipeCardHeader.tsx` - "Prompt Recipe Card" → "AI Pattern"
- `RecipeCardFooter.tsx` - footer branding
- `TemplateSection.tsx` - label for `perplexityChatLink`
- `CollectionQuickActions.tsx` - default collection name
- `useContentAnalysis.ts` - keyword analysis

---

## 2. Apple-Inspired Design System

### Color Palette Transformation

**Current:** Busy gradients (`from-purple-600 via-blue-600 to-indigo-600`)

**New Apple-Inspired Palette:**
```css
/* Primary - Clean Blacks & Whites */
--apple-black: #1d1d1f
--apple-gray-100: #f5f5f7
--apple-gray-200: #e8e8ed
--apple-gray-500: #86868b
--apple-gray-700: #424245

/* Accent - Subtle, Purposeful */
--apple-blue: #0071e3
--apple-green: #34c759
--apple-orange: #ff9500
--apple-red: #ff3b30

/* Difficulty Badges */
Beginner: #34c759 (green)
Intermediate: #ff9500 (orange)  
Advanced: #ff3b30 (red)
```

### Typography
- SF Pro inspired: `font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif`
- Increase letter-spacing slightly for headings
- Reduce visual weight - use font-medium instead of font-bold where possible

### Card Design - Glassmorphism
```css
.pattern-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}
```

---

## 3. Micro-Interactions & Animations

### New Keyframes in `tailwind.config.ts`

```typescript
keyframes: {
  // Subtle fade-up for content
  'fade-up': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  },
  // Smooth scale for cards
  'scale-in': {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' }
  },
  // Pulse for loading states
  'gentle-pulse': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.7' }
  },
  // Slide in for panels
  'slide-in-right': {
    '0%': { opacity: '0', transform: 'translateX(20px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' }
  },
  // Button press effect
  'press': {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(0.97)' }
  }
}
```

### Interaction Patterns
- **Cards**: Hover lifts card slightly with soft shadow transition
- **Buttons**: Subtle scale-down on active (0.97)
- **Inputs**: Focus rings with smooth animation
- **Page Transitions**: Content fades up on mount
- **Loading States**: Skeleton loaders with gentle pulse

---

## 4. Component-by-Component Redesign

### 4.1 Library View (`RecipeCardLibrary.tsx`)

**Header Redesign:**
```jsx
// FROM: Gradient header with busy colors
// TO: Clean white/light gray with elegant typography

<header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-8">
  <div className="max-w-6xl mx-auto">
    <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
      Pattern Library
    </h1>
    <p className="text-lg text-gray-500 mt-2">
      Discover how experts leverage AI through proven prompt patterns
    </p>
  </div>
</header>
```

**Card Grid Updates:**
- Remove checkbox clutter from default view
- Larger cards with more breathing room
- Subtle hover animation (translateY + shadow)
- Category pills instead of difficulty badges

**Search & Filter Bar:**
- Pill-shaped input with subtle shadow
- Animated filter dropdowns
- Clean iconography (Lucide icons, smaller size)

### 4.2 Pattern Card Component

**Current:** Heavy borders, busy gradients, lots of visual noise

**New Design:**
```jsx
<Card className="group bg-white/80 backdrop-blur border border-gray-200/50 
                 rounded-2xl shadow-sm hover:shadow-lg 
                 transition-all duration-300 ease-out
                 hover:-translate-y-1">
  {/* Minimal header - just title and subtle difficulty indicator */}
  <div className="p-6 pb-4">
    <div className="flex items-start justify-between">
      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 
                     transition-colors duration-200">
        {card.name}
      </h3>
      <span className={`w-2 h-2 rounded-full ${difficultyDot}`} />
    </div>
    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
      {card.whatItDoes}
    </p>
  </div>
  
  {/* Footer with subtle actions */}
  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
    <span className="text-xs text-gray-400">{card.whoItsFor}</span>
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Action icons */}
    </div>
  </div>
</Card>
```

### 4.3 Editor (`RecipeCardEditor.tsx`)

**Layout Changes:**
- Remove purple gradient card wrapper
- Clean white background with subtle section dividers
- Larger, more spaced form inputs
- Floating "AI Copilot" button that expands into panel

**Form Styling:**
```jsx
<input className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl 
                  focus:bg-white focus:ring-2 focus:ring-blue-500/20
                  transition-all duration-200 placeholder:text-gray-400" />
```

### 4.4 Preview Modes

**Document Layout:**
- Cleaner section headers (just a thin left border accent)
- More generous padding
- Subtle background variations instead of colored boxes

**Slide Layout:**
- Truly presentation-ready
- Dark mode option for presentations
- Minimal chrome, maximum content

### 4.5 AI Copilot Panel

**Redesign as Floating Assistant:**
```jsx
// Collapsed: Small floating button
<button className="fixed right-6 bottom-6 w-14 h-14 rounded-full 
                   bg-black text-white shadow-2xl 
                   hover:scale-105 active:scale-95 transition-transform">
  <Sparkles />
</button>

// Expanded: Elegant side panel
<div className="fixed right-6 bottom-6 w-80 max-h-[70vh] rounded-2xl 
                bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/50
                animate-in slide-in-from-bottom-4 duration-300">
  {/* Content */}
</div>
```

---

## 5. New UI Components to Create

### 5.1 Skeleton Loaders
Create `src/components/ui/skeleton-card.tsx` for loading states

### 5.2 Animated Badge Component
Create `src/components/ui/animated-badge.tsx` with subtle entrance animations

### 5.3 Floating Action Button
Create `src/components/ui/fab.tsx` for the AI assistant trigger

### 5.4 Pattern Category Pills
Create `src/components/ui/category-pill.tsx` for tagging patterns

---

## 6. Updated Data Model

### Field Renaming (UI only, keep DB compatible)
| DB Field | UI Display |
|----------|------------|
| `perplexity_chat_link` | "Live Demo Link" |
| `recipe_cards` table | (keep as-is for backwards compat) |

### New Categories for Collection Suggestions
Instead of "Perplexity Training", offer:
- Research & Discovery
- Content Creation
- Data Analysis
- Business Intelligence
- Creative Writing
- Code Generation
- Learning & Education

---

## 7. File Changes Summary

### Core Style Updates
1. **`src/index.css`** - New CSS custom properties for Apple palette
2. **`tailwind.config.ts`** - New animations and design tokens

### Component Updates
3. **`src/pages/Index.tsx`** - Updated terminology, cleaner layout
4. **`src/components/RecipeCardLibrary.tsx`** - Complete redesign
5. **`src/components/RecipeCardEditor.tsx`** - Cleaner form styling
6. **`src/components/RecipeCardPreview.tsx`** - Minimal chrome
7. **`src/components/recipe-card/RecipeCardHeader.tsx`** - New branding
8. **`src/components/recipe-card/RecipeCardFooter.tsx`** - New branding
9. **`src/components/recipe-card/BasicInfoSection.tsx`** - Updated labels
10. **`src/components/recipe-card/TemplateSection.tsx`** - Rename Perplexity field
11. **`src/components/recipe-card/AICopilotPanel.tsx`** - Floating panel design
12. **`src/components/recipe-card/SlideLayout.tsx`** - Cleaner styling
13. **`src/components/recipe-card/DocumentLayout.tsx`** - Cleaner styling

### Collection & Analysis Updates
14. **`src/components/CollectionQuickActions.tsx`** - Remove Perplexity-specific
15. **`src/components/CollectionStats.tsx`** - Cleaner styling
16. **`src/hooks/useContentAnalysis.ts`** - Generic LLM keywords

### UI Component Enhancements
17. **`src/components/ui/button.tsx`** - Add press animation
18. **`src/components/ui/card.tsx`** - Glassmorphism variant
19. **`src/components/ui/input.tsx`** - New focus states

---

## 8. Implementation Order

**Phase 1: Foundation (Design Tokens & Base Components)**
1. Update `tailwind.config.ts` with new animations
2. Update `src/index.css` with Apple-inspired palette
3. Enhance base UI components (button, card, input)

**Phase 2: Core Components Redesign**
4. Redesign `RecipeCardHeader.tsx` and `RecipeCardFooter.tsx`
5. Update `RecipeCardLibrary.tsx` with new design
6. Clean up `RecipeCardEditor.tsx` form styling

**Phase 3: Terminology & Branding**
7. Update all Perplexity references to generic LLM terms
8. Update `useContentAnalysis.ts` with new categories
9. Update `CollectionQuickActions.tsx`

**Phase 4: Micro-Interactions**
10. Add hover animations to cards
11. Redesign AI Copilot as floating panel
12. Add page transition animations

---

## 9. Technical Notes

### Backwards Compatibility
- Database field names remain unchanged (`perplexity_chat_link`)
- Only UI labels change, data model stays stable
- Existing data continues to work

### Performance Considerations
- Use `will-change: transform` for animated elements
- Lazy load images and heavy content
- Use CSS transitions over JS animations where possible

### Accessibility
- Maintain focus indicators (just make them prettier)
- Keep ARIA labels intact
- Ensure color contrast ratios meet WCAG 2.1

---

## Visual Preview of the Transformation

```text
BEFORE:
┌─────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓ GRADIENT HEADER ▓▓▓▓▓▓▓▓▓       │
│  Recipe Card Library                         │
│  Manage your Perplexity Enterprise...        │
└─────────────────────────────────────────────┘
│ [ Search... ]  [ Filter ▼ ]                  │
├──────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐            │
│ │☑ Card  │ │☑ Card  │ │☑ Card  │ ← Busy    │
│ │ [Bgn]  │ │ [Int]  │ │ [Adv]  │   badges   │
│ └────────┘ └────────┘ └────────┘            │
└──────────────────────────────────────────────┘

AFTER:
┌─────────────────────────────────────────────┐
│                                              │
│  Pattern Library                             │
│  Discover how experts leverage AI            │
│                                              │
│  ○──────────────────────○  ○ Research ▼     │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  ┌────────────────┐  ┌────────────────┐     │
│  │                │  │                │     │
│  │  Pattern Name  ●  │  Pattern Name  ●     │
│  │  Description...   │  Description...       │
│  │                │  │                │     │
│  │  For: Analysts │  │  For: Writers  │     │
│  └────────────────┘  └────────────────┘     │
│                                              │
│                               ┌────┐         │
│                               │ ✦ │ ← AI    │
│                               └────┘         │
└─────────────────────────────────────────────┘
```

This transformation will create a sophisticated, Apple-inspired experience that positions the app as a premium tool for prompt and context engineering mastery.
