---
id: device-approval
title: Device Approval
---

# Device Approval

Approves or rejects a newly enrolled device using a secure, time-limited magic token dispatched via email or push notification.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/devices/:decision/:token`
- **Authentication:** Public
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Public endpoint accessed directly via magic links in push notifications, web browsers, or emails. The `token` carries embedded, cryptographically validated verification state stored in Redis.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| decision | string | Yes | Verification decision: must be either `approve` or `reject` |
| token | string | Yes | Opaque UUID token issued during device registration |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
GET /api/v1/devices/approve/4358cb55-8bda-4bdd-b69e-6878c58bdbf7 HTTP/1.1
Host: localhost:4000
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "deviceName": "pixel7",
    "platformVersion": "android16",
    "action": "approve"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates whether approval or rejection succeeded |
| message | string | No | Response message |
| data.deviceName | string | No | The name/model of the verified device |
| data.platformVersion | string | No | The operating system / platform version of the device |
| data.action | string | No | The final action recorded (`approve` or `reject`) |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid or expired link / Device already trusted | Display "This link has expired or the device was already verified" |
| 409 | Unauthorized / missing token | Inform user to request a new link |
| 500 | Server error | Show standard system error |

```json
{
  "message": "invalid or expired link",
  "code": 400,
  "data": {
    "message": "invalid or expired link",
    "error": "Bad Request",
    "statusCode": 400
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display animated verification shield while resolving token.
- Empty state: Show invalid link graphic if token parameter is absent.
- Retry behavior: If token is expired, instruct user to initiate registration again from the secondary device.
- Cache invalidation: Invalidate cached device lists on client; on the pending device, re-trigger login check.
- Side effects:
  - If approved: marks device `trustStatus = 'trusted'`.
  - If rejected: removes the untrusted device record and purges session from Redis.
- Related realtime events: Notifies pending device via FCM socket event `device.approved` or `device.rejected`.

## Related Endpoints

- [Register Device](./register-device.md)
- [Verify OTP](../user-registration/verify-otp.md)
