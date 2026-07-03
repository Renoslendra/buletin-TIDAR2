---
name: Buletin GMAHK - Church Bulletin System
description: Modern, warm, mobile-first design system for church bulletin management
colors:
  primary: "#1B4D3E"
  primary-light: "#2D7A5F"
  primary-dark: "#0F3028"
  accent: "#D4A853"
  accent-light: "#E8C97A"
  surface: "#FEFCF7"
  surface-dim: "#F5F0E8"
  surface-bright: "#FFFFFF"
  on-surface: "#1A1A1A"
  on-surface-variant: "#5A5A5A"
  outline: "#D9D2C4"
  outline-variant: "#E8E3D8"
  error: "#BA1A1A"
  success: "#1B6D3E"
  warning: "#8B6D1B"

typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.4
    textTransform: uppercase
    letterSpacing: 0.05em

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px

rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px

shadows:
  sm: 0 1px 3px rgba(0, 0, 0, 0.08)
  md: 0 4px 12px rgba(0, 0, 0, 0.1)
  lg: 0 8px 24px rgba(0, 0, 0, 0.12)
  xl: 0 16px 48px rgba(0, 0, 0, 0.15)

breakpoints:
  mobile: 0-639px
  tablet: 640-1023px
  desktop: 1024px+
---

## Overview

Buletin GMAHK is a church bulletin management system for GMAHK Jemaat Tidar 2 Surabaya. The design emphasizes warmth, clarity, and ease of use for church administrators managing Sabbath worship schedules and bulletins.

**Design Philosophy:**
- Warm and inviting - reflects church community values
- Clear hierarchy - easy to scan and find information
- Mobile-first - used on phones during church activities
- Accessible - readable for all ages

## Colors

