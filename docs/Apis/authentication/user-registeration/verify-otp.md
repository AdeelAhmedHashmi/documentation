---
id: verify-otp
title: Verify OTP
---

# Verify OTP

This endpoint verifies the OTP sent to the user’s phone number and, if valid, returns authentication tokens.

---

## Endpoint

**POST**

```
/auth/otp/verify
```

## Request Body

```json
{
  "otpInfo": {
    "phone": "923012345678",
    "otp": "249364",
    "country": "PK"
  },
  "deviceInfo": {
    "deviceId": "android.unique.device.id",
    "deviceType": "android",
    "deviceName": "pixel9",
    "platformVersion": "0.9.0",
    "fcmToken": "ksjfjdsfkljiowuerio2u39048"
  }
}
```

---

## Request Fields

### otpInfo

| Field   | Type   | Description          |
| ------- | ------ | -------------------- |
| phone   | string | User’s phone number  |
| otp     | string | OTP received by user |
| country | string | Country code         |

### deviceInfo

| Field           | Type   | Description              |
| --------------- | ------ | ------------------------ |
| deviceId        | string | Unique device identifier |
| deviceType      | string | android / ios / web      |
| deviceName      | string | Device name              |
| platformVersion | string | App or OS version        |
| fcmToken        | string | Push notification token  |

---

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "token": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "currentDevice": null
    }
  },
  "timestamp": "2026-02-03T14:54:20.637Z"
}
```

---

## Error Responses

### Invalid OTP

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

### Verification Failed

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "OTP verification failed"
}
```

---

## Example (cURL)

```bash
curl -X POST {{baseUrl}}/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "otpInfo": {
      "phone": "923012345678",
      "otp": "249364",
      "country": "PK"
    },
    "deviceInfo": {
      "deviceId": "android.unique.device.id",
      "deviceType": "android",
      "deviceName": "pixel9",
      "platformVersion": "0.9.0",
      "fcmToken": "ksjfjdsfkljiowuerio2u39048"
    }
  }'
```
