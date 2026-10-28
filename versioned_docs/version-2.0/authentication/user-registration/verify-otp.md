---
id: verify-otp
title: Verify OTP
---

# Verify OTP

Validates the submitted OTP against the phone session and registers or signs in the device, returning authentication tokens or initiating trusted device verification.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/auth/otp/verify`
- **Authentication:** Public
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Public endpoint. No prior Authorization token is required. Successful completion authenticates the user and device.

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
| otpInfo.phone | string | Yes | Valid phone string | Normalized phone number |
| otpInfo.otp | string | Yes | 6 digits | The OTP received by user |
| otpInfo.country | string | No | 2-letter CountryCode | Optional country code |
| deviceInfo.deviceId | string | Yes | Non-empty string | Unique persistent client identifier |
| deviceInfo.deviceType | string | Yes | `android`, `ios`, `web`, `desktop`, `other` | Platform category |
| deviceInfo.deviceName | string | Yes | Non-empty string | Human-readable device model |
| deviceInfo.platformVersion | string | Yes | Non-empty string | OS or client version |
| deviceInfo.fcmToken | string | Yes | Non-empty string | Firebase push notification token |

### Example Request

```json
{
  "otpInfo": {
    "phone": "+923125790700",
    "otp": "115782",
    "country": "PK"
  },
  "deviceInfo": {
    "deviceId": "android.unique.device.id.1",
    "deviceType": "android",
    "deviceName": "pixel7",
    "platformVersion": "0.9.1",
    "fcmToken": "pending_fcmtoken3"
  }
}
```

## Response

### Success Shape 1: Direct Authentication (`200 OK`)

Returned when registering a new user or logging in on a device that doesn't require secondary device confirmation.

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "user": {
      "isNew": false
    }
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Success Shape 2: Device Verification Required (`200 OK`)

Returned when the user already has active trusted devices, and this new device must be approved by an existing device before access tokens are granted.

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "requiresDeviceVerification": true
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates successful execution |
| message | string | No | Response description |
| data.tokens.accessToken | string | Yes | Bearer JWT access token (15-day expiry) |
| data.tokens.refreshToken | string | Yes | JWT refresh token (10-day expiry) |
| data.user.isNew | boolean | Yes | `true` if account was newly provisioned during this call |
| data.requiresDeviceVerification | boolean | Yes | `true` if client must route user to "Approve on other device" screen |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid OTP or expired session | Display "Incorrect or expired code" error |
| 401 | Unauthorized | Prompt user to request a fresh OTP |
| 500 | Server error | Show unexpected error message |

```json
{
  "message": "invalid or expired otp",
  "code": 400,
  "data": {
    "message": "invalid or expired otp",
    "error": "Bad Request",
    "statusCode": 400
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Disable keypad and show verification loader.
- Empty state: Highlight unfilled digit boxes.
- Retry behavior: Allow user to re-enter OTP up to 3 attempts before locking for cooldown.
- Cache invalidation: If `requiresDeviceVerification` is true, poll or listen on WebSocket/FCM for approval confirmation.
- Side effects: Stores tokens securely in Keystore/Keychain/EncryptedSharedPreferences.
- Related realtime events: `device.registered`, `notification.device_verification`.

## Related Endpoints

- [Request OTP](./request-otp.md)
- [Refresh Token](./refresh-token.md)
- [Register Device](../device-registration/register-device.md)
- [Approve Device](../device-registration/device-approval.md)
