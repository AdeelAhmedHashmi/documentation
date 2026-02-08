---
id: get-messages
title: Get Messages
---

# Get Messages

Fetch messages from a conversation using cursor-based pagination. This endpoint returns the most recent messages first and provides a cursor to continue loading older messages.

---

## Endpoint

`GET /message/:conversationId`

**Headers**:

- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `conversationId` � Conversation id (MongoId).

**Query Parameters**:

- `limit` � Required. Max number of messages to return. Default behavior (if omitted) is 40, but the DTO expects it.
- `days` � Optional. Only return messages from the last N days. Default: `3`.
- `before` � Optional. Cursor timestamp (ISO string). Fetch messages created **before** this timestamp.

Example:

`GET /message/<conversationId>?limit=20&days=7&before=2026-02-01T12:00:00.000Z`

---

## Pagination Style (Cursor)

This endpoint uses **cursor-based pagination** with a `before` timestamp.

- The response includes `nextCursor` which is the `createdAt` of the **oldest message** in the current page.
- To load older messages, pass `before={{nextCursor}}` in the next request.
- Messages are returned in **descending** order by `createdAt` (latest first).
- The `days` filter applies **before** the cursor filter and limits the overall time window.

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/message/{{conversationId}}?limit=10&days=3" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}"
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "messages": [
      {
        "_id": "<messageId>",
        "conversationId": "<conversationId>",
        "senderId": "<senderId>",
        "type": "text",
        "content": "Hello",
        "media": [],
        "isDeleted": false,
        "createdAt": "2026-02-06T12:37:51.523Z",
        "updatedAt": "2026-02-06T12:37:51.523Z"
      }
    ],
    "nextCursor": "2026-02-06T12:37:51.523Z"
  },
  "timestamp": "2026-02-07T00:00:00.000Z"
}
```

---

## Notes

- Authentication is required. Requests without a valid token are rejected.
- The requester must be a member of the chat or group conversation.
- `limit` should be a positive number; the system defaults to 40 when not provided.
- `days` defaults to 3 if omitted.
- `before` must be a valid date string (ISO recommended).
- Only message metadata is returned; delivery/read info is not included here.

---

## Error Cases

- `400 Bad Request`
  - Invalid `conversationId`
  - Invalid query values
- `401 Unauthorized`
  - Missing or invalid token
  - Suspended or inactive account
  - Untrusted device
- `404 Not Found`
  - Conversation not found or user not authorized
