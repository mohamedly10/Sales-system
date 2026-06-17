/**
 * Centralized High-Contrast Theme Config
 * 
 * Edit these Tailwind CSS classes to immediately swap colors across
 * the entire application (including active states, borders, and shadows).
 */
export const THEME = {
  // Brand / Accent theme (e.g. Red, Coral, Blue, Violet etc.)
  primary: {
    solid: 'bg-red-600',               // Primary filled element background
    solidHover: 'hover:bg-red-700',    // Hover on primary filled elements
    lightBg: 'bg-red-50',              // Light accent highlight backgrounds (soft contrast)
    text: 'text-red-600',              // Bold primary status text
    textHover: 'hover:text-red-500',    // Primary link & item hover state texts
    textLight: 'text-red-700',          // Accent text inside soft highlights
    borderActive: 'border-red-600',    // Solid active visual accent borders
    borderLight: 'border-red-200',     // Light decorative accent borders
    ringFocus: 'focus:ring-red-100/80 focus:border-red-300/80',   // Softer, calmer focus ring and border
    shadowAccent: 'shadow-red-200',    // Box glow accents
    shadowSoft: 'shadow-red-100'       // Soft drop shadows
  },

  // Interface Neutrals (Sleek minimalist white, light slates, off-grays)
  neutral: {
    pureWhite: 'bg-white',                     // Pure surface background
    appBackground: 'bg-slate-50/20',           // Main desktop display tray
    softBgTray: 'bg-slate-50/50',              // Interactive subtle background panels
    hoverBg: 'hover:bg-slate-50',              // General menu list item hover background
    hoverBgTransparent: 'hover:bg-slate-50/60', // Soft item hover
    textDark: 'text-slate-800',                // High-readability titles
    textMedium: 'text-slate-600',              // Body content
    textMuted: 'text-slate-400',               // Secondary tags and icons
    textDisabled: 'text-slate-500',            // Subtle metadata annotations
    borderLight: 'border-slate-100',           // Sleek crisp row dividers
    borderMedium: 'border-slate-200'           // Heavy button/card border dividers
  }
};
