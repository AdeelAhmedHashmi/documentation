---
id: refresh-token
title: Refresh Token
---

# Refresh Token

Exchanges an active refresh token for a newly signed pair of access and refresh tokens without requiring re-authentication.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/auth/refresh`
- **Authentication:** Public
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Public endpoint. Does not require the Bearer `Authorization` header. Requires a valid, unexpired, trusted JWT refresh token in the request body.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| token | string | Yes | Valid JWT string | The current active refresh token |

### Example Request

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTgzMWI0YmM1OGVmZjc1YjQyMTBiOGUiLCJkZXZpY2VJZCI6ImFuZHJvaWQudW5pcXVlLmRldmljZS5pZCIsImlhdCI6MTc3MDEzMDQ2MCwiZXhwIjoxNzcwOTk0NDYwfQ.4hJ3s88TxtwUbGhPQp3AApAiNKxZx0RS7vAMMQHNnTs"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.tokens.accessToken | string | No | Newly issued JWT access token |
| data.tokens.refreshToken | string | No | Newly rotated JWT refresh token |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Missing or malformed token | Force user logout and redirect to login |
| 401 | Expired or untrusted token / revoked device | Clear stored credentials and display session expired screen |
| 500 | Server error | Retry with exponential backoff |

```json
{
  "message": "invalid or expired token",
  "code": 401,
  "data": {
    "message": "invalid or expired token",
    "error": "Unauthorized",
    "statusCode": 401
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Run silently in background via HTTP interceptor without freezing the UI.
- Empty state: Not applicable.
- Retry behavior: If a 401 is received during refresh, do not retry; immediately flush session cache and navigate to welcome screen.
- Cache invalidation: Atomically overwrite old stored tokens with the new token pair.
- Side effects: Updates database device record with new refresh token hash.
- Related realtime events: None.

## Related Endpoints

- [Request OTP](./request-otp.md)
- [Verify OTP](./verify-otp.md)
