---
id: message-schema
title: Message Schema
---

# Message Schema

This document defines a **Message object**, which represents a single message in a chat conversation.

Think of it as:

> **One message = sender + conversation + content/media + delivery/read state**

---

## Message Object (High-Level)

```ts
Message {
  id: string
  conversationId: string
  senderId: string
  type: MessageType
  mediaGroupId: string | null
  sequenceIndex: number | null
  content: string
  attachment: string | null
  deliveredTo: string[]
  seenBy: string[]
  isDeleted: boolean
  deletedAt: string | null
  deletedBy: string | null
  createdAt: string
  updatedAt: string
}
```

---

## Core Concept (Mental Model)

A **Message = Identity + Payload + Status**

It answers:

- _Who sent this and where?_ (`senderId`, `conversationId`)
- _What is the message type and payload?_ (`type`, `content`, `attachment`)
- _Is this part of grouped media?_ (`mediaGroupId`, `sequenceIndex`)
- _What is the delivery/read state?_ (`deliveredTo`, `seenBy`)
- _Is it soft deleted?_ (`isDeleted`, `deletedAt`, `deletedBy`)

---

## Enums

### MessageType

Represents what kind of message this is.

```ts
MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "gif"
  | "emoji"
  | "file"
```

Used for:

- rendering rules in chat UI
- validation of allowed payload types
- feature behavior (text vs media/file flow)

---

## Field-by-Field Breakdown

### 1. Identity & Ownership

#### `id: string`

Unique identifier of the message document.

Used for:

- message actions (edit/delete/retry)
- cursor-based pagination anchors
- delivery/read tracking updates

---

#### `conversationId: string`

Reference to the chat/conversation this message belongs to (`Chat` ObjectId).

Used for:

- listing messages per conversation
- querying conversation history

Notes:

- indexed in schema for faster reads

---

#### `senderId: string`

Reference to the sender user (`User` ObjectId).

Used for:

- ownership checks
- sender-based UI grouping

Notes:

- indexed in schema

---

### 2. Payload

#### `type: MessageType`

Type of the message payload.

Notes:

- defaults to `"text"`
- validated against enum values

---

#### `content: string`

Main textual content of the message.

Used for:

- text rendering
- search use cases

Notes:

- required in schema
- marked with `searchable: true` metadata

---

#### `attachment: string | null`

Optional reference to a media document (`Media` ObjectId).

Used for:

- media/file message payloads
- fetching file metadata and URLs

---

### 3. Media Grouping

#### `mediaGroupId: string | null`

Optional grouping key for related media messages (album-like posts).

Used for:

- bundling multiple media items together in UI

---

#### `sequenceIndex: number | null`

Optional order of an item inside a media group.

Used for:

- preserving media order in grouped messages

---

### 4. Delivery and Read State

#### `deliveredTo: string[]`

User IDs for recipients that have delivery confirmation.

Notes:

- defaults to empty array
- `select: false` so it is hidden from default queries

---

#### `seenBy: string[]`

User IDs for recipients that have seen/read the message.

Notes:

- defaults to empty array
- `select: false` so it is hidden from default queries

---

### 5. Deletion State

#### `isDeleted: boolean`

Soft-delete flag for the message.

Used for:

- hiding removed content without hard deletion

Notes:

- defaults to `false`
- indexed in schema

---

#### `deletedAt: string | null`

Timestamp for when the message was soft deleted.

---

#### `deletedBy: string | null`

Deletion metadata field as currently modeled in schema.

Notes:

- in code it is typed as `Date`

---

### 6. Timestamps

#### `createdAt: string`

Creation timestamp in ISO format (auto-managed by Mongoose timestamps).

---

#### `updatedAt: string`

Last update timestamp in ISO format (auto-managed by Mongoose timestamps).

---

## Rules and Constraints

These are practical rules implied by the schema:

1. **Conversation and sender are mandatory**
   - `conversationId` and `senderId` are required for every message.

2. **Type is controlled**
   - `type` must be one of `MessageType` values.
   - If omitted, it becomes `"text"`.

3. **Soft delete model**
   - Messages are not necessarily removed from DB.
   - `isDeleted` + deletion metadata indicate removal state.

4. **Hidden tracking fields**
   - `deliveredTo` and `seenBy` are not returned by default because `select: false` is set.

5. **Grouped media support**
   - `mediaGroupId` and `sequenceIndex` allow message albums/batches.

---

## Indexing and Performance Notes

Defined indexes:

- `conversationId` index for conversation message queries
- `senderId` index for sender-based queries
- `isDeleted` index for filtering active vs deleted messages
- `createdAt` descending index (`{ createdAt: -1 }`) for latest-first retrieval

---

## Common Operations (Workflow Mapping)

Common actions and touched fields:

- **Send text message** -> `conversationId`, `senderId`, `type="text"`, `content`
- **Send media message** -> `type`, `attachment`, optional `content`
- **Send grouped media** -> `mediaGroupId`, `sequenceIndex`, `attachment`
- **Mark delivered** -> update `deliveredTo`
- **Mark seen** -> update `seenBy`
- **Soft delete message** -> set `isDeleted=true`, set `deletedAt`/`deletedBy`

---

## Full Example Message Object

```json
{
  "id": "msg_123",
  "conversationId": "67d0f84f0a4f4f49f2a4c111",
  "senderId": "67d0f84f0a4f4f49f2a4c222",
  "type": "image",
  "mediaGroupId": "album_88",
  "sequenceIndex": 1,
  "content": "Sunset photo",
  "attachment": "67d0f84f0a4f4f49f2a4c333",
  "deliveredTo": ["67d0f84f0a4f4f49f2a4c444"],
  "seenBy": [],
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null,
  "createdAt": "2026-03-09T10:30:00.000Z",
  "updatedAt": "2026-03-09T10:30:00.000Z"
}
```

---

## Notes

- `replyTo` is intentionally excluded from this document because its experimental
