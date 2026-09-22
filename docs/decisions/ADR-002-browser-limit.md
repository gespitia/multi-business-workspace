# ADR-002: Model, do not fake, the database boundary

Decision: keep PostgreSQL RLS as a documented backend boundary in this browser project.

Reason: claiming browser code provides tenant security would be misleading.

Consequence: the demo explains where production enforcement belongs without inventing a backend that is not deployed.