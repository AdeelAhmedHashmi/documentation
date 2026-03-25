---
id: get-thread-messages
title: Get Thread Messages
---

# Get Thread Messages

Fetch thread messages using cursor-based pagination:

- root messages endpoint
- direct replies endpoint

---

## Endpoint 1 (Root Messages)

`GET /thread/message/:threadId`

Returns root messages (`depth = 0`) plus a preview of replies for each root.

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `threadId` is required and must be a valid MongoDB ObjectId string.

**Query Params**:

- `sort` (optional): `top` | `new` | `old` (default: `top`).
- `cursor` (optional): opaque cursor from previous response.
- `limit` (optional): number of root messages (default: `10`).
- `replylimit` (optional): preview replies per root (default: `3`, max allowed: `5`).

---

## Example cURL Request (Root Messages)

```bash
curl -X GET "{{baseUrl}}/thread/message/{{threadId}}?cursor={{nextCursor}}&limit=10&replylimit=3&sort=top" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json"
```

---

## Response 200 OK (Root Messages)

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "roots": [
      {
        "_id": "69c3c1e5611becba1f445399",
        "threadId": "69c2dc3e54dc14655d91bdda",
        "parentId": null,
        "sender": "67d0f84f0a4f4f49f2a4c555",
        "content": "first root message",
        "depth": 0,
        "path": "/69c3c1e5611becba1f445399",
        "pathIndex": "0001",
        "childrenCount": 3,
        "directReplyCount": 3,
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
        "updatedAt": "2026-03-25T10:30:00.000Z"
      }
    ],
    "repliesMap": {
      "69c3c1e5611becba1f445399": {
        "replies": [
          {
            "_id": "69c3c2a0611becba1f4454aa",
            "threadId": "69c2dc3e54dc14655d91bdda",
            "parentId": "69c3c1e5611becba1f445399",
            "sender": "67d0f84f0a4f4f49f2a4c555",
            "content": "reply preview",
            "depth": 1,
            "path": "/69c3c1e5611becba1f445399/69c3c2a0611becba1f4454aa",
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
            "createdAt": "2026-03-25T10:31:00.000Z",
            "updatedAt": "2026-03-25T10:31:00.000Z"
          }
        ],
        "hasMore": false,
        "nextCursor": null
      }
    },
    "nextCursor": "eyJfaWQiOiI2OWMzYzFlNTYxMWJlY2JhMWY0NDUzOTkiLCJ2IjowfQ",
    "hasMore": true
  },
  "timestamp": "2026-03-25T10:30:10.000Z"
}
```

---

## Endpoint 2 (Direct Replies)

`GET /thread/message/:threadId/:parentId/replies`

Returns direct replies for a specific parent message with cursor pagination.

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Params**:

- `threadId` is required and must be a valid MongoDB ObjectId string.
- `parentId` is required and must be a valid MongoDB ObjectId string.

**Query Params**:

- `sort` (optional): `top` | `new` | `old` (default: `top`).
- `cursor` (optional): opaque cursor from previous response.
- `limit` (optional): number of replies (default: `10`).

---

## Example cURL Request (Direct Replies)

```bash
curl -X GET "{{baseUrl}}/thread/message/{{threadId}}/{{parentId}}/replies?limit=2&cursor={{nextCursor}}&sort=top" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json"
```

---

## Response 200 OK (Direct Replies)

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "replies": [
      {
        "_id": "69c2e54be3e75183fd833429",
        "threadId": "69c2dc3e54dc14655d91bdda",
        "parentId": "69c2e54be3e75183fd83341e",
        "sender": "67d0f84f0a4f4f49f2a4c555",
        "content": "reply item",
        "depth": 2,
        "path": "/.../69c2e54be3e75183fd833429",
        "pathIndex": "0001.0002.0001",
        "childrenCount": 0,
        "directReplyCount": 0,
        "score": 120,
        "upvotes": 0,
        "downvotes": 0,
        "isDeleted": false,
        "isEdited": false,
        "deletedAt": null,
        "editedAt": null,
        "isHidden": false,
        "isPinned": false,
        "meta": {},
        "createdAt": "2026-03-25T10:40:00.000Z",
        "updatedAt": "2026-03-25T10:40:00.000Z"
      }
    ],
    "nextCursor": "eyJfaWQiOiI2OWMyZTU0YmUzZTc1MTgzZmQ4MzM0MjkiLCJ2IjoxMjB9",
    "hasMore": true
  },
  "timestamp": "2026-03-25T10:40:10.000Z"
}
```

---

## Notes

- Authentication is enforced globally via `AuthGuard` (`APP_GUARD`).
- Global response interceptor wraps payload as `success`, `message`, `data`, and `timestamp`.
- Sorting behavior:
  - `top` => `score DESC, _id DESC`
  - `new` => `createdAt DESC, _id DESC`
  - `old` => `createdAt ASC, _id ASC`
- Both endpoints filter with `isDeleted: false`.
- Root endpoint also filters `depth: 0` and builds `repliesMap` preview in one batched query.
- Cursor is an opaque base64url token encoding last item sort value and `_id`.
- Current implementation for these GET routes does not validate thread/group membership in service before listing.

---

## Error Cases

- `400 Bad Request` - Invalid `threadId` or `parentId`, invalid query type/value, or unknown query fields.
- `401 Unauthorized` - Missing/invalid/expired token, suspended/inactive user, or untrusted device.
- `409 Conflict` - Root endpoint with `replylimit > 5` returns `"reply limit is too high"`.
- `500 Internal Server Error` - Unexpected server-side failure.
