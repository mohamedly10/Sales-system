# AGENTS.md

## Commands

```bash
npm run dev        # dev server on port 3000
npm run build      # vite build
npm run lint       # tsc --noEmit (typecheck only, no linter/formatter)
npm run clean      # rm -rf dist server.js
```

No test runner or formatter configured. `npm run lint` is the only CI gate.

## Architecture

- **Feature-based** folders under `src/features/{dashboard,navigation,operations}/`, each with its own `components/` subdir.
- **Shared UI primitives** in `src/components/ui/` — currently `Dropdown`, `SearchInput`.
- **No router**. Navigation is `activeId` state in `App.tsx` → `MainContent` renders the feature component via a `switch` statement (`MainContent.tsx:98-115`).
- **Theme** centrally defined in `src/theme.ts` using Tailwind class strings. Import `THEME` from `../../../theme` in feature components.
- **RTL app** — root shell has `dir="rtl"`, all labels/text in Arabic.

## Conventions

- **Imports/exports CRUD pattern** — each operations component (People, Imports, Exports) follows the same layout: 3 stats cards → header with "add" button → searchable/filterable table → modal form with drag-and-drop file upload. Mirror this pattern for new operations features.
- **Styled with Tailwind v4** — `@tailwindcss/vite` plugin, no PostCSS config. Use `@theme` in `index.css` for custom tokens.
- **Path alias** `@/` → project root (tsconfig + vite config).
- **Icons** from `lucide-react`. **Animations** from `motion` (framer-motion v12).
- **Server-side Gemini API** available via `@google/genai` + `express` — app has `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` capability.

## HMR / Dev Server Quirk

In AI Studio environments, `DISABLE_HMR=true` disables HMR and file watching to prevent flickering during agent edits. This also disables file watching (`vite.config.ts:14-20`). If HMR is not working, check this env var.

## .env

`GEMINI_API_KEY` and `APP_URL` are injected by AI Studio at runtime. `.env*` is gitignored (except `.env.example`). Never hardcode secrets.
