# Gemini Codebase Guidelines

This document provides context for Gemini agents working on this codebase.

## Tech Stack
*   **Language:** TypeScript
*   **Framework:** Next.js (Monorepo structure)
*   **Styling:** Tailwind CSS / shadcn/ui (inferred from `marketing-website`)
*   **Package Manager:** npm / turbo

## Coding Conventions
*   **Style:** Follow existing ESLint / Prettier configurations.
*   **Imports:** Use absolute imports (e.g., `@/components/...`) where synonymous with project structure.
*   **Typing:** Strict typing required. No `any`. Define interfaces for all component props and API responses.
*   **Error Handling:** Use a centralized error handler where applicable. Do not swallow errors silently.
*   **Comments:** Explain *why*, not *what*. Document complex logic.

## Architecture Patterns
*   **Component Structure:** Prefer functional components.
*   **API Design:** RESTful conventions (Next.js API routes).
*   **Monorepo:** Be aware of `apps/` and `packages/` boundaries.

## Critical Rules (The "Code-Reviewer" Watchlist)
1.  **DRY:** Do not duplicate business logic. Extract to services/hooks.
2.  **Security:** Validate all inputs. Never commit secrets.
3.  **Performance:** Optimize images and usage of client-side hooks.
