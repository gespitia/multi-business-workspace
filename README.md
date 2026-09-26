# Multi-Business Workspace

A focused front-end reference implementation for a multi-business product: one owner can switch between businesses while the application keeps tenant context explicit.

## Architecture
UI / App Shell -> Tenant Context -> Business Module -> Backend Core boundary -> Tenant-aware Repository -> PostgreSQL RLS boundary.

The repository models the backend and database boundaries instead of pretending the browser is enforcing production isolation.

## Why this is a project
It contains executable domain/application code, a tenant-aware repository boundary, tests, architecture documentation and a deployable demo.

## Run
npm install
npm run dev

## Test
npm test

## Important limitation
This is a browser-first reference implementation. PostgreSQL RLS is represented as an architectural boundary; no production database is connected.

See docs/architecture.md and the ADRs.

## Microfrontend

The workspace can run standalone or be consumed as a Web Component by an App Shell.

Build both outputs:

```bash
npm run build:all
```

The microfrontend bundle is generated in `dist-micro/`.

Example host integration:

```html
<script type="module" src="/microfrontend/multi-business-workspace.js"></script>

<multi-business-workspace tenant-id="blue-table" role="owner"></multi-business-workspace>
```

The component exposes `workspace-ready` and `workspace-event` as composed custom events.

### Theme inheritance

The microfrontend has a complete default theme, but its visual tokens can be supplied by the host. Set these custom properties on the host or any ancestor:

```css
.app-shell {
  --mb-bg: var(--surface-app);
  --mb-paper: var(--surface-panel);
  --mb-ink: var(--text-primary);
  --mb-muted: var(--text-secondary);
  --mb-line: var(--border-subtle);
  --mb-soft: var(--surface-soft);
  --mb-accent: var(--brand-primary);
  --mb-font-family: var(--font-family);
}
```

If the host does not provide them, the microfrontend falls back to its own defaults. The component uses Shadow DOM for structural style isolation while allowing the host to provide its design tokens explicitly.
