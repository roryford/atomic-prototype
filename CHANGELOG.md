# Changelog

All notable changes to this project will be documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

## [1.0.2] - 2026-04-08

### Added
- `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `.github/CONTRIBUTING.md`
- PR and issue templates
- `npm run clean` and `npm run test:coverage` scripts
- `repository`, `homepage`, and `bugs` fields to `package.json`

### Fixed
- Form-field `<label>` now properly associated with its input via `for`/`id`
- Search bar wrapper has `role="search"`; eslint-disable suppression removed
- Decorative PrimeIcons have `aria-hidden="true"` across all components
- Stale VSCode debug config (Karma port 9876) replaced with Vitest note
- MSW `onUnhandledRequest` changed from `bypass` to `warn`
- `@defer` description corrected in production plan sketch
- `httpResource()` experimental API risk callout added to simulation report

### Security
- GitHub Actions pinned to full commit SHAs
- E2E Playwright step added to CI pipeline
- HTTP security headers added to `index.html` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)

## [1.0.1] - 2026-04-08

### Added
- Figma plugin for bidirectional design token sync between Figma Variables and the token pipeline
- `npm run build:tokens` script documentation

## [1.0.0] - 2025-12-01

### Added
- Angular 21 + PrimeNG 21 atomic design system prototype
- 4 atoms: DsButton, DsTag, DsInput, DsEmptyState
- 3 molecules: DsStatCard, DsSearchBar, DsFormField
- 3 organisms: DsStatGrid, DsProjectCardGrid, DsProjectTable
- 3 pages: Dashboard, List, Detail
- Design token pipeline (Style Dictionary, DTCG format)
- Storybook 10 component library
- 36 unit tests (Vitest via Angular CLI)
- 18 Playwright E2E tests
- GitHub Actions CI/CD pipeline
- Storybook auto-deploy to GitHub Pages
- Role-based documentation for developers, designers, BAs, and tech leads
