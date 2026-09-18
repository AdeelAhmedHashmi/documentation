---
id: get-all-threads
title: Get Thread List
---

# Get Threads

Retrieve thread lists for a group using either cursor pagination or page/limit pagination.

Note: `conversationId` in these endpoints is actually the `groupId`.

---

## Endpoint 1 (Cursor-Based)

`GET /thread/all/:conversationId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `conversationId` (required): valid MongoDB ObjectId string (`groupId`).

**Query Params**:

- `limit` (optional): number. If omitted, defaults to `10`.
- `cursor` (optional): base64-encoded cursor string returned by previous response.

**Field Rules**:

- `conversationId` must be a valid MongoDB ObjectId.
- `limit` must be numeric if provided.
- `cursor` must be a string if provided.
- Unknown query fields are rejected by global validation (`ValidationPipe` with `whitelist` + `forbidNonWhitelisted`).

---

## Example cURL Request (Cursor-Based)

```bash
curl -X GET "{{baseUrl}}/thread/all/{{conversationId}}?limit=3&cursor={{nextCursor}}" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json"
```

---

## Response 200 OK (Cursor-Based)

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "threads": [
      {
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
      }
    ],
    "nextCursor": "eyJpc1Bpbm5lZCI6ZmFsc2UsImxhc3RBY3Rpdml0eUF0IjoiMjAyNi0wMy0yNVQxMDozMDowMC4wMDBaIiwiX2lkIjoiNjdkMGY4NGYwYTRmNGY0OWYyYTRjMTExIn0="
  },
  "timestamp": "2026-03-25T10:30:10.000Z"
}
```

---

## Endpoint 2 (Page/Limit)

`GET /thread/threads/:conversationId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `conversationId` (required): valid MongoDB ObjectId string (`groupId`).

**Query Params**:

- `page` (optional): string query value converted to number internally.
- `limit` (optional): string query value converted to number internally.

**Field Rules**:

- `conversationId` must be a valid MongoDB ObjectId.
- `page` and `limit` are optional string query params.
- Pagination normalization:
  - If `page` is missing/invalid/&lt;1, current page becomes `1`.
  - If `limit` is missing/invalid/&lt;1, items per page becomes `10`.
- Unknown query fields are rejected by global validation (`ValidationPipe` with `whitelist` + `forbidNonWhitelisted`).

---

## Example cURL Request (Page/Limit)

```bash
curl -X GET "{{baseUrl}}/thread/threads/{{conversationId}}?page=1&limit=10" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json"
```

---

## Response 200 OK (Page/Limit)

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "threads": [
      {
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
      }
    ],
    "meta": {
      "totalItems": 24,
      "currentPage": 1,
      "itemsPerPage": 10,
      "totalPages": 3,
      "hasMore": true
    }
  },
  "timestamp": "2026-03-25T10:30:10.000Z"
}
```

---

## Notes

- Both endpoints are authenticated via global `AuthGuard` (`APP_GUARD`).
- Membership/access is enforced through `groupService.getGroup(conversationId, userId)`.
- Threads are filtered with `isDeleted: false` and `isHidden: false`.
- Sorting is identical for both endpoints: `isPinned DESC`, `lastActivityAt DESC`, `_id DESC`.
- `author` and `attachments` are populated in repository responses.
- Global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `400 Bad Request` - Invalid `conversationId`, invalid query shape/types (especially for cursor endpoint query validation), or unknown query fields.
- `401 Unauthorized` - Missing/invalid/expired token, suspended/inactive user, or untrusted device.
- `409 Conflict` - Group not found or user is not a joined member (`"Group not found"`).
- `500 Internal Server Error` - Unexpected server-side failure.
