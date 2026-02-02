---
id: register-device
title: Register Device
---

# Register Device

This endpoint registers a user’s device in the system and returns a `magicLink` that can be used for device-based authentication or verification.

---

## Endpoint

**POST**

```
/devices/register
```

---

## Headers

```

Content-Type: application/json

```

---

## Request Body

```json
{
  "phone": "+923012345678",
  "deviceId": "android.unique.189",
  "deviceType": "android",
  "deviceName": "pixel 9",
  "platformVersion": "2.32.1",
  "fcmToken": "equuwidsafsbncbbbersfewrwqejios"
}
```

---

## Request Fields

| Field           | Type   | Description                       |
| --------------- | ------ | --------------------------------- |
| phone           | string | User’s phone number               |
| deviceId        | string | Unique identifier for the device  |
| deviceType      | string | Device type (android / ios / web) |
| deviceName      | string | Human-readable device name        |
| platformVersion | string | App or OS version                 |
| fcmToken        | string | Push notification token           |

---

## Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "magicLink": "278c2e94-ec62-487c-af85-8e64d12c1228"
  },
  "timestamp": "2026-02-03T15:01:47.723Z"
}
```

---

## Response Fields

| Field     | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| magicLink | string | Unique token for device verification |

---

## Error Responses

### Invalid Request

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid device data"
}
```

### Device Already Registered

**Status:** `409 Conflict`

```json
{
  "success": false,
  "message": "Device already registered"
}
```

---

## Example (cURL)

```bash
curl -X POST {{baseUrl}}/devices/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+923012345678",
    "deviceId": "android.unique.189",
    "deviceType": "android",
    "deviceName": "pixel 9",
    "platformVersion": "2.32.1",
    "fcmToken": "equuwidsafsbncbbbersfewrwqejios"
  }'
```
