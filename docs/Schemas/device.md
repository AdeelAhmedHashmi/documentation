---
id: device-schema
title: Device Schema
---

# Device Schema

This document defines a **Device object**, which represents **one physical device** a user has logged in from.

Think of it as:

> **One user = many devices = many sessions**

Examples:

- User logs in from:
  - iPhone
  - Android phone
  - Laptop browser
    → That’s **3 Device records**.

---

## Device Object (High-Level)

```ts
Device {
  id: string
  userId: string
  deviceId: string
  fcmToken: string
  deviceType: DeviceType
  deviceName: string
  isActive: boolean
  isTrusted: TrustStatus
  lastActiveAt: string (ISO Date)
  ipAddress: string
  platformVersion: string
  refreshToken: string | null
  createdAt: string
  updatedAt: string
}
```

---

## Core Concept (Mental Model)

A **Device = Session + Hardware Identity + Security State**

It answers:

- _Which device is this?_
- _Is it trusted?_
- _Is it active?_
- _Can it refresh tokens?_
- _When was it last seen?_

---

## Enums

### DeviceType

Represents the platform.

Typical values:

```ts
DeviceType =
  | "android"
  | "ios"
  | "web"
  | "desktop"
  | "other"
```

Used for:

- icons
- filtering
- analytics
- security logs

---

### TrustStatus

Represents security trust level.

```ts
TrustStatus =
  | "trusted"
  | "untrusted"
```

Used for:

- device approval flows
- suspicious login detection
- 2FA logic

---

## Field-by-Field Breakdown

### 1. Identity

#### `id: string`

Unique ID of this device record.

Used for:

- revoke session
- logout device
- admin security panel

---

#### `userId: string`

Which user owns this device.

Mostly internal for frontend, but useful in:

- admin dashboards
- multi-user systems

---

#### `deviceId: string`

Unique identifier of the physical device.

Example:

```json
"deviceId": "android.unique.device.id"
```

This should be:

- generated once
- persisted on client
- reused on every login

This is the **real identity of the device**.

---

### 2. Push Notifications

#### `fcmToken: string`

Firebase Cloud Messaging token.

Used for:

- push notifications
- background alerts
- call notifications
- chat messages

If this changes → backend updates it.

---

### 3. Device Info

#### `deviceType: DeviceType`

Platform type.

Example:

```json
"deviceType": "android"
```

---

#### `deviceName: string`

Human-readable name.

Example:

```json
"deviceName": "Pixel 9"
"deviceName": "Chrome on Windows"
```

Used in:

- “Logged in devices” screen
- Security emails

---

#### `platformVersion: string`

OS or app version.

Example:

```json
"platformVersion": "Android 14"
"platformVersion": "Web 2.3.1"
```

Used for:

- debugging
- analytics
- compatibility checks

---

### 4. Activity & Status

#### `isActive: boolean`

Is this session still valid?

```json
"isActive": true
```

If false:

- device is logged out
- refresh token is removed
- session is dead

---

#### `lastActiveAt: string`

Last time device made a request.

Example:

```json
"lastActiveAt": "2026-02-05T10:22:11.000Z"
```

Used for:

- “Last seen”
- auto logout
- suspicious activity detection

---

### 5. Security

#### `isTrusted: TrustStatus`

```json
"isTrusted": "trusted"
```

If `untrusted`:

- refresh token is removed
- user must re-verify device
- common in:
  - new device
  - new country
  - password change

---

#### `ipAddress: string`

IP used at login.

Example:

```json
"ipAddress": "182.190.45.12"
```

Used for:

- security alerts
- country detection
- fraud prevention

---

### 6. Refresh Token

#### `refreshToken: string | null`

This is **never a real token in frontend**.
It’s always:

- hashed
- invisible
- server-only

Frontend just knows:

- does this device have a refresh token or not?

Logic:

- If `null` → session cannot refresh
- If exists → device can get new access tokens

---

## Special Security Rules (Very Important)

These rules define **real-world security behavior**:

### Rule 1 – Token is Always Hashed

```text
Real token → hashed → stored
```

Even if database leaks → attacker cannot use it.

---

### Rule 2 – If Device Deactivated

```ts
isActive = false → refreshToken = null
```

Meaning:

> logout this device completely

---

### Rule 3 – If Device Untrusted

```ts
isTrusted = "untrusted" → refreshToken = null
```

Meaning:

> force re-verification

---

### Rule 4 – Refresh Token Comparison

Server does:

```ts
compareRefreshToken(realToken, hashedToken);
```

Frontend never sees any of this.
It just sends refresh token when needed.

---

## Full Example Device Object

```json
{
  "id": "dev_123",
  "userId": "user_456",
  "deviceId": "android.unique.device.id",
  "fcmToken": "fcm_abc_123",
  "deviceType": "android",
  "deviceName": "Pixel 9",
  "isActive": true,
  "isTrusted": "trusted",
  "lastActiveAt": "2026-02-05T10:22:11.000Z",
  "ipAddress": "182.190.45.12",
  "platformVersion": "Android 14",
  "refreshToken": null,
  "createdAt": "2026-02-01T12:00:00.000Z",
  "updatedAt": "2026-02-05T10:22:11.000Z"
}
```

---

## Frontend Features This Enables

This schema powers:

### 1. “Logged in devices” screen

Like Google / Facebook:

```
Pixel 9 – Android 14
Last active: 2 minutes ago
[Logout]
```

---

### 2. Security Alerts

> New login from Chrome on Windows in Lahore.

---

### 3. Device Approval Flow

WhatsApp-style:

```
New device detected.
Approve from your trusted device.
```

---

### 4. Kill All Sessions

```text
Set isActive = false for all devices
```

---

### 5. Trust Management

```text
Mark device as trusted after OTP / email verification
```

---

## Mental Model for Frontend Devs

Think in layers:

```
User
 └── Devices[]
      ├── Identity (deviceId, name)
      ├── Platform (type, version)
      ├── Security (trusted, active)
      ├── Session (refresh token)
      └── Activity (lastActiveAt, IP)
```

---

## Real-World Comparison

This design matches:

| Platform | Equivalent Concept |
| -------- | ------------------ |
| Google   | “Your devices”     |
| WhatsApp | Linked devices     |
| Telegram | Active sessions    |
| GitHub   | Authorized devices |
| Netflix  | Manage devices     |

---

## Architect-Level Insight

This is a **production-grade security model**.

It gives you:

- multi-device login
- session revocation
- refresh token rotation
- trust-based security
- zero-trust defaults
- breach-resistant storage