### Primary Palette
- **Primary (#1B4D3E)**: Deep forest green - trust, growth, faith. Used for headers, navigation, primary actions.
- **Primary Light (#2D7A5F)**: Lighter green for hover states and secondary elements.
- **Accent (#D4A853)**: Warm gold - celebration, importance. Used for highlights, active states, CTAs.

### Surface Colors
- **Surface (#FEFCF7)**: Warm off-white background - reduces eye strain.
- **Surface Dim (#F5F0E8)**: Slightly darker for cards and sections.
- **Surface Bright (#FFFFFF)**: Pure white for emphasis areas.

### Text Colors
- **On Surface (#1A1A1A)**: Primary text - high contrast, readable.
- **On Surface Variant (#5A5A5A)**: Secondary text - labels, descriptions.

### Semantic Colors
- **Success (#1B6D3E)**: Completed actions, verified status.
- **Warning (#8B6D1B)**: Pending items, attention needed.
- **Error (#BA1A1A)**: Errors, destructive actions.

## Typography

### Display (Page Titles)
- Font: Cormorant Garamond (serif)
- Size: 2.5rem (40px)
- Weight: 600
- Use: Main page titles, bulletin header

### Headlines (Section Headers)
- Font: Inter (sans-serif)
- Size: 1.75rem (28px)
- Weight: 700
- Use: Card titles, section breaks

### Titles (Subsections)
- Font: Inter
- Size: 1.25rem (20px)
- Weight: 600
- Use: List item titles, form labels

### Body (Content)
- Font: Inter
- Size: 1rem (16px)
- Weight: 400
- Line height: 1.6
- Use: Paragraphs, descriptions

### Caption (Small Text)
- Font: Inter
- Size: 0.875rem (14px)
- Use: Timestamps, metadata, hints

### Labels (Tags, Badges)
- Font: Inter
- Size: 0.75rem (12px)
- Weight: 600
- Text transform: UPPERCASE
- Letter spacing: 0.05em
- Use: Status badges, category labels

## Components

### Cards
- Background: Surface Bright (#FFFFFF)
- Border: 1px solid Outline Variant (#E8E3D8)
- Border radius: 12px (rounded-lg)
- Shadow: sm (subtle)
- Padding: 16px mobile, 24px desktop
- Hover: Slight elevation increase

### Buttons

**Primary Button**
- Background: Primary (#1B4D3E)
- Text: White
- Border radius: 8px (rounded-md)
- Padding: 12px 24px
- Font weight: 600
- Hover: Primary Light (#2D7A5F)
- Active: Primary Dark (#0F3028)

**Secondary Button**
- Background: transparent
- Border: 1.5px solid Primary
- Text: Primary
- Hover: Primary with 10% opacity fill

**Accent Button (CTA)**
- Background: Accent (#D4A853)
- Text: Primary Dark
- Font weight: 700
- Use: Main actions, "Generate", "Upload"

**Ghost Button**
- Background: transparent
- Text: On Surface Variant
- Hover: Surface Dim
- Use: Tertiary actions, cancel

**Icon Button**
- Size: 40px × 40px
- Border radius: full (circle)
- Background: transparent
- Hover: Surface Dim
- Use: Delete, edit, navigation

### Input Fields
- Background: Surface (#FEFCF7)
- Border: 1.5px solid Outline (#D9D2C4)
- Border radius: 8px
- Padding: 12px 16px
- Focus: Border color Primary, ring Primary with 20% opacity
- Error: Border color Error
- Label: Above input, Label style, color On Surface Variant

### Tables
- Header: Surface Dim background, Label style text
- Rows: Alternating Surface/Surface Bright
- Hover: Surface Dim
- Border: 1px solid Outline Variant
- Mobile: Convert to card layout

### Status Badges
- Draft: Gray background, gray text
- Processing: Blue background, blue text
- Success: Green background, green text
- Reviewed: Gold background, gold text
- Failed: Red background, red text
- Border radius: full (pill shape)
- Padding: 4px 12px
- Font: Label style

### Alerts
- Border radius: 8px
- Border-left: 4px solid (color varies by type)
- Padding: 12px 16px
- Types: Info (blue), Success (green), Warning (yellow), Error (red)

### Navigation (Sidebar - Desktop)
- Width: 256px
- Background: Primary Dark (#0F3028)
- Text: White with 80% opacity
- Active item: White text, Surface Dark background
- Logo: Top section with church name

### Navigation (Bottom Bar - Mobile)
- Position: Fixed bottom
- Background: Surface Bright
- Border-top: 1px solid Outline Variant
- Height: 64px
- 4-5 main icons with labels
- Active: Primary color icon and text

### Page Header
- Title: Display font (serif)
- Description: Body text, On Surface Variant
- Actions: Right-aligned buttons
- Mobile: Stack vertically

## Layout

### Desktop (1024px+)
- Sidebar: Fixed left, 256px wide
- Content: Full remaining width
- Max content width: 1200px centered
- Grid: 12-column grid with 24px gap

### Tablet (640-1023px)
- Sidebar: Collapsed to icons only (64px) or hidden
- Content: Full width with 16px padding
- Grid: 8-column grid with 16px gap

### Mobile (0-639px)
- No sidebar - use bottom navigation
- Content: Full width with 16px padding
- Single column layout
- Bottom nav: Fixed, 64px height

### Spacing Scale
- xs (4px): Inline gaps, icon margins
- sm (8px): Small component gaps
- md (16px): Standard padding, section gaps
- lg (24px): Card padding, large section gaps
- xl (32px): Page sections
- 2xl (48px): Major section breaks
- 3xl (64px): Hero sections

## Mobile-Specific Patterns

### Touch Targets
- Minimum: 44px × 44px
- Spacing between targets: 8px minimum

### Bottom Sheet (Mobile Actions)
- Trigger: Swipe up or button tap
- Background: Surface Bright
- Border radius: 16px top corners
- Handle: 40px × 4px bar at top
- Content: Scrollable

### Card Stack (Mobile Lists)
- Cards stacked vertically
- 16px gap between cards
- Full width with 16px horizontal padding
- Swipe actions: Delete (red), Edit (primary)

### Form Layout (Mobile)
- Single column
- Full-width inputs
- Sticky action bar at bottom
- Labels above inputs

## Bulletin-Specific Components

### Bulletin Preview (A4 Page)
- Aspect ratio: 210:297 (A4)
- Background: White
- Border: 1px solid Outline Variant
- Shadow: lg
- Scales to fit container
- Print-ready styling

### Schedule Row
- Date badge: Accent background
- Name: Body text
- Role: Caption text, On Surface Variant
- Mobile: Card layout with date prominently shown

### Upload Dropzone
- Border: 2px dashed Outline
- Border radius: 12px
- Background: Surface
- Active: Border Primary, background Primary with 5% opacity
- Icon: Upload cloud, 48px
- Text: "Drag & drop or click to upload"

## Do's and Don'ts

### Do
- Use warm colors consistently to maintain church aesthetic
- Keep sufficient contrast for readability (WCAG AA minimum)
- Use serif font (Cormorant) only for display/title elements
- Maintain consistent spacing using the scale
- Use status badges to show extraction state
- Provide clear feedback for all actions
- Design for thumb-friendly mobile navigation

### Don't
- Use cold/blues as primary colors (maintains warmth)
- Mix serif and sans-serif in the same line
- Use more than 3 font sizes in one section
- Create touch targets smaller than 44px
- Use pure black (#000) for text - use On Surface instead
- Ignore mobile view - always design mobile-first
- Use decorative fonts for body text

## Icons

Use Lucide React icons consistently:
- Size: 20px default, 16px for compact, 24px for emphasis
- Stroke width: 1.5px (default)
- Color: Inherit from text color
- Active state: Primary color

## Motion

### Transitions
- Duration: 150ms (fast), 200ms (normal), 300ms (slow)
- Easing: ease-out for enter, ease-in for exit
- Use: Hover states, focus rings, page transitions

### Loading States
- Skeleton screens for content loading
- Spinner for actions (button loading)
- Progress bar for file uploads

## Print Styles

### Bulletin Print
- Hide all navigation and chrome
- White background
- A4 page size
- Proper margins (10mm)
- Page break handling
- Font sizes adjusted for print readability

---

## References

- Design inspired by warm, editorial aesthetics
- Mobile patterns from Material Design 3
- Typography scale from Tailwind CSS defaults
- Color system follows WCAG 2.1 AA contrast requirements
