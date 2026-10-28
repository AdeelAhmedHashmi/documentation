---
id: get-messages
title: Get Messages
---

# Get Messages

Retrieves timeline messages from a private chat or group conversation using timeline cursor-based pagination.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/message/:conversationId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The caller must be an authorized participant or member of the conversation.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| conversationId | string | Yes | The MongoDB ObjectID of the target chat or group |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| limit | integer | No | `40` | Maximum messages per page |
| days | integer | No | `3` | Time window in days for message slicing |
| before | string | No | None | ISO Date string cursor to load messages prior to this timestamp |

### Request Body

None.

### Example Request

```http
GET /api/v1/message/69c7d35787cffb9d268bb8a3?limit=30&before=2026-02-04T12:00:00.000Z HTTP/1.1
Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "messages": [
      {
        "id": "69ca51c0fb5781f2bd4e6a66",
        "conversationId": "69c7d35787cffb9d268bb8a3",
        "sender": {
          "id": "69831b4bc58eff75b4210b8e",
          "firstName": "Adeel",
          "lastName": "Ahmed",
          "avatar": {
            "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/avatar.webp"
          }
        },
        "type": "text",
        "visibility": "all",
        "content": "Hello team, let us review the deployment checklist.",
        "isDeleted": false,
        "isPinned": false,
        "forwardCount": 0,
        "reactions": {
          "counts": {
            "👍": 3,
            "🚀": 2
          },
          "userReactions": ["👍"],
          "total": 5
        },
        "createdAt": "2026-02-04T11:45:00.000Z",
        "updatedAt": "2026-02-04T11:45:00.000Z"
      }
    ],
    "nextCursor": "2026-02-04T11:45:00.000Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.messages | array | No | Chronological list of message objects |
| data.messages[].id | string | No | Message identifier |
| data.messages[].conversationId | string | No | Associated conversation ID |
| data.messages[].sender | object | No | Sender user profile object |
| data.messages[].type | string | No | Message type (`text`, `image`, etc.) |
| data.messages[].visibility | string | No | Visibility level (`all` or `admins`) |
| data.messages[].content | string | No | Message body text |
| data.messages[].isDeleted | boolean | No | Soft-delete state |
| data.messages[].isPinned | boolean | No | Pinned state |
| data.messages[].reactions | object | Yes | Emoji reaction summary counts |
| data.messages[].createdAt | string | No | Sent timestamp ISO string |
| data.nextCursor | string | Yes | ISO timestamp cursor for previous page, or `null` if start of chat |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden / Not a conversation member | Display permission denied alert |
| 404 | Conversation not found | Return to conversations feed |
| 500 | Server error | Show timeline load failure |

```json
{
  "message": "conversation not found",
  "code": 404,
  "data": {
    "message": "conversation not found",
    "error": "Not Found",
    "statusCode": 404
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display inverted scroll loader when user scrolls up to load older messages.
- Empty state: Show "No messages yet. Send the first message below!".
- Retry behavior: Re-query the current page if network fails during scroll.
- Cache invalidation: Append newly received messages at bottom from real-time events.
- Side effects: None.
- Related realtime events: `chat.message_received`, `chat.reaction_updated`.

## Related Endpoints

- [Send Conversation Message](./send-conversation-message.md)
- [Get Message Info](./get-message-info.md)
- [Edit Message](./edit-message.md)
- [Delete Message](./delete-message.md)
