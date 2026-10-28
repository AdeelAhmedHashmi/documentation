---
slug: suffa-api-architecture-breaking-changes
title: Major API and Architecture Changes
description: A major breaking change to the Suffa Transportation Layer that reflect directly on client side
authors:
  - adeel
tags:
  - suffa
  - backend
  - api
  - architecture
  - breaking-change
---

# Major API and Architecture Changes

This release introduces major breaking changes to the Server APIs
and its underlying server architecture.

These changes affect API endpoints, request/response contracts,
authentication, real-time communication, and internal server components.

> **Breaking Change**
> This release is not backward compatible with the previous API.
> Clients using the previous API implementation will need to migrate.

{/* truncate */}

## Why We Made These Changes

Explain the problems with the previous architecture.

For example:

- limitations in the previous API structure
- inconsistent endpoint conventions
- problems with scalability
- real-time architecture changes
- database/data-model changes
- authentication changes
- maintainability issues

## API Changes

### Authentication

#### Before

```http
POST /v1/auth/...
```

#### After

```http
POST /v2/auth/...
```

Explain exactly what changed.

### User Endpoints

#### Before

```http
...
```

#### After

```http
...
```

### Messaging Endpoints

Explain the changes here.

## Request and Response Changes

### Before

```json
{
  "..."
}
```

### After

```json
{
  "..."
}
```

Explain:

- renamed fields
- removed fields
- new fields
- changed types
- changed status codes
- changed error format

## Server Architecture Changes

Explain the architectural changes separately from the public API.

### Previous Architecture

```text
Client
  ↓
NestJS Server
  ├── Auth
  ├── Users
  ├── Messages
  ├── Chat
  └── Media
       ↓
   MongoDB
   Redis
```

### New Architecture

```text
Client
  ↓
API Server
  ├── ...
  │
  ├── ...
  │
  └── ...
       ↓
 MongoDB
 Redis
 ...
```

## Real-Time Architecture

Explain changes to:

- WebSocket connections
- presence
- notifications
- message delivery
- Redis
- queues
- events

## Data Model Changes

Document changes to MongoDB collections/schemas.

## Authentication Changes

Explain:

- access tokens
- refresh tokens
- devices
- verification
- session handling

## Migration Guide

If someone is using the old API:

```text
Old API
   ↓
Update client
   ↓
Update authentication
   ↓
Update endpoints
   ↓
Update request/response handling
   ↓
New API
```

### Endpoint Migration Table

| Old Endpoint  | New Endpoint | Change           |
| ------------- | ------------ | ---------------- |
| `POST /...`   | `POST /...`  | Renamed          |
| `GET /...`    | `GET /...`   | Response changed |
| `DELETE /...` | Removed      | No replacement   |

## Breaking Changes Summary

- API endpoint changes
- Request/response contract changes
- Authentication changes
- Real-time changes
- Data-model changes
- Architecture changes

## Compatibility

State clearly whether:

- old endpoints remain available
- a migration period exists
- the old API will be removed

> ⚠️ **Breaking Change**
>
> This release contains breaking changes to the Suffa API.
> Existing clients may require changes before they can use this version.
