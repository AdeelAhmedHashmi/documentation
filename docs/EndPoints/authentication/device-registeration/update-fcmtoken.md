---
id: update-fcmtoken
title: Update Fcm Token
---

# Update FCM Token

This endpoint update the FCM Token of registered device.

---

## Endpoint

**PATCH**

```
/devices/fcm-token
```

---

## Headers

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

## Body

```json
{
  "fcmToken": "[device new fcmtoken]"
}
```

---

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "timestamp": "2026-02-03T17:39:10.011Z"
}
```

---

## Error Responses

### Invalid Parameters

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": ["fcmtoken should not be empty", "fcmtoken must be a string"],
  "timestamp": "2026-02-24T16:07:07.861Z"
}
```

### UnAuthorized

**Status:** `401 unauthorized`

```json
{
  "message": "invalid or expired token",
  "timestamp": "2026-02-24T16:07:07.861Z"
}
```

---

## Example (cURL)

```bash
curl -X PATCH {{baseUrl}}/devices/fcm-token
```
