---
id: fetch-messages
title: Fetch Messages
---

# Fetch Messages

Retrieve messages for a conversation using timeline cursor pagination.

---

## Endpoint

`GET /message/:conversationId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `conversationId` Conversation id (string)

**Query Parameters**:

- `limit` Required string. Parsed with `Number(limit)` in the controller (falls back to `40` if falsy or non-numeric).
- `days` Optional string. Parsed with `Number(days)` (falls back to `3` if falsy or non-numeric).
- `before` Optional string (date). If provided, converted with `new Date(before)` and used as an upper bound for `createdAt`.

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/message/67d0f84f0a4f4f49f2a4c111?limit=20&days=3&before=2026-03-09T10:31:10.000Z" \
  -H "Authorization: Bearer {{token}}"
```

---

## Response 200 OK

> **note:** this response contain in general message. where all fields are shown!

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "messages": [
      {
        "_id": "67d0f84f0a4f4f49f2a4c222",
        "conversationId": "67d0f84f0a4f4f49f2a4c111",
        "senderId": {
          "_id": "67d0f84f0a4f4f49f2a4c333",
          "username": "alice",
          "avatar": {
            "_id": "67d0f84f0a4f4f49f2a4c444",
            "url": "https://cdn.example.com/avatar-alice.jpg",
            "storageKey": "avatars/67d0f84f0a4f4f49f2a4c333.jpg"
          }
        },
        "type": "text",
        "content": "Hello there",
        "attachment": {
          "id": "67d0f84f0a4f4f49f2a4c333",
          "storageKey": "message_media/abc123",
          "url": "https://res.cloudinary.com/demo/image/upload/v1/message_media/abc123.jpg",
          "type": "image",
          "ownerType": "message",
          "provider": "CLOUDINARY",
          "blurHash": "LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
          "width": 1920,
          "height": 1080,
          "size": 348120
        ,
        "replyTo": {
          "content": "hi this is a test message!",
          "senderName": "adeelahmed",
          "type": "text"
        },
        "mediaGroupId": "id.1234",
        "sequenceIndex": 2,
        "isDeleted": true,
        "deletedAt": "2026-03-09T10:30:00.000Z",
        "editedAt": "2026-03-09T10:30:00.000Z",
        "evet": "join_request",
        "metaData": {
          "targetId": "8861c8212a39a02670c99"
        },
        "actorId": "8861c8212a39a02670c99",
        "isPinned": false,
        "forwardCount": 0,
        "forwardMeta": {
          "originalMessageId": "69b6cf48c9905ebcfe5156b6",
          "originalConversationId": "69b5748861c8212a3189cb16",
          "originalSenderId": "69a026700812dd821414f341",
        },
        "createdAt": "2026-03-09T10:30:00.000Z",
        "updatedAt": "2026-03-09T10:30:00.000Z",
        "reactions": {
          "counts": {
            "😒": 17,
            "😡": 12,
            "👍": 2,
          },
          "userReactions": [
            "👍"
          ],
          "total": 2
        }
      }
    ],
    "nextCursor": "2026-03-09T10:30:00.000Z"
  },
  "timestamp": "2026-03-09T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard` (`@UserParam()` indicates the route always receives the authenticated user).
- Authorization is checked against chat membership first; if not authorized, the service checks group membership. If neither matches, a `404` is thrown (`conversation not found!`).
- Messages are sorted by `createdAt` descending (newest first).
- `nextCursor` is the `createdAt` timestamp of the last message in the current page, or `null` if no messages are returned.
- `senderId` is populated with `username` and `avatar` (and nested `avatar.url` and `avatar.storageKey`).
- `attachment` is populated when present.
- Each message includes a `reactions` summary: `counts`, `userReactions`, and `total`.
- Unknown query fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).
- `event` and `actorId` only contains in case of message type `system`
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `400 Bad Request`
  - Invalid `conversationId`
  - Missing or empty `limit` (required by `TimelineCursorPaginationDto`)
- `401 Unauthorized`
  - Missing or malformed `Authorization` header
  - Invalid/expired token
  - Suspended, inactive, or untrusted device (see `AuthGuard` checks)
- `404 Not Found`
  - Conversation not found or user not authorized to view it
- `500 Internal Server Error`
  - Database query failure in `MessageRepository`
  - Any other unexpected server-side failure
