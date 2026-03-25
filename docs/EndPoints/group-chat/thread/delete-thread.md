---
id: delete-thread
title: Delete Thread
---

# Delete Thread

Delete a thread using either soft delete or hard delete.

---

## Endpoint 1 (Soft Delete)

`DELETE /thread/:threadId/delete/soft`

Soft delete marks the thread as deleted instead of removing it from the database.

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `threadId` is required and must be a valid MongoDB ObjectId string.

---

## Example cURL Request (Soft Delete)

```bash
curl -X DELETE "{{baseUrl}}/thread/{{threadId}}/delete/soft" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json"
```

---

## Response 200 OK (Soft Delete)

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

Soft-delete update sets:

- `isDeleted = true`
- `deletedAt = current time`
- `lastActivityAt = current time`

---

## Endpoint 2 (Hard Delete)

`DELETE /thread/:threadId/delete/hard`

Hard delete permanently removes the thread document.

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `threadId` is required and must be a valid MongoDB ObjectId string.

---

## Example cURL Request (Hard Delete)

```bash
curl -X DELETE "{{baseUrl}}/thread/{{threadId}}/delete/hard" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json"
```

---

## Response 200 OK (Hard Delete)

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

---

## Notes

- Authentication is enforced globally via `AuthGuard` (`APP_GUARD`).
- Global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.
- For both endpoints, deletion operation is author-bound (`author = authenticated user`) at repository level.
- Soft delete flow:
  - Looks up thread with filters: `isDeleted: false`, `isHidden: false`, `isLocked: false`.
  - Verifies requester has access to thread group (`groupService.getGroup(...)`).
  - Then performs update-based delete.
- Hard delete flow:
  - Finds thread by `_id` + `author` first.
  - Does not run group membership check in service.
  - Permanently deletes document with `deleteOne`.
- Both endpoints return MongoDB operation result, not the full thread document.

---

## Error Cases

- `400 Bad Request` - Invalid `threadId` format.
- `401 Unauthorized` - Missing/invalid/expired token, suspended/inactive user, or untrusted device.
- `409 Conflict` - Thread not found for current operation (`"thread not found!"`).
- `500 Internal Server Error` - Unexpected server-side failure.
