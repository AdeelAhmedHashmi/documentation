---
id: delete-thread-message
title: Delete Thread Message
---

# Delete Thread Message

Deletes a comment or reply within a discussion thread, permitted only to the message's original author.

## Endpoint

- **Method:** `DELETE`
- **URL:** `/api/v1/thread/message/:threadId/:messageId`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- Only the user who sent the message can delete it.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| threadId | string | Yes | Unique 24-character hex MongoDB ObjectId of the thread. |
| messageId | string | Yes | Unique 24-character hex MongoDB ObjectId of the message/reply to delete. |

### Example Request

```http
DELETE /api/v1/thread/message/671e3d5b8f1a2c3d4e5f6a7b/671e3df08f1a2c3d4e5f6aa1 HTTP/1.1
Host: api.suffa.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource deleted successfully",
  "data": {
    "acknowledged": true,
    "deletedCount": 1
  },
  "timestamp": "2026-10-28T00:34:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.acknowledged | boolean | No | MongoDB acknowledgment of delete execution. |
| data.deletedCount | integer | No | Total count of deleted message records (`1` on success). |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid ID parameter | Verify IDs before requesting. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | User is not the author of this message. |
| 404 | Message not found | Inform user that message was already deleted. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "Message not found or unauthorized",
  "code": 403,
  "cause": "Forbidden",
  "timestamp": "2026-10-28T00:34:00.180Z"
}
```

## Frontend Notes

- Loading state: Show deleting animation on the specific message item.
- Empty state: N/A.
- Retry behavior: Safe to retry.
- Cache invalidation: Remove the message from the thread tree or mark it as deleted with tombstone text if it has children.
- Side effects: Decrements parent message and thread reply counters.
- Related realtime events: `thread.message.deleted`.

## Related Endpoints

- [Post Thread Message or Reply](./create-thread-message.md)
- [Get Thread Root Messages](./get-thread-root-messages.md)
- [Get Thread Direct Replies](./get-thread-replies.md)
