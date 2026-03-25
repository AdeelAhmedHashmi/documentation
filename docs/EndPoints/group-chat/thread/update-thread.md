---
id: patch-thread
title: Update Thread
---

# Update Thread

Update an existing thread by `threadId`.

---

## Endpoint

`PATCH /thread/:threadId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `threadId` is required and must be a valid MongoDB ObjectId string.

**Body**:

```json
{
  "title": "Ghost Thread",
  "content": "image if its really updated thread"
}
```

**Field Rules**:

- Only `title` and `content` are accepted.
- `title` is optional and must be a string if provided.
- `content` is optional and must be a string if provided.
- `conversationId` and `attachments` are not allowed in this endpoint DTO.
- Unknown body fields are rejected by global validation (`ValidationPipe` with `whitelist` + `forbidNonWhitelisted`).

---

## Example cURL Request

```bash
curl -X PATCH "{{baseUrl}}/thread/{{threadId}}" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "image if its really updated thread",
    "title": "Ghost Thread"
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "acknowledged": true,
    "matchedCount": 1,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0
  },
  "timestamp": "2026-03-25T10:30:10.000Z"
}
```

---

## Notes

- Authentication is enforced globally via `AuthGuard` (`APP_GUARD`).
- Update is owner-based: only the thread author can update (`author = authenticated user`).
- Soft-deleted threads are not updated (`isDeleted: false` filter).
- On every update call, backend also sets:
  - `lastActivityAt = new Date()`
  - `isEdited = true`
- Endpoint returns MongoDB update result, not the updated thread document.
- If no thread matches (`wrong threadId`, not author, or deleted), request still returns `200` with `matchedCount: 0`.

---

## Error Cases

- `400 Bad Request` - Invalid `threadId`, invalid body value types, or unknown body fields.
- `401 Unauthorized` - Missing/invalid/expired token, suspended/inactive user, or untrusted device.
- `500 Internal Server Error` - Unexpected server-side failure.
