---
id: request-otp
title: Request OTP
---

# Request OTP

This endpoint lets a user request a **one-time password (OTP)** for phone-based authentication.  
It’s usually the very first step in the login or signup flow.

When this endpoint is called, the server generates a short-lived OTP and sends it to the user’s phone via SMS or another messaging channel.

---

## Where to send the request

Send a `POST` request to:

```
/auth/otp/request
```

Make sure the request body is JSON.

---

## What to send

You need to send three things: the user’s phone number, their country, and a device identifier.

Example request body:

```json
{
  "phone": "+923012345678",
  "country": "PK",
  "deviceId": "android.unique.device.id"
}
```

### Field explanation

- **phone**
  The user’s phone number in international format.

- **country**
  The ISO country code. For example: `PK`, `IN`, `US`.

- **deviceId**
  A unique identifier for the user’s device. This helps with rate limiting and security.

---

## What you get back

If everything goes well, the server responds with a success message.

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "otp": 912283
  },
  "timestamp": "2026-02-03T14:46:16.374Z"
}
```

### Important note about the OTP

In development or testing, the OTP may be returned directly in the response.

In production, the OTP is **never returned** in the API response.
It is sent to the user’s phone via SMS or another delivery channel.

---

## Common failure cases

### Invalid phone number

If the phone number format is wrong:

```json
{
  "success": false,
  "message": "Invalid phone number"
}
```

### Too many requests

If the same user or device requests OTP too many times:

```json
{
  "success": false,
  "message": "Two many request"
}
```

This usually means the user should wait a bit before trying again.

---

## Typical Flow

```
Client → /auth/otp/request
User receives OTP on phone
Client → /auth/otp/verify
User is authenticated
```

---

## Example using cURL

```bash
curl -X POST {{baseUrl}}/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+923012345678",
    "country": "PK",
    "deviceId": "android.unique.device.id"
  }'
```

---

That’s it. This endpoint’s only job is to **start the authentication journey**.
Everything else (tokens, sessions, refresh logic) happens after OTP verification.
