---
id: create-thread-message
title: Create Thread Message
---

# Create Thread Message

Create a new message inside a thread (root message or reply).

---

## Endpoint

`POST /thread/message`

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "threadId": "69c2dc3e54dc14655d91bdda",
  "content": "first comment",
  "parentId": "69c3c1e7611becba1f4453ea"
}
```

**Field Rules**:

- `threadId` is required and must be a valid MongoDB ObjectId.
- `content` is optional and must be a string if provided.
- `parentId` is optional and must be a valid MongoDB ObjectId if provided.
- Unknown body fields are rejected by global validation (`ValidationPipe` with `whitelist` + `forbidNonWhitelisted`).

---

## Behavior

- If `parentId` is omitted: creates a root message (`depth = 0`).
- If `parentId` is provided: creates a direct reply message (`depth = parent.depth + 1`) and increments parent counters.
- The request first validates thread access via `threadService.getThread(...)` (thread must exist and user must have access to the related group).

---

## Example cURL Request

```bash
curl -X POST "{{baseUrl}}/thread/message" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "first comment",
    "threadId": "69c2dc3e54dc14655d91bdda",
    "parentId": "69c3c1e7611becba1f4453ea"
  }'
```

---

## Response 201 Created

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "69c3c2a0611becba1f4454aa",
    "threadId": "69c2dc3e54dc14655d91bdda",
    "parentId": "69c3c1e7611becba1f4453ea",
    "sender": "67d0f84f0a4f4f49f2a4c555",
    "content": "first comment",
    "depth": 1,
    "path": "/69c3c1e7611becba1f4453ea/69c3c2a0611becba1f4454aa",
    "pathIndex": "0001.0001",
    "childrenCount": 0,
    "directReplyCount": 0,
    "score": 0,
    "upvotes": 0,
    "downvotes": 0,
    "isDeleted": false,
    "isEdited": false,
    "deletedAt": null,
    "editedAt": null,
    "isHidden": false,
    "isPinned": false,
    "meta": {},
    "createdAt": "2026-03-25T10:30:00.000Z",
    "updatedAt": "2026-03-25T10:30:00.000Z",
    "__v": 0
  },
  "timestamp": "2026-03-25T10:30:10.000Z"
}
```

---

## Notes

- Authentication is enforced globally via `AuthGuard` (`APP_GUARD`).
- Global response interceptor wraps payload as `success`, `message`, `data`, and `timestamp`.
- `content` is not required by current DTO/service; message may be stored with `content: null`.
- For replies, parent lookup checks `_id`, `isDeleted: false`, `isHidden: false`.

---

## Error Cases

- `400 Bad Request` - Invalid `threadId` / `parentId` format, invalid field types, or unknown body fields.
- `401 Unauthorized` - Missing/invalid/expired token, suspended/inactive user, or untrusted device.
- `409 Conflict` - Thread not found (`"thread not found!"`), parent not found (`"parent message not found!"`), or path/depth generation conflict.
- `500 Internal Server Error` - Unexpected server-side failure.
