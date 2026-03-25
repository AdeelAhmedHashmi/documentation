---
id: create-thread
title: Create Thread
---

# Create Thread

Create a new thread in a group conversation.

---

## Endpoint

`POST /thread/create`

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "conversationId": "67d0f84f0a4f4f49f2a4c222",
  "title": "Head & Tail",
  "content": "Imagine if this is a real thread!",
  "attachments": [{ "publicId": "temp/user_123/image_abc" }]
}
```

**Field Rules**:

- `conversationId` is required and must be a valid MongoDB ObjectId string.
- `title` is optional and must be a string if provided.
- `content` is optional and must be a string if provided.
- `attachments` is optional, must be an array, and maximum size is `5`.
- At least one of `content` or `attachments` must be provided.
- Unknown body fields are rejected by global validation (`ValidationPipe` with `whitelist` + `forbidNonWhitelisted`).

---

## Example cURL Request

```bash
curl -X POST "{{baseUrl}}/thread/create" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "67d0f84f0a4f4f49f2a4c222",
    "content": "Imagine if this is a real thread!",
    "title": "Head & Tail"
  }'
```

---

## Response 201 Created

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "67d0f84f0a4f4f49f2a4c111",
    "conversationId": "67d0f84f0a4f4f49f2a4c222",
    "author": "67d0f84f0a4f4f49f2a4c555",
    "title": "Head & Tail",
    "content": "Imagine if this is a real thread!",
    "totalReplies": 0,
    "score": 0,
    "upvotes": 0,
    "downvotes": 0,
    "lastActivityAt": "2026-03-25T10:30:00.000Z",
    "isDeleted": false,
    "isEdited": false,
    "deletedAt": null,
    "isLocked": false,
    "isPinned": false,
    "isHidden": false,
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

- Authentication is enforced globally via `APP_GUARD` (`AuthGuard`), and `@UserParam()` injects authenticated user.
- Route-level rate limit is enabled: `3` requests per `60` seconds (`RateLimitGuard` + `@RateLimiter`).
- `conversationId` is validated, then existence is checked through `groupService.getGroupById(...)`.
- If `attachments` are provided, media is promoted and stored; thread stores resulting media IDs.
- Global response interceptor wraps responses as `success`, `message`, `data`, and `timestamp`.
- In current code, `attachments` item fields are not explicitly validated in DTO decorators; runtime expects `{ publicId: string }` for media promotion.

---

## Error Cases

- `400 Bad Request` - Validation errors (e.g., missing/invalid `conversationId`, invalid types, attachments array > 5), or when both `content` and `attachments` are missing (`"one is required from content and attachments fields"`).
- `401 Unauthorized` - Missing/invalid token, expired token, suspended/inactive account, or untrusted device.
- `409 Conflict` - Group does not exist (`"group does not exist"`).
- `429 Too Many Requests` - Rate limit exceeded.
- `500 Internal Server Error` - Unexpected server-side error (e.g., media/database failures).
