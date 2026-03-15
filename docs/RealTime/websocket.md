---
id: socket-events
title: WebSocket Events
---

# WebSocket Events

This document lists all WebSocket events currently used by the server, with simple request/response payloads.

---

## Client → Server Events

1. `ping`
   - **Purpose**: Health check / keep-alive.
   - **Request Payload**: none
   - **Response Event**: `pong`

1. `heartbeat`
   - **Purpose**: Update server-side presence for the connected user/device.
   - **Request Payload**: none
   - **Response Event**: none (presence changes are broadcast separately via `presence:change`)

1. `chat:subscribe`
   - **Purpose**: Subscribe the current socket to a conversation for real-time updates.
   - **Request Payload**:
     - `conversationId` string
   - **Response Event**: `chat:subscribe:success` or `chat:subscribe:error`

1. `chat:unsubscribe`
   - **Purpose**: Unsubscribe the current socket from a conversation.
   - **Request Payload**:
     - `conversationId` string
   - **Response Event**: none

1. `typing:start`
   - **Purpose**: Notify others that the user started typing in a conversation.
   - **Request Payload**:
     - `conversationId` string
     - `type` string (example values: `"chat"`, `"group"`)
   - **Response Event**: `typing:start` broadcast to other members, or `typing:error` on validation failure

1. `typing:stop`
   - **Purpose**: Notify others that the user stopped typing in a conversation.
   - **Request Payload**:
     - `conversationId` string
     - `type` string (example values: `"chat"`, `"group"`)
   - **Response Event**: `typing:stop` broadcast to other members, or `typing:error` on validation failure

1. `message:delivered`
   - **Purpose**: Acknowledge that messages were delivered to this user.
   - **Request Payload**:
     - `conversationId` string
     - `messageIds` array of strings
   - **Response Event**: `message:success` to the sender device, and `message:delivered` to the original senders

1. `message:seen`
   - **Purpose**: Acknowledge that messages were seen by this user.
   - **Request Payload**:
     - `conversationId` string
     - `messageIds` array of strings
   - **Response Event**: `message:success` to the sender device, and `message:seen` to the original senders

---

## Server → Client Events

1. `pong`
   - **Purpose**: Response to `ping`.
   - **Response Payload**:
     - `pong` string (always `"pong"`)

1. `user:online`
   - **Purpose**: Confirms the socket is connected and registered on the server.
   - **Response Payload**:
     - `rooms` string (serialized list of rooms)

1. `chat:subscribe:success`
   - **Purpose**: Confirms the socket subscribed successfully.
   - **Response Payload**:
     - `message` string
     - `conversationId` string

1. `chat:subscribe:error`
   - **Purpose**: Indicates subscription failed.
   - **Response Payload**:
     - `message` string
     - `conversationId` string (may be empty when invalid payload)

1. `typing:start`
   - **Purpose**: Broadcast that a user started typing.
   - **Response Payload**:
     - `conversationId` string
     - `type` string (example values: `"chat"`, `"group"`)
     - `userId` string

1. `typing:stop`
   - **Purpose**: Broadcast that a user stopped typing.
   - **Response Payload**:
     - `conversationId` string
     - `type` string (example values: `"chat"`, `"group"`)
     - `userId` string

1. `typing:error`
   - **Purpose**: Validation error for typing events.
   - **Response Payload**:
     - `message` string

1. `message:new`
   - **Purpose**: Deliver a new message notification to other participants.
   - **Response Payload**:
     - `conversationId` string
     - `senderId` string
     - `messageId` string
     - `content` string

1. `message:delivered`
   - **Purpose**: Inform senders that their messages were delivered.
   - **Response Payload**:
     - `messageIds` array of strings
     - `deliveredBy` string (user id)

1. `message:seen`
   - **Purpose**: Inform senders that their messages were seen.
   - **Response Payload**:
     - `messageIds` array of strings
     - `seenBy` string (user id)

1. `message:success`
   - **Purpose**: Acknowledge that the server processed `message:delivered` or `message:seen`.
   - **Response Payload**:
     - `messageIds` array of strings

1. `message:error`
   - **Purpose**: Validation error for message status events.
   - **Response Payload**:
     - `message` string
     - `data` any (may be empty)

1. `group:notification`
   - **Purpose**: Notify users about group-related actions and changes.
   - **Response Payload**:
     - `type` string (examples: `"USER_JOINED"`, `"USER_LEFT"`, `"USER_ONLINE"`, `"USER_OFFLINE"`, `"ADMIN_ADDED"`, `"ADMIN_REMOVED"`, `"USER_BLOCKED"`)
     - `body` object
       - `message` string
       - `timestamp` ISO string
       - `data` any (optional)

1. `contact:sync`
   - **Purpose**: Notify a device when contact sync completes.
   - **Response Payload**:
     - `code` string (example: `"CONTACT_SYNCED"`)
     - `data` object
       - `trackingId` string

1. `presence:change`
   - **Purpose**: Broadcast presence updates to subscribers.
   - **Response Payload**:
     - `userId` string
     - `state` string (example values: `"online"`, `"offline"`)

---

## Multi‑Directional Events

These event names are both received and emitted by the server:

1. `typing:start`
1. `typing:stop`
1. `message:delivered`
1. `message:seen`
