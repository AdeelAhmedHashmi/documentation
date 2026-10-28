---
id: send-direct-message
title: Send Direct Message
---

# Send Direct Message

Sends a direct message to a user by their user ID, creating a new 1-on-1 conversation automatically if one does not already exist.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/message/send/:receiverId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. Cannot send messages to oneself or to users who have blocked the caller.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| receiverId | string | Yes | The recipient user's MongoDB ObjectID |

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| content | string | Yes | Non-empty string | Text content or caption of the message |
| type | string | Yes | `text`, `image`, `video`, `audio`, `gif`, `emoji`, `file`, `system` | Category of message |
| mediaGroupId | string | No | String | Correlates grouped multi-media uploads |
| sequenceIndex | number | No | Number | Order index when sending grouped media items |
| replyTo | string | No | MongoDB ObjectID | Message ID of the message being quoted/replied to |
| attachment | object | No | Media attachment object | Details of uploaded media (`publicId`, `fileType`) |

### Example Request

```json
{
  "content": "Assalam o Alaikum! Are you available for a brief catch-up?",
  "type": "text",
  "mediaGroupId": "uuid_group_123",
  "sequenceIndex": 0
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "6a4e54bb1725ec10e4314538",
    "conversationId": "6a4e2c9cc11e524921cb6fc4",
    "conversationType": "chat",
    "senderId": "69831b4bc58eff75b4210b8e",
    "content": "Assalam o Alaikum! Are you available for a brief catch-up?",
    "type": "text",
    "mediaGroupId": "uuid_group_123",
    "sequenceIndex": 0,
    "replyTo": null,
    "attachment": null,
    "createdAt": "2026-02-04T12:35:00.000Z",
    "updatedAt": "2026-02-04T12:35:00.000Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | Created message ID |
| data.conversationId | string | No | The ID of the private chat room |
| data.conversationType | string | No | Type of conversation (`chat`) |
| data.senderId | string | No | The sender's user ID |
| data.content | string | No | Text body |
| data.type | string | No | Message type |
| data.createdAt | string | No | Sent timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload or attempting to message oneself | Show validation message |
| 401 | Unauthenticated | Redirect to login |
| 403 | Blocked by user or account suspended | Show blocking notice |
| 404 | Recipient user not found | Show "User not found" error |
| 500 | Server error | Show send failure indicator with retry button |

```json
{
  "message": "cannot send message to blocked or inactive user",
  "code": 403,
  "data": {
    "message": "cannot send message to blocked or inactive user",
    "error": "Forbidden",
    "statusCode": 403
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Optimistically render message in chat feed with an unconfirmed "sending" clock icon.
- Empty state: Not applicable.
- Retry behavior: If network drops, mark message as failed and offer a "Tap to retry" action.
- Cache invalidation: Update conversation's `lastMessage` and reposition chat to top of chat list.
- Side effects: Enqueues push notification to recipient's devices via BullMQ and emits WebSocket event.
- Related realtime events: `chat.message_received`.

## Related Endpoints

- [Send Conversation Message](./send-conversation-message.md)
- [Get Messages](./get-messages.md)
- [Forward Message](./forward-message.md)
