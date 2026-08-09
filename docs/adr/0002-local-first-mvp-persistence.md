# ADR-0002: Local-first persistence for the MVP

**Status:** Accepted

## Context

ContributorOps needs persistence for contribution plans, portfolio evidence, control mode, audit-oriented state, and early product packaging. The current project is an open-source product foundation rather than a production multi-tenant SaaS deployment.

Introducing hosted database infrastructure too early would increase setup friction and obscure the core contribution workflow behind account, migration, tenancy, and secret-management concerns.

## Decision

Use repository-local JSON-backed persistence for the MVP and keep storage access behind focused API helpers so the persistence implementation can be replaced later.

The project must describe this as an MVP/local-development boundary and must not imply that file-backed state is appropriate for concurrent multi-user production workloads.

## Consequences

### Positive
- clone-and-run onboarding stays simple
- state is inspectable and easy to debug
- contributors can understand data flow without external infrastructure
- product behavior can evolve before a production schema is locked in

### Negative
- no strong concurrent-write semantics
- no tenant isolation
- no production backup/recovery model
- horizontal scaling is not supported

## Alternatives considered

### Hosted PostgreSQL from day one
Deferred because it adds operational surface before the product needs multi-user persistence.

### Browser-only persistence
Rejected as the primary boundary because API-side workflows and controlled GitHub actions also need durable state.

## Migration trigger

A production database should be introduced when the product needs real multi-user accounts, tenant isolation, durable hosted execution, or production-grade concurrency. That migration should preserve the storage abstraction and be recorded in a new ADR.