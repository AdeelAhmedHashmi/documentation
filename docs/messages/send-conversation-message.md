---
id: send-conversation-message
title: Send Conversation Message
---

# Send Conversation Message

Pushes a new message directly into an existing private chat or group conversation.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/message/send/:conversationId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. The authenticated user must be an active participant (or non-blocked member) of the designated conversation.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| conversationId | string | Yes | The MongoDB ObjectID of the conversation (chat or group) |

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| content | string | Yes | Non-empty string | Text content or media caption |
| type | string | Yes | `text`, `image`, `video`, `audio`, `gif`, `emoji`, `file`, `system` | Message type |
| conversationType | string | Yes | `chat` or `group` | Scope of the conversation |
| mediaGroupId | string | No | String | Unique UUID for grouping multi-file uploads |
| sequenceIndex | number | No | Integer | Index within grouped media |
| replyTo | string | No | MongoDB ObjectID | Target message ID if replying |
| attachment | object | No | Attachment metadata | `{ publicId, fileType }` |

### Example Request

```json
{
  "content": "Automated integration testing helps catch regressions before deploying.",
  "type": "text",
  "conversationType": "group",
  "replyTo": "6a4e54bb1725ec10e4314538"
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "6a4e54bb1725ec10e4314539",
    "conversationId": "6a4e2c9cc11e524921cb6fc4",
    "conversationType": "group",
    "senderId": "69831b4bc58eff75b4210b8e",
    "content": "Automated integration testing helps catch regressions before deploying.",
    "type": "text",
    "replyTo": "6a4e54bb1725ec10e4314538",
    "createdAt": "2026-02-04T12:40:00.000Z",
    "updatedAt": "2026-02-04T12:40:00.000Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | New message ID |
| data.conversationId | string | No | Conversation ID |
| data.conversationType | string | No | `chat` or `group` |
| data.senderId | string | No | Sender user ID |
| data.content | string | No | Message text |
| data.type | string | No | Message type |
| data.replyTo | string | Yes | Replied message ID |
| data.createdAt | string | No | Sent timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload or conversationId | Validate input formatting |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (user is blocked or not in group) | Display "You are not a member of this conversation" |
| 404 | Conversation not found | Return to chat list |
| 500 | Server error | Mark message as failed with retry action |

```json
{
  "message": "user is not a participant in this conversation",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Optimistically render message with single checkmark (pending ack).
- Empty state: Not applicable.
- Retry behavior: Allow resend from chat input queue on failure.
- Cache invalidation: Update conversation's `lastMessage` and increment read receipts.
- Side effects: Broadcasts message via WebSocket gateway room (`chat:<id>` or `group:<id>`) and triggers push notifications.
- Related realtime events: `chat.message_received`.

## Related Endpoints

- [Send Direct Message](./send-direct-message.md)
- [Get Messages](./get-messages.md)
- [Edit Message](./edit-message.md)
- [Delete Message](./delete-message.md)
