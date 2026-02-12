---
id: group-schema
title: Group Schema
---

# Group Schema

This document defines a **Group object**, which represents a community space where users can interact together. A group has admins, members, optional circle association, and controlled join workflows.

Think of it as:

> **One group = admins + members + join rules + invitation code**

---

## Group Object (High-Level)

```ts
Group {
  id: string
  name: string
  circleId: string | null
  scope: GroupScope
  type: GroupType
  description: string | null
  image: string | null
  members: string[]
  admins: string[]
  invitationCode: string
  requests: string[]
  blocked: string[]
  createdAt: string
  updatedAt: string
}
```

---

## Core Concept (Mental Model)

A **Group = Identity + Access Model + Membership State**

It answers:

- _What is this group?_ (`name`, `description`, `image`)
- _Who runs it?_ (`admins`)
- _Who belongs to it?_ (`members`)
- _Who is trying to join?_ (`requests`)
- _Who is blocked?_ (`blocked`)
- _How does it relate to circles?_ (`circleId`, `scope`)

---

## Enums

### GroupType

Represents the group�s purpose.

```ts
GroupType =
  | "GENERAL"
  | "ANNOUNCEMENT"
```

Used for:

- UI layout decisions
- message permissions
- moderation policy

---

### GroupScope

Defines whether the group is tied to a circle or stands alone.

```ts
GroupScope =
  | "CIRCLE"
  | "STANDALONE"
```

Used for:

- discovery logic
- permission boundaries
- grouping in UI

---

## Field-by-Field Breakdown

### 1. Identity

#### `id: string`

Unique identifier of the group.

Used for:

- routing (`/group/:id`)
- permission checks
- message association

---

#### `name: string`

Human-readable group name.

Used for:

- headers
- search
- invitations

---

#### `description: string | null`

Optional summary of the group.

Used for:

- preview cards
- about pages

---

#### `image: string | null`

Optional group cover or avatar.

Used for:

- UI branding
- group listing thumbnails

---

### 2. Structure & Relationship

#### `circleId: string | null`

If present, the group belongs to a circle.

Used for:

- circle-specific discovery
- permissions inherited from circles

---

#### `scope: GroupScope`

Defines if the group is a circle group or standalone.

---

#### `type: GroupType`

Controls how the group behaves (regular chat vs announcements).

---

### 3. Membership

#### `admins: string[]`

List of admin user IDs.

Admins can:

- manage members
- accept/reject requests
- block users
- delete group

---

#### `members: string[]`

List of member user IDs.

Members can:

- read messages
- participate based on group type

---

### 4. Join Control

#### `invitationCode: string`

Unique code used for join requests.

Used for:

- private group entry
- invite links

---

#### `requests: string[]`

List of users who requested to join.

Admins can accept or reject these.

---

#### `blocked: string[]`

Users blocked from the group.

Blocked users:

- cannot join
- cannot send requests

---

### 5. Timestamps

#### `createdAt: string`

Creation timestamp in ISO format.

---

#### `updatedAt: string`

Last update timestamp in ISO format.

---

## Rules and Constraints

These are the practical rules the schema implies in real usage:

1. **At least one admin**
   - A group must always keep at least one admin.
   - If the last admin leaves, the system should block that action.

2. **Join flow consistency**
   - A user cannot be both in `members` and `requests` at the same time.
   - A user in `blocked` cannot be added to `members` or `requests`.

3. **Invitation code uniqueness**
   - Invitation codes must be unique across all groups.
   - The code is the primary key for request-to-join workflows.

4. **Circle linkage rules**
   - If `scope` is `CIRCLE`, then `circleId` must be set.
   - If `scope` is `STANDALONE`, then `circleId` should be null.

5. **Announcement group behavior**
   - `type = ANNOUNCEMENT` implies restricted posting (admins only).
   - `type = GENERAL` implies full member participation.

---

## Indexing and Performance Notes

Suggested indexing strategies for scale:

- `circleId` index improves circle-scoped browsing.
- `scope` and `type` indexes help filter group lists quickly.
- `admins` and `members` indexes are essential for user group discovery.
- `invitationCode` must be indexed and unique for fast join requests.

---

## Security and Access Model

- **Admins** have full control (manage requests, block users, delete group).
- **Members** have access based on group `type`.
- **Blocked users** are denied entry and cannot re-request without admin action.
- **Requests** allow a controlled join flow instead of direct membership.

---

## Common Operations (Workflow Mapping)

These are common actions and which fields are touched:

- **Create group** ? `admins` initialized with creator, `invitationCode` generated.
- **Request to join** ? user added to `requests`.
- **Accept request** ? user moved from `requests` to `members`.
- **Reject request** ? user removed from `requests`.
- **Block user** ? user removed from `members`, added to `blocked`.
- **Unblock user** ? user removed from `blocked`.
- **Delete group** ? group removed entirely.

---

## Full Example Group Object

```json
{
  "id": "group_123",
  "name": "Programmer's Team",
  "circleId": null,
  "scope": "STANDALONE",
  "type": "GENERAL",
  "description": "A public group for developers",
  "image": "https://...",
  "members": ["user_2", "user_3"],
  "admins": ["user_1"],
  "invitationCode": "invite_abc_123",
  "requests": ["user_4"],
  "blocked": ["user_9"],
  "createdAt": "2026-02-07T00:00:00.000Z",
  "updatedAt": "2026-02-07T12:00:00.000Z"
}
```

---

## Frontend Features This Enables

This schema powers:

- group listing screens
- admin moderation panels
- join request workflows
- invitation-based onboarding
- access control by type and scope

---

## Mental Model for Frontend Devs

Think in layers:

```
Group
 +-- Identity (name, description, image)
 +-- Structure (scope, circleId, type)
 +-- Access (admins, members)
 +-- Control (requests, blocked, invitationCode)
```

---

## Real-World Comparison

This design matches:

| Platform | Equivalent Concept |
| -------- | ------------------ |
| Discord  | Server             |
| Telegram | Group / Channel    |
| WhatsApp | Group              |
| Slack    | Workspace channel  |

---

## Architect-Level Insight

This schema provides:

- clean separation of admins and members
- strong join control with requests and blocks
- flexibility for circle-based or standalone communities
- extensible group types without breaking the data model
