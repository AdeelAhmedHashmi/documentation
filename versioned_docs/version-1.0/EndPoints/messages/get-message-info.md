---
id: message-info
title: Message Info
---

# Message Info

Fetch delivery and read status details for a specific message in a conversation. This endpoint validates the requester, verifies access to the conversation, and returns delivery/read metadata for the target message.

---

## Endpoint

`GET /message/info/:messageId`

**Headers**:

- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `messageId` Target message id (MongoId).

**Request Body**:

```json
{
  "conversationId": "<conversationId>",
  "conversationType": "chat"
}
```

- `conversationId` Required. Conversation id (MongoId).
- `conversationType` Required. Conversation type. Allowed values: `chat`, `group`.

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/message/info/{{messageId}}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "conversationId": "<conversationId>",
    "conversationType": "chat"
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "<messageId>",
    "deliveredTo": [
      {
        "_id": "<userId>",
        "username": "<username>",
        "profilePicture": "<url or object>"
      }
    ],
    "seenBy": [
      {
        "_id": "<userId>",
        "username": "<username>",
        "profilePicture": "<url or object>"
      }
    ]
  },
  "timestamp": "2026-02-07T00:00:00.000Z"
}
```

---

## Notes

- Authentication is required. Requests without a valid token are rejected.
- `messageId` and `conversationId` must be valid MongoIds.
- `conversationType` must be `chat` or `group`.
- Only participants in the conversation can access message info.
- The response only includes delivery/read metadata, not the full message content.
- Some clients and proxies do not support bodies in `GET` requests; ensure your client allows it.

---

## Error Cases

- `400 Bad Request`
  - Invalid `messageId` or `conversationId`
  - Invalid `conversationType`
  - Missing required fields
- `401 Unauthorized`
  - Missing or invalid token
  - Suspended or inactive account
  - Untrusted device
- `403 Forbidden`
  - User is not authorized to access the conversation
- `404 Not Found`
  - Conversation not found
