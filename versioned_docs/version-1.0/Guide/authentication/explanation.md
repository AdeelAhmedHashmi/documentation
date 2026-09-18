# Authentication, Authorization, and Device Registration: Conceptual Guide

This guide teaches the end-to-end security model for:

- User identity verification
- Device registration and trust
- Session/token lifecycle
- Access control (authentication vs authorization)

It is intentionally conceptual and implementation-agnostic.

## 1) Core Concepts

Authentication (AuthN):

- Proves who the user is.
- Example: OTP verification + valid token + trusted device.

Authorization (AuthZ):

- Decides what an authenticated user is allowed to do.
- Example: user can access only resources they own or belong to.

Device trust:

- Adds a second gate beyond user identity.
- Even with a valid user, access is denied if the device is untrusted.

Session tokens:

- Short-lived access token for API calls.
- Longer-lived refresh token for rotating new sessions.
- Refresh tokens should be stored hashed server-side.

## 2) High-Level Security Architecture

```text
                  +----------------------+
                  |  Public Endpoints    |
                  |  (OTP, Verify, etc.) |
                  +----------+-----------+
                             |
                             v
                      [Identity Proof]
                             |
                             v
                      [Device Trust Check]
                             |
                             v
                     [Issue Session Tokens]
                             |
                             v
+-----------------+   Bearer Access Token   +----------------------+
| Protected APIs  |<------------------------| Auth Guard / Gateway |
+-----------------+                         +----------+-----------+
                                                      |
                                                      v
                                             [AuthZ Rules per Resource]
```

## 3) User Registration / First Login Flow (OTP-Based)

Goal: identify the user and create account if it does not exist.

```text
Client                     Auth Service                  Storage
  |                             |                          |
  | Request OTP (phone, device) |                          |
  |---------------------------->|                          |
  |                             | rate-limit by phone+ip  |
  |                             | store OTP with TTL       |
  |                             |------------------------->|
  |<----------------------------| OTP sent/returned        |
  |                             |                          |
  | Submit OTP + device info    |                          |
  |---------------------------->|                          |
  |                             | verify OTP (single-use)  |
  |                             |------------------------->|
  |                             | find user by phone       |
  |                             | create user if missing   |
  |                             | upsert device record     |
  |                             | set active session state |
  |                             | trust decision           |
  |                             |                          |
  |<----------------------------| either tokens OR verify-device-required
```

Key ideas:

- OTP must expire quickly and be one-time use.
- User account creation can happen automatically after successful OTP.
- Device metadata is captured at verification time (device ID/type/name/platform/push token).

## 4) Trusted Device Registration Flow

For a new/untrusted device, you can require a second verification step.

```text
New Device Login Attempt
        |
        v
[Device not trusted]
        |
        v
[Generate approval token/link]
        |
        +--> Verify via trusted device push
        +--> Verify via email link
        `--> Verify via SMS link
        |
        v
[Approve] -> mark device trusted
[Reject ] -> mark untrusted or remove device
```

Why this matters:

- Prevents account takeover from stolen OTP/social engineering.
- Allows known devices to approve new ones.

## 5) Token Lifecycle and Rotation

```text
Login/OTP Verify
   |
   +--> issue Access Token (short TTL)
   |
   `--> issue Refresh Token (long TTL)
            |
            `--> store HASH(refresh token) on device session

Refresh Request
   |
   +--> verify refresh JWT signature/expiry
   +--> load device session
   +--> require trusted + active device
   +--> compare submitted token vs stored hash
   `--> rotate:
         - new access token
         - new refresh token
         - replace stored refresh hash
```

Security benefits:

- Stolen DB record does not reveal usable refresh token.
- Rotation limits replay window.
- Device trust/state can instantly block refresh.

## 6) Request Authentication on Protected APIs

Typical request gate:

```text
Incoming Request
   |
   +--> check Authorization header
   +--> validate JWT (signature + expiry)
   +--> extract userId + deviceId
   +--> load user + device session
   +--> ensure user is active (not suspended/inactive)
   +--> ensure device is trusted
   `--> attach user/device context to request
```

If any check fails, reject with unauthorized response.

## 7) Authorization Model (After Authentication)

After identity is confirmed, apply resource-level rules:

- Ownership checks (is this user the owner/author?)
- Membership checks (is this user part of the workspace/group?)
- Role checks (admin/moderator/member capabilities)

```text
Authenticated User
       |
       v
[Can access resource?]
   |           |
  Yes         No
   |           |
   v           v
Allow       Deny (forbidden/conflict/not-found)
```

Best practice:

- Keep authN and authZ separate in mental model.
- AuthN says "who are you?"
- AuthZ says "can you do this here?"

## 8) Device Management Lifecycle

Recommended device states:

- Trusted + Active: normal session usage
- Trusted + Inactive: known device, currently logged out
- Untrusted: blocked until approved

Common actions:

- Register device metadata
- Approve/reject device trust
- Mark device active on login
- Mark inactive on logout/suspicious event
- Update push token periodically
- Revoke refresh token when device untrusted/inactive

## 9) End-to-End Flow Summary

```text
1) Request OTP  -> rate-limited + TTL
2) Verify OTP   -> identify/create user
3) Register/upsert device
4) If trusted    -> issue tokens
5) If untrusted  -> require device verification
6) Access APIs   -> auth guard validates user + trusted device
7) Refresh token -> verify + rotate + persist hashed token
8) AuthZ checks  -> ownership/membership/role per endpoint
```

## 10) Common Pitfalls to Avoid

- Treating OTP success as enough without device trust.
- Storing refresh tokens in plaintext.
- Not rotating refresh tokens.
- Missing account-state checks (suspended/inactive users).
- Skipping authorization checks after authentication.
- No limit/TTL on OTP and verification links.
- Failing to invalidate refresh token when trust becomes untrusted.

## 11) Quick Developer Checklist

- Is OTP rate-limited and short-lived?
- Is OTP single-use?
- Do we create/fetch user safely on verification?
- Is device trust explicitly modeled?
- Are refresh tokens hashed and rotated?
- Does every protected route verify user + device?
- Does every sensitive route apply authZ rules?
- Can device trust changes immediately cut off sessions?
