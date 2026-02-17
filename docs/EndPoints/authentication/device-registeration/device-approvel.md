---
id: approve-device
title: Approve Device
---

# Approve Device

This endpoint approves a previously registered device using a `magicLink`.
Once approved, the device is granted the necessary permissions to interact with the system.

---

## Endpoint

**GET**

```
/devices/{{decision}}/{{token}}
```

---

## Headers

```
Content-Type: application/json
Authorization: Bearer {{bearer-token}}
```

- `token` → received via email / push notification in production
- `decision` → user decision about new device, only two possibilities -> (approve/reject)

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

### Invalid Token

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid or expired link / token"
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
curl -X GET {{baseUrl}}/device/{{decision}}/{{token}}
```

**Note:**

_you cannot manually create this route its provided by via email, push notification or sms to trusted user, user just click this link and server validate automatically!_
