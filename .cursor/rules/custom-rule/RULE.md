---
alwaysApply: true
---

# =========================

# GLOBAL PROJECT RULES

# =========================

- This project follows a strict, pre-defined architecture.
- Do NOT change folder structure.
- Do NOT introduce new architectural patterns.
- Prefer editing existing files over creating new ones.
- Avoid large refactors unless explicitly requested.
- Reuse existing components, hooks, utilities, and services first.
- Do not duplicate logic already present in the codebase.
- Keep changes minimal and scoped to the requested feature or fix.

# =========================

# FOLDER RESPONSIBILITIES

# =========================

## assets/

- Contains only static files (images, SVGs, lotties).
- Do NOT place logic or components here.

## components/

- Global, app-wide components only.
- Do NOT add feature-specific components here.
- Used for overlays, global widgets, and system-level UI.
- These components must remain reusable and stateless where possible.

## hooks/

- Contains reusable custom hooks only.
- Hooks must not contain UI.
- Business logic may live here only if reused across features.

## layout/

- Used only for authenticated app layout and global UI structure.
- Do NOT add business logic here.
- Layout components should compose existing components only.

## pages/

- Simple standalone pages only (login, forgot password, 404).
- No Redux logic.
- No feature complexity.

## routes/

- Routing configuration only.
- Do NOT place UI or business logic here.
- Follow existing config-based routing pattern.
- Nested routes must stay inside their respective \*Routes folders.

## services/

- ALL API calls must live here.
- Use axiosInstance and endpoint definitions only.
- Do NOT call APIs directly from components or views.
- auth.js is the single source of truth for authentication logic.

## shared/

- Reusable UI building blocks only.
- No feature-specific logic.
- Components here must be generic and composable.
- Prefer using existing shared components before creating new ones.

## sockets/

- WebSocket setup and listeners only.
- No UI logic.
- Socket events should dispatch Redux actions.

## store/

- Redux slices and actions only.
- State must be grouped by domain.
- Do NOT mix multiple domains in one slice.
- Views must dispatch actions and select from slices.
- Settings-related data must remain inside settings slices.

## styles/

- Styling only.
- Use existing SCSS structure and variables.
- Do NOT add inline styles unless unavoidable.
- Respect PrimeFlex overrides.

## utils/

- Pure utility functions only.
- No React, no Redux, no side effects.
- Reuse existing utilities before creating new ones.

## views/

- Feature-level pages only.
- Views may compose shared components and layouts.
- Views should not contain API logic.
- Views should use Redux + services for data.
- Keep views thin: UI composition, dispatch actions, select state.

# =========================

# CODE GENERATION RULES

# =========================

- Do NOT create new components unless absolutely required.
- Do NOT introduce new contexts if Redux already handles the state.
- Avoid helper functions used only once.
- Do not add unnecessary comments.
- Follow existing naming conventions exactly.
- Match import order and file patterns from nearby files.
- If unsure where code belongs, ask before generating.

# =========================

# SAFETY RULES

# =========================

- Never break existing flows.
- Never modify unrelated files.
- Never assume missing requirements.
- If a change affects routing, store, or services, explain briefly before applying.
