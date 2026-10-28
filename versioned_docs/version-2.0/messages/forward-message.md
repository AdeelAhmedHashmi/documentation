---
id: forward-message
title: Forward Message
---

# Forward Message

Forwards an existing message to one or more selected conversation destinations (up to 10 chats or groups concurrently).

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/message/forward/:messageId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The authenticated user must be a member or participant in every destination conversation.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| messageId | string | Yes | The MongoDB ObjectID of the source message being forwarded |

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| conversations | array | Yes | 1–10 items | Destination conversation objects |
| conversations[].id | string | Yes | MongoDB ObjectID | Target chat or group ID |
| conversations[].type | string | Yes | `chat` or `group` | Type of target conversation |

### Example Request

```json
{
  "conversations": [
    {
      "id": "69a336ce53a5ac1c18f556c8",
      "type": "chat"
    },
    {
      "id": "69b5748861c8212a3189cb16",
      "type": "group"
    }
  ]
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": [
    {
      "_id": "69ca51c0fb5781f2bd4e6b01",
      "conversationId": "69a336ce53a5ac1c18f556c8",
      "conversationType": "chat",
      "senderId": "69831b4bc58eff75b4210b8e",
      "content": "Check this update!",
      "type": "text",
      "forwardCount": 1,
      "forwardMeta": {
        "isForwarded": true,
        "originalSenderId": "6974c63b9de8b4da9b4b401b"
      },
      "createdAt": "2026-02-04T12:55:00.000Z"
    },
    {
      "_id": "69ca51c0fb5781f2bd4e6b02",
      "conversationId": "69b5748861c8212a3189cb16",
      "conversationType": "group",
      "senderId": "69831b4bc58eff75b4210b8e",
      "content": "Check this update!",
      "type": "text",
      "forwardCount": 1,
      "forwardMeta": {
        "isForwarded": true,
        "originalSenderId": "6974c63b9de8b4da9b4b401b"
      },
      "createdAt": "2026-02-04T12:55:00.000Z"
    }
  ],
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data | array | No | Array of newly generated forwarded message records |
| data[]._id | string | No | Generated message ID |
| data[].conversationId | string | No | Destination conversation ID |
| data[].forwardMeta.isForwarded | boolean | No | Always `true` for forwarded messages |
| data[].forwardMeta.originalSenderId | string | Yes | The original author of the forwarded text |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | More than 10 destinations or invalid parameters | Show "You can only forward to up to 10 chats at a time" |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (blocked or not a member in target conversation) | Show permission error for target chat |
| 404 | Source message not found | Show "Original message not found" |
| 500 | Server error | Show forwarding error alert |

```json
{
  "message": [
    "conversations must not have more than 10 elements"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display modal spinner over conversation picker with "Forwarding message...".
- Empty state: Not applicable.
- Retry behavior: Allow user to retry if forwarding was interrupted.
- Cache invalidation: Prepend forwarded message to recent timelines of destination chats.
- Side effects: Increments `forwardCount` on original message and emits new message WebSocket events to all destination rooms.
- Related realtime events: `chat.message_received`.

## Related Endpoints

- [Send Direct Message](./send-direct-message.md)
- [Send Conversation Message](./send-conversation-message.md)
- [Get Messages](./get-messages.md)
