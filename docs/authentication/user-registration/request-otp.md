---
id: request-otp
title: Request OTP
---

# Request OTP

Generates and dispatches a One-Time Password (OTP) to the specified phone number for user registration or authentication.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/auth/otp/request`
- **Authentication:** Public
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

This is a public endpoint accessible without an authorization token. Rate limiting is applied per IP address and phone number to avoid spam.

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
| phone | string | Yes | Valid international phone string | User's phone number |
| country | string | No | 2-letter ISO CountryCode (e.g. `PK`, `US`) | Country code for phone normalization |
| deviceId | string | Yes | Non-empty string | Unique persistent client device identifier |

### Example Request

```json
{
  "phone": "+923125790700",
  "country": "PK",
  "deviceId": "android.unique.device.id.1"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "otp": "481920"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates whether the request was successful |
| message | string | No | Human-readable response summary |
| data.otp | string | No | Generated OTP verification code (returned in dev mode/sandbox; in production dispatched via SMS) |
| timestamp | string | No | ISO 8601 server timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid request | Highlight invalid phone or missing device ID |
| 429 | Rate limited | Disable OTP button and show countdown timer |
| 500 | Server error | Show retry alert |

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

## Frontend Notes

- Loading state: Disable submit button, render spinner, prevent duplicate submissions.
- Empty state: Pre-fill device ID from local storage or native device hardware API.
- Retry behavior: Provide a 60-second resend cooldown before allowing user to request another OTP.
- Cache invalidation: Clear previous authentication state or stale verification tokens.
- Side effects: Stores verification session in backend Redis cache with a short TTL (e.g., 5 minutes).
- Related realtime events: None.

## Related Endpoints

- [Verify OTP](./verify-otp.md)
- [Register Device](../device-registration/register-device.md)
