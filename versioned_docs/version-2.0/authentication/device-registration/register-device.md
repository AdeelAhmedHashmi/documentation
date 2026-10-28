---
id: register-device
title: Register Device
---

# Register Device

Registers a new client device for an existing user account and triggers multi-device authorization verification via Push Notification, Email, or SMS.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/devices/register`
- **Authentication:** Public
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Public endpoint. Phone number must correspond to an active registered user account.

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
| phone | string | Yes | Valid phone string | Registered user's phone number |
| deviceId | string | Yes | Unique string | Hardware device identifier |
| deviceType | string | Yes | `android`, `ios`, `web`, `desktop`, `other` | Hardware / client platform |
| deviceName | string | Yes | Non-empty string | Human readable model (e.g. `"Pixel 7"`, `"iPhone 15"`) |
| platformVersion | string | Yes | Non-empty string | OS or software release version |
| fcmToken | string | Yes | Non-empty string | Firebase Cloud Messaging device token |
| location | string | Yes | Non-empty string | Geographic description or city/country |

### Example Request

```json
{
  "phone": "+923190895413",
  "deviceId": "android.unique.device.id.0",
  "deviceType": "android",
  "deviceName": "itel s23",
  "platformVersion": "android16",
  "fcmToken": "pending_fcmtoken3",
  "location": "Pakistan, Islamabad"
}
```

## Response

### Success Shape 1: Production Mode (`201 Created`)

Returned in production environments (`ENV=prod`), indicating the verification method dispatched to the user.

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "message": "verify device from trusted other device",
    "method": "push_notification"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Success Shape 2: Development / Sandbox Mode (`201 Created`)

Returned in development environments (`ENV=dev`) to facilitate local testing without live email/SMS/FCM gateways.

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "approvalLink": "http://localhost:4000/api/v1/devices/approve/278c2e94-ec62-487c-af85-8e64d12c1228",
    "rejectionLink": "http://localhost:4000/api/v1/devices/reject/278c2e94-ec62-487c-af85-8e64d12c1228"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates successful registration request |
| message | string | No | Response status message |
| data.message | string | Yes | Instructions for the user (in prod mode) |
| data.method | string | Yes | Verification channel: `push_notification`, `email`, or `sms` |
| data.approvalLink | string | Yes | Direct approval URL with token (in dev mode) |
| data.rejectionLink | string | Yes | Direct rejection URL with token (in dev mode) |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Phone not registered or validation failure | Show error "Phone number is not registered" |
| 429 | Rate limit exceeded | Prompt user to wait before attempting registration again |
| 500 | Server error | Show server communication error |

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

## Frontend Notes

- Loading state: Display "Requesting authorization from your existing devices...".
- Empty state: Not applicable.
- Retry behavior: Allow re-triggering registration if approval notification expired (links expire after 30 minutes).
- Cache invalidation: Poll the device verification state or await FCM notification payload confirming authorization.
- Side effects: Stores pending device record in MongoDB with `trustStatus: 'untrusted'` and caches approval payload in Redis.
- Related realtime events: `notification.device_verification`.

## Related Endpoints

- [Approve / Reject Device](./device-approval.md)
- [Update FCM Token](./update-fcmtoken.md)
