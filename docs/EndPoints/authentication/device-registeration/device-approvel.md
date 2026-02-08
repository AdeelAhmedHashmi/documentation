---
id: approve-device
title: Approve Device
---

# Approve Device

This endpoint approves a previously registered device using a `magicLink`.
Once approved, the device is granted the necessary permissions to interact with the system.

---

## Endpoint

**POST**

```
/devices/approve/{{magic-link}}
```

---

## Headers

```
Content-Type: application/json
Authorization: Bearer {{bearer-token}}
```

- `magic-link` → received via email / push notification in production
- `bearer-token` → authenticated user token

---

## Request Body

```json
{
  "deviceId": "android.unique.189",
  "deviceType": "android",
  "deviceName": "pixel 9",
  "platformVersion": "2.32.1"
}
```

---

## Request Fields

| Field           | Type   | Description                       |
| --------------- | ------ | --------------------------------- |
| deviceId        | string | Unique device identifier          |
| deviceType      | string | Device type (android / ios / web) |
| deviceName      | string | Human-readable device name        |
| platformVersion | string | App or OS version                 |

---

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": "permissions for device pixel 9 approve successfully",
  "timestamp": "2026-02-03T17:39:10.011Z"
}
```

---

## Error Responses

### Invalid Magic Link

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid or expired magic link"
}
```

### Unauthorized

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Bearer token missing or invalid"
}
```

### Device Not Found

**Status:** `404 Not Found`

```json
{
  "success": false,
  "message": "Device not registered"
}
```

---

## Example (cURL)

```bash
curl -X POST {{baseUrl}}/devices/approve/{{magic-link}} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{bearer-token}}" \
  -d '{
    "deviceId": "android.unique.189",
    "deviceType": "android",
    "deviceName": "pixel 9",
    "platformVersion": "2.32.1"
  }'
```
