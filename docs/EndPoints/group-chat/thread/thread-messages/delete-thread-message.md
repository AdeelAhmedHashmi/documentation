---
id: delete-thread-message
title: Delete Thread Message
---

# Delete Thread Message

Delete a single thread message authored by the authenticated user.

---

## Endpoint

`DELETE /thread/message/:threadId/:messageId`

Note: The implemented route is singular `message` (not `messages`).

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `threadId` is required and must be a valid MongoDB ObjectId string.
- `messageId` is required and must be a non-empty string.

---

## Example cURL Request

```bash
curl -X DELETE "{{baseUrl}}/thread/message/{{threadId}}/{{messageId}}" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json"
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "acknowledged": true,
    "deletedCount": 1
  },
  "timestamp": "2026-03-25T10:30:10.000Z"
}
```

If no matching message is found (wrong `threadId`, wrong `messageId`, or not authored by requester), it still returns `200` with:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "acknowledged": true,
    "deletedCount": 0
  },
  "timestamp": "2026-03-25T10:30:10.000Z"
}
```

---

## Notes

- Authentication is enforced globally via `AuthGuard` (`APP_GUARD`).
- Deletion filter is:
  - `threadId` (from route param)
  - `sender` = authenticated user
  - `_id` = `messageId`
- Endpoint performs hard delete (`deleteOne`) for the message.
- Global response interceptor wraps payload as `success`, `message`, `data`, and `timestamp`.
- Current implementation does not explicitly check thread/group membership before delete in this handler.

---

## Error Cases

- `400 Bad Request` - Invalid `threadId` format, unknown params.
- `401 Unauthorized` - Missing/invalid/expired token, suspended/inactive user, or untrusted device.
- `500 Internal Server Error` - Unexpected server-side failure (for example invalid `messageId` casting at DB layer).
