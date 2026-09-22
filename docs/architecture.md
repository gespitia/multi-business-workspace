# Architecture

Tenant identity is created in the application layer and carried explicitly through the workspace.

The shell decides which business is active. Application code owns tenant context. Infrastructure exposes tenant-aware repository access. A production backend would repeat the boundary and enforce tenant_id at the database layer with PostgreSQL row-level security.

The key principle is defense in depth: UI context is useful for behavior, but it is not a security boundary. Authorization and data isolation must be enforced server-side.