---
id: get-thread
title: Get Thread
---

# Get Thread

Get a single thread by its ID.

---

## Endpoint

`GET /thread/:threadId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `threadId` is required and must be a valid MongoDB ObjectId string.

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/thread/{{threadId}}" \
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
    "_id": "67d0f84f0a4f4f49f2a4c111",
    "conversationId": "67d0f84f0a4f4f49f2a4c222",
    "author": {
      "_id": "67d0f84f0a4f4f49f2a4c555",
      "username": "john_doe",
      "avatar": {
        "_id": "67d0f84f0a4f4f49f2a4c777",
        "url": "https://res.cloudinary.com/demo/image/upload/v1/avatar.jpg",
        "storageKey": "group/avatar_1",
        "height": 512,
        "width": 512
      }
    },
    "title": "Head & Tail",
    "content": "Imagine if this is a real thread!",
    "attachments": [],
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

If the thread does not exist (or is filtered out by `isDeleted`, `isHidden`, `isLocked`), the endpoint still returns `200` with:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": null,
  "timestamp": "2026-03-25T10:30:10.000Z"
}
```

---

## Notes

- Authentication is enforced globally via `AuthGuard` (`APP_GUARD`).
- After finding the thread, the server checks group membership via `groupService.getGroup(thread.conversationId, userId)`.
- `author` and `attachments` are populated in response.
- Global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `400 Bad Request` - Invalid `threadId` format.
- `401 Unauthorized` - Missing/invalid/expired token, suspended/inactive user, or untrusted device.
- `409 Conflict` - Requester is not a member of the thread's group (`"Group not found"`).
- `500 Internal Server Error` - Unexpected server-side failure.
