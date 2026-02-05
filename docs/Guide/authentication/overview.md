---
id: overview
title: Overview
sidebar_position: 1
---

**Subtitle:** A Device-Bound, Consensus-Based Security Architecture

---

## **Table of Contents**

1. Chapter 1: Philosophy & Core Architecture
2. Chapter 2: The Identity & Credential Layer
3. Chapter 3: The Device Sovereignty System
4. Chapter 4: The Consensus Protocol (Magic Link)
5. Chapter 5: The Guard Mechanism
6. Chapter 6: Data Models & Persistence

---

# **Chapter 1: Philosophy & Core Architecture**

### 1.1 The Problem with Standard Auth

Traditional authentication systems (JWT or Session-based) rely heavily on passwords or OTPs. Once a token is issued, it can often be reused anywhere. If compromised, the attacker gains full access.

### 1.2 The Sentinel Solution

Sentinel introduces a **Zero-Trust, Device-Bound** philosophy:
Access requires **two truths**:

- **Identity Verification**: The user possesses the correct OTP.
- **Hardware Verification**: The request comes from a **trusted device**.

### 1.3 High-Level Architecture

- **Auth Service**: Handles OTP exchange and token issuance.
- **Device Service**: Manages device registration, trust states, and lifecycle.
- **Guards**: Enforce real-time policies for every API request.

Sentinel is implemented as a **modular monolith** using NestJS.

---

# **Chapter 2: The Identity & Credential Layer**

### 2.1 Entry Point

- Passwordless authentication via **phone-based OTPs**.
- Reduces friction and eliminates password fatigue.

### 2.2 OTP Lifecycle

- **Normalization**: Converts phone numbers to standard format (E.164).
- **Rate Limiting**: Throttles requests per IP/device to prevent spam.
- **Generation & Hashing**: OTP tied to specific device, stored temporarily.

### 2.3 Verification & Token Issuance

- **OTP Verification** against stored hash.
- **Device Check**:
  - **Trusted device** → JWT issued.
  - **Untrusted/new device** → redirect to device registration protocol (Chapter 3).

---

# **Chapter 3: The Device Sovereignty System**

### 3.1 Hardware Fingerprinting

Each request carries a **Device Signature**:

- `deviceId` (unique hardware ID)
- `fcmToken` (push notifications)
- `deviceType` & `platformVersion` (audit trails)

### 3.2 Trust Hierarchy

- **Active / Inactive** → tracks usage history
- **Trusted** → can request/refresh tokens
- **Untrusted** → can verify OTPs but not access protected resources

### 3.3 Device Registration

- New device is stored as **untrusted**.
- Login attempt triggers **Magic Link** process for approval.

---

# **Chapter 4: The Consensus Protocol (Magic Link)**

### 4.1 Security Challenge

- Prevent unauthorized device logins.
- Requires **consensus from an existing trusted device**.

### 4.2 Magic Link Workflow

- **Generation**: Unique UUID stored in Redis (TTL: 15 mins).
- **Broadcasting**: Sent via push/SMS to trusted devices.
- **Decision**:
  - **Approve**: Device becomes trusted.
  - **Reject**: Device entry deleted; attacker blocked.

### 4.3 Security Measures

- **Atomic Operations**: Approval is race-condition safe.
- **Identity Locking**: Magic Link tied to a specific user.

---

# **Chapter 5: The Guard Mechanism**

### 5.1 Always-On Interceptor

- Unlike standard JWT guards, Sentinel checks both **token validity** and **device trust**.

### 5.2 Verification Chain

1. **JWT Signature Check**: Validity & expiration
2. **Account Status**: ACTIVE, INACTIVE, SUSPENDED
3. **Device Integrity**:
   - `deviceId` extracted from token
   - Device registry queried
   - `isTrusted` must be TRUE

4. **Payload Binding**: Ensures token’s `userId` matches `deviceId` owner

### 5.3 Real-Time Revocation

- Admin can flip a device to `UNTRUSTED`.
- JWT alone is insufficient; access blocked immediately.

---

# **Chapter 6: Data Models & Persistence**

### 6.1 Overview

Sentinel’s **data layer is policy-driven**:

- User Identity: minimal & status-aware
- Device Ledger: trust-first, real-time
- Ephemeral Tokens: OTPs & Magic Links
- Persistence: MongoDB (primary) + Redis (ephemeral)

### 6.2 User Entity

- Stores minimal identity: `phone`, `accountStatus`, `_id`
- Decoupled from OTP or device metadata
- Enables rapid lookup and account status enforcement

### 6.3 Device Ledger

- Each device is **first-class**:
  - `deviceId`, `userId`, `deviceName`, `deviceType`, `platformVersion`
  - `fcmToken` for notifications
  - `isActive`, `isTrusted`, `lastActiveAt`, `ipAddress`

- Supports audit trails and fine-grained revocation

### 6.4 Ephemeral Security Artifacts

- **OTPs and Magic Links** stored in Redis with TTL
- Temporary artifacts ensure **no stale security risk**
- Expired artifacts automatically removed

### 6.5 Persistence Strategy

- **MongoDB**: Stores users and devices, with indexes on `userId` and `deviceId`
- **Redis**: Handles ephemeral secrets for fast verification and low latency
- Indexed queries ensure guard checks remain sub-10ms

### 6.6 Security Advantages

| Feature               | Benefit                                   |
| --------------------- | ----------------------------------------- |
| Device as primary key | Prevents token theft attacks              |
| Trust flag            | Real-time revocation                      |
| Redis TTL             | Automatic expiration of ephemeral secrets |
| Indexed queries       | Fast verification                         |
| Audit-ready schema    | Traceability for every login/device       |
