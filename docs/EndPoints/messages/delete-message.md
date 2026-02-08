---
id: delete-message
title: Delete Message
---

# Delete Message

Delete a previously sent message. This endpoint validates the requester, ensures they are part of the conversation, and only allows deletion when the message meets the deletion rules (ownership and time window).

---

## Endpoint

`DELETE /message/delete/:messageId`

**Headers**:

- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `messageId` � Target message id (MongoId).

**Request Body**:

```json
{
  "conversationId": "<conversationId>",
  "conversationType": "group"
}
```

- `conversationId` � Required. Conversation id (MongoId).
- `conversationType` � Required. Conversation type. Allowed values: `chat`, `group`.

---

## Example cURL Request

```bash
curl -X DELETE "{{baseUrl}}/message/delete/{{messageId}}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "conversationId": "<conversationId>",
    "conversationType": "group"
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
    "conversationId": "<conversationId>",
    "senderId": "<senderId>",
    "isDeleted": true,
    "createdAt": "2026-02-06T12:37:51.523Z",
    "updatedAt": "2026-02-06T12:45:00.000Z"
  },
  "timestamp": "2026-02-07T00:00:00.000Z"
}
```

---

## Deletion Rules (How It Decides)

This endpoint enforces multiple conditions before a message can be deleted:

1. **Valid identifiers**
   - `messageId` and the authenticated `userId` must be valid MongoIds.
   - `conversationId` must be valid and `conversationType` must be `chat` or `group`.

2. **Conversation authorization**
   - The requester must be a participant in the conversation.
   - For private chats, the user must be a chat participant.
   - For groups, the user must be a member of the group.

3. **Ownership**
   - Only the original sender of the message can delete it.

4. **Time window**
   - The message can only be deleted within the allowed window (2 hours from creation time).

If any of these checks fail, the deletion is rejected.

---

## Notes

- Authentication is required. Requests without a valid token are rejected.
- Deletion is a **soft delete** (the message is marked as deleted).
- A valid `conversationType` is required even though this is a delete-by-id endpoint.
- If the message is too old, deletion will be denied.
- If the user is not the sender, deletion will be denied.
- Some clients and proxies do not support bodies in `DELETE` requests; ensure your client allows it.

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
- `409 Conflict`
  - Deletion not allowed (not sender or message older than deletion window)
