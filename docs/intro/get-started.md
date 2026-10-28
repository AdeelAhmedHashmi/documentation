---
id: get-started
title: Getting Started
---

# Getting Started with Suffa HTTP API

Welcome to the Suffa Backend HTTP REST API reference documentation. This guide outlines API architecture conventions, base URLs, authentication flows, standard response structures, and error handling mechanisms.

## Base URL & Versioning

All API requests are routed through the global versioned prefix `/api/v1` (configurable via `PREFIX` environment variable):

```
Development: http://localhost:4000/api/v1
Production:  https://api.suffah.buzz/api/v1
```

Exceptions: Root system diagnostics and analytics HTML dashboards are served directly at `/` and excluded from API prefixing.

## Request & Content Guidelines

- All requests transmitting payload bodies must include the header `Content-Type: application/json`.
- Authenticated endpoints require the header `Authorization: Bearer <access_token>`.
- Client requests must provide valid ISO date formats and MongoDB ObjectIDs for path parameters where designated.

## Response Wrapper Envelope

All successful responses are uniformly formatted through the `GlobalResponseInterceptor`:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": { ... },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Standard Response Envelope Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| `success` | boolean | No | Always `true` for standard 2xx responses |
| `message` | string | No | Descriptive status message (default: `"request processed successfully"`) |
| `data` | object / array / null | Yes | The actual payload data returned by the handler |
| `timestamp` | string (ISO-8601) | No | Exact UTC timestamp when the response was serialized |

## Error Responses & Exception Format

All unhandled exceptions and HTTP errors are intercepted by `GlobalExceptionFilter`. Error shapes vary systematically based on the nature of the error:

### 1. DTO Validation Errors (`400 Bad Request`)

When class-validator fails:

```json
{
  "message": [
    "phone must be a valid phone number",
    "deviceId should not be empty"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

### 2. Standard Application / Business Logic Error (`4xx` / `5xx`)

When a NestJS `HttpException` (e.g. `UnauthorizedException`, `NotFoundException`, `ConflictException`) is thrown:

```json
{
  "message": "phone number not registered",
  "code": 400,
  "data": {
    "message": "phone number not registered",
    "error": "Bad Request",
    "statusCode": 400
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

### 3. Server Internal Error (`500 Internal Server Error`)

```json
{
  "message": "internal server error description",
  "code": 500,
  "cause": "error from server",
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Authentication & Multi-Device Security Model

Suffa enforces a strict device-bound authentication architecture:

1. **OTP Verification:** User submits phone number to receive an SMS OTP.
2. **Device Registration:**
   - If the user has no existing trusted devices, the newly registered device is automatically trusted, returning access & refresh tokens.
   - If existing active trusted devices exist, the backend flags `requiresDeviceVerification: true`. An approval notification (push, email, or SMS) containing a magic link is dispatched to existing trusted devices.
3. **Session Verification (`AuthGuard`):** Every request checks:
   - Valid JWT token signature and expiration.
   - User account status is neither `suspended` nor `inactive`.
   - Matching device ID exists in the database and maintains `trustStatus === 'trusted'`.
   - Automatically touches `lastActive` timestamp for the active device.
