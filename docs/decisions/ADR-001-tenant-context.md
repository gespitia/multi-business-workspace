# ADR-001: Explicit tenant context

Decision: model tenant identity as an explicit application value instead of scattered global state.

Reason: business switching is cross-cutting and must remain observable.

Consequence: every tenant-scoped read has a clear tenant identifier at the boundary.