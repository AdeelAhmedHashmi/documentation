---
id: get-message-info
title: Get Message Info
---

# Get Message Info

Retrieves delivery receipts, read statuses, and delivery timestamps for a specific sent message.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/message/info/:messageId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The caller must be the sender of the message or an authorized participant in the conversation.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| messageId | string | Yes | The MongoDB ObjectID of the target message |

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| conversationId | string | Yes | MongoDB ObjectID | Associated conversation ID |
| conversationType | string | Yes | `chat` or `group` | Type of conversation |

### Example Request

```json
{
  "conversationId": "6963bd26d87a5f697cc57bc0",
  "conversationType": "chat"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "messageId": "6963bda0d87a5f697cc57bd0",
    "deliveryStatus": "read",
    "deliveredAt": "2026-02-04T12:35:10.000Z",
    "readAt": "2026-02-04T12:36:02.000Z",
    "readers": [
      {
        "userId": "69a026700812dd821414f341",
        "readAt": "2026-02-04T12:36:02.000Z"
      }
    ]
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.messageId | string | No | Message identifier |
| data.deliveryStatus | string | No | Aggregate status: `sent`, `delivered`, or `read` |
| data.deliveredAt | string | Yes | Timestamp when delivered to recipient device |
| data.readAt | string | Yes | Timestamp when opened/read by recipient |
| data.readers | array | No | List of recipients who have read the message |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid messageId or conversationId | Check parameter formats |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden | Show unauthorized error |
| 404 | Message not found | Show "Message not found" notice |
| 500 | Server error | Show retry alert |

```json
{
  "message": "message not found",
  "code": 404,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render bottom-sheet modal skeleton with delivery & read tabs.
- Empty state: Show "Delivered to server" when not yet received by peer.
- Retry behavior: Allow re-opening modal to re-fetch receipts.
- Cache invalidation: Update read receipt icon dynamically in the timeline if a read event is received over WebSocket.
- Side effects: None.
- Related realtime events: `chat.message_read`.

## Related Endpoints

- [Get Messages](./get-messages.md)
- [Send Conversation Message](./send-conversation-message.md)
