---
id: message-schema
title: Message Schema
---

# Message & Media Schema

This document describes the **Message object**, which represents **one single message** inside a conversation (chat, group, or channel).

Think of it as:

> **Conversation = timeline of Message objects**

Each message can be:

- text
- media
- or both
- with delivery & seen states

---

## Message Object (High Level)

```ts
Message {
  id: string
  conversationId: string
  senderId: string
  type: MessageType
  content: string
  media?: Media[]
  deliveredTo: string[]
  seenBy: string[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Mental Model

A **Message is mutable content + mutable state**

```
Content:
  - text
  - media

State:
  - deliveredTo
  - seenBy
  - isDeleted
```

This matches **WhatsApp / Telegram / iMessage architecture**.

---

## MessageType

Defines what kind of message this is.

Typical values:

```ts
MessageType =
  | "text"
  | "image"
  | "video"
  | "file"
  | "audio"
  | "system"
```

Used by frontend to:

- decide UI layout
- choose renderer
- show icons
- apply styling

---

## Field-by-Field Breakdown

### Identity

#### `id: string`

Unique message ID.

Used for:

- key in lists
- replies
- deletion
- scrolling anchors

---

#### `conversationId: string`

Which chat this message belongs to.

One conversation → many messages.

Used for:

- fetching history
- pagination
- real-time subscriptions

---

#### `senderId: string`

Who sent the message.

Used for:

- alignment (left/right)
- avatar
- username
- permissions

---

## Content Layer

### `type: MessageType`

What kind of message.

Example:

```json
"type": "text"
```

---

### `content: string`

Main textual content.

Examples:

```json
"content": "Hello bro"
"content": ""
"content": "Check this out"
```

Even for media messages, this can be:

- caption
- description
- empty

---

## Media Object

Only exists if message contains media.

```ts
Media {
  url: string
  type: FileType
  publicId: string
  width: string
  height: string
  bytes: string
  assetId?: string
}
```

---

### Media Fields Explained

#### `url`

Public CDN URL.

Used directly in:

- `<img>`
- `<video>`
- `<audio>`
- download links

---

#### `type: FileType`

Media type.

```ts
FileType =
  | "image"
  | "video"
  | "audio"
  | "file"
```

Frontend uses this to:

- choose renderer
- show previews
- apply compression rules

---

#### `publicId`

Internal media identifier (Cloudinary / S3).

Used for:

- delete
- replace
- reprocess
- analytics

---

#### `width`, `height`

Dimensions.

Used for:

- aspect ratio
- layout skeletons
- lazy loading
- avoiding layout shift

---

#### `bytes`

File size.

Used for:

- showing size (2.4 MB)
- download warnings
- bandwidth checks

---

#### `assetId` (optional)

Provider-specific internal ID.

Used for:

- debugging
- media pipelines
- re-indexing

---

## Delivery State

These two fields are **pure real-time chat magic**.

### `deliveredTo: string[]`

List of user IDs who received this message.

Used for:

- single tick ✔
- group delivery status
- offline sync

---

### `seenBy: string[]`

List of user IDs who opened the message.

Used for:

- double tick ✔✔
- seen avatars
- read receipts

---

## Deletion

### `isDeleted: boolean`

```json
"isDeleted": true
```

Meaning:

- message is soft-deleted
- content hidden
- UI shows:

> “This message was deleted”

This allows:

- undo
- moderation
- audit logs

---

## Full Example Message

### Text Message

```json
{
  "id": "msg_1",
  "conversationId": "chat_123",
  "senderId": "user_45",
  "type": "text",
  "content": "Hello, how are you?",
  "media": [],
  "deliveredTo": ["user_67"],
  "seenBy": ["user_67"],
  "isDeleted": false,
  "createdAt": "2026-02-05T10:10:00Z",
  "updatedAt": "2026-02-05T10:10:00Z"
}
```

---

### Image Message

```json
{
  "id": "msg_2",
  "conversationId": "chat_123",
  "senderId": "user_45",
  "type": "image",
  "content": "Look at this",
  "media": [
    {
      "url": "https://cdn.app.com/image.webp",
      "type": "image",
      "publicId": "media_999",
      "width": "1080",
      "height": "720",
      "bytes": "245000",
      "assetId": "cloud_abc"
    }
  ],
  "deliveredTo": ["user_67"],
  "seenBy": [],
  "isDeleted": false,
  "createdAt": "2026-02-05T10:12:00Z",
  "updatedAt": "2026-02-05T10:12:00Z"
}
```

---

## UI Features This Schema Supports

This schema enables:

### 1. Message State Tracking

```
deliveredTo.length > 0 → ✔
seenBy.length > 0 → ✔✔
```

---

### 2. Media Gallery

Filter:

```ts
messages.filter((m) => m.media.length > 0);
```

---

### 3. Message Identity

CRUD operation with `message.id`

---

### 4. Infinite Scroll

Sorted by:

```
conversationId + createdAt
```

---

### 5. Delete for Everyone

```
isDeleted = true
```

---

### 6. Seen Avatars (Groups)

```
seenBy.map(user => avatar)
```

---

## Mental Model

Think of messages as:

```
Conversation
 └── Message[]
      ├── Identity (id, sender)
      ├── Content (text, media)
      ├── State (delivered, seen)
      └── Flags (deleted)
```

---

## Product-Level Insight

This schema is **production-grade chat architecture**.

It gives you:

- real-time delivery tracking
- seen receipts
- soft delete
- media handling
- CDN friendly rendering
- scalable message timelines
