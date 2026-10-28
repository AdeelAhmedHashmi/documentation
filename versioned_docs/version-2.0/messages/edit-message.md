---
id: edit-message
title: Edit Message
---

# Edit Message

Edits the text content of a previously sent message within the allowed manipulation time window.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/message/edit/:conversationId/:messageId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token.
- Only the original author (`senderId`) can edit their message.
- Edits are permitted strictly within **2 hours** (`MESSAGE_MANIPULATION_AVAILABLE_TIME = 2 * 60 * 60 * 1000`) of original dispatch.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| conversationId | string | Yes | The MongoDB ObjectID of the conversation |
| messageId | string | Yes | The MongoDB ObjectID of the message to edit |

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| content | string | Yes | Non-empty string | The revised text content |

### Example Request

```json
{
  "content": "This message has been revised with updated meeting links."
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "69ca51c0fb5781f2bd4e6a66",
    "conversationId": "69c7d35787cffb9d268bb8a3",
    "senderId": "69831b4bc58eff75b4210b8e",
    "content": "This message has been revised with updated meeting links.",
    "isEdited": true,
    "updatedAt": "2026-02-04T12:50:00.000Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | Message identifier |
| data.conversationId | string | No | Associated conversation ID |
| data.senderId | string | No | Author user ID |
| data.content | string | No | Updated text content |
| data.isEdited | boolean | No | Flags that message was modified |
| data.updatedAt | string | No | Edit timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload or edit time window expired (over 2 hours) | Show "Messages cannot be edited after 2 hours" |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (not the sender of the message) | Show "You cannot edit someone else's message" |
| 404 | Message or conversation not found | Show "Message not found" notice |
| 500 | Server error | Show edit failure alert |

```json
{
  "message": "message edit time expired",
  "code": 400,
  "data": {
    "message": "message edit time expired",
    "error": "Bad Request",
    "statusCode": 400
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display inline edit spinner and disable send icon.
- Empty state: Keep original content in the input field when edit mode is triggered.
- Retry behavior: Allow user to retry if network failed.
- Cache invalidation: Mutate message content in the local timeline list and display "(edited)" badge.
- Side effects: Emits an edit event to all conversation room members via WebSockets.
- Related realtime events: `chat.message_edited`.

## Related Endpoints

- [Send Conversation Message](./send-conversation-message.md)
- [Delete Message](./delete-message.md)
- [Get Messages](./get-messages.md)
