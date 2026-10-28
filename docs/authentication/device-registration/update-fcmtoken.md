---
id: update-fcmtoken
title: Update FCM Token
---

# Update FCM Token

Updates the Firebase Cloud Messaging (FCM) registration token associated with the caller's active device session for push notification delivery.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/devices/fcm-token`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token issued to a trusted, active device. Automatically associates the update with the authenticated user and `deviceId` present in the JWT claims.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| fcmtoken | string | Yes | Non-empty string | The refreshed Firebase Cloud Messaging registration token |

### Example Request

```json
{
  "fcmtoken": "fcm_token_sample_string_92837482"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "ok"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates whether update succeeded |
| message | string | No | Response message |
| data.result | string | No | Operation confirmation (`"ok"`) |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload | Check that `fcmtoken` is non-empty |
| 401 | Unauthenticated / device untrusted | Refresh access token or re-authenticate |
| 404 | Device or user record not found | Re-register device |
| 500 | Server error | Retry request later |

```json
{
  "message": "unauthorized request",
  "code": 401,
  "data": {
    "message": "unauthorized request",
    "error": "Unauthorized",
    "statusCode": 401
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Update token silently in background via native FCM token refresh listener (e.g. `onNewToken`).
- Empty state: Not applicable.
- Retry behavior: Exponential retry on network failure.
- Cache invalidation: Save local copy of active token to avoid redundant PATCH requests when token hasn't changed.
- Side effects: Replaces previous FCM token on device MongoDB document to ensure push notifications reach the device.
- Related realtime events: None.

## Related Endpoints

- [Register Device](./register-device.md)
- [Refresh Token](../user-registration/refresh-token.md)
