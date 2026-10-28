---
id: delete-message
title: Delete Message
---

# Delete Message

Deletes a message from a conversation for all participants, subject to author ownership and time constraints.

## Endpoint

- **Method:** `DELETE`
- **URL:** `/api/v1/message/delete/:messageId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token.
- Senders can delete their message within the 2-hour manipulation time limit.
- Group admins can delete inappropriate messages from other members.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| messageId | string | Yes | The MongoDB ObjectID of the message to delete |

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| conversationId | string | Yes | MongoDB ObjectID | The ID of the conversation where message resides |
| conversationType | string | Yes | `chat` or `group` | Type of conversation |

### Example Request

```json
{
  "conversationId": "69626b5c0f547c9db89e3ceb",
  "conversationType": "group"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "deleted": true,
    "messageId": "6966654d48c8a72251b60b03"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.deleted | boolean | No | Deletion confirmation |
| data.messageId | string | No | Deleted message ID |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid ID or deletion window expired | Show "Message cannot be deleted" notice |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (not the author or not group admin) | Show permission denied dialog |
| 404 | Message not found | Remove message from local feed |
| 500 | Server error | Show deletion failure alert |

```json
{
  "message": "unauthorized to delete message",
  "code": 403,
  "data": {
    "message": "unauthorized to delete message",
    "error": "Forbidden",
    "statusCode": 403
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim message bubble in chat thread and show delete progress icon.
- Empty state: Not applicable.
- Retry behavior: Allow user to retry if network failed.
- Cache invalidation: Render soft-deleted message placeholder ("This message was deleted") or remove from feed according to client UI policy.
- Side effects: Broadcasts deletion event across WebSocket to all room participants and updates conversation preview.
- Related realtime events: `chat.message_deleted`.

## Related Endpoints

- [Send Conversation Message](./send-conversation-message.md)
- [Edit Message](./edit-message.md)
- [Get Messages](./get-messages.md)
