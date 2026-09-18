---
id: fetch-chats
title: Fetch Chats
---

# Fetch Chats

Retrieve the authenticated user's chats with pagination.

---

## Endpoint

`GET /chat`

**Headers**:

- `Authorization: Bearer {{token}}`

**Query Parameters**:

- `page` Optional string/number. Values below `1` fall back to `1` via `generatePaginationMetaData`.
- `limit` Optional string/number. Omitted or invalid values fall back to `40` (controller passes parsed value or `40`).

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/chat?page=1&limit=20" \
  -H "Authorization: Bearer {{token}}"
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "chats": [
      {
        "_id": "67d0f84f0a4f4f49f2a4c111",
        "participants": [
          {
            "_id": "67d0f84f0a4f4f49f2a4c333",
            "username": "bob",
            "avatar": {
              "_id": "67d0f84f0a4f4f49f2a4c666",
              "url": "https://cdn.example.com/avatar-bob.jpg"
            }
          }
        ],
        "lastMessage": {
          "_id": "67d0f84f0a4f4f49f2a4c444",
          "content": "See you soon",
          "type": "text",
          "senderId": {
            "_id": "69ba7f2d50cd343ab59f1c06",
            "username": "alice"
          }
        },
        "unreadCount": 10,
        "updatedAt": "2026-03-09T10:31:00.000Z"
      }
    ],
    "meta": {
      "totalItems": 1,
      "currentPage": 1,
      "itemsPerPage": 20,
      "totalPages": 1,
      "hasMore": false
    }
  },
  "timestamp": "2026-03-09T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard` (`@UserParam()` indicates the route always receives the authenticated user).
- `ChatRepository.findAll` filters by the authenticated user's `_id`, so only their chats appear.
- `participants` is populated with `username` and `avatar`; nested `avatar` includes `url` and `storageKey`.
- `lastMessage` is populated with `content`, `senderId`, `createdAt`, `updatedAt`, and sender basic profile fields.
- Pagination metadata is generated with `generatePaginationMetaData`, which also handles invalid `page`/`limit` values.
- Unknown query fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `401 Unauthorized`
  - Missing or malformed `Authorization` header
  - Invalid/expired token
  - Suspended, inactive, or untrusted device (see `AuthGuard` checks)
- `500 Internal Server Error`
  - Database query failure in `ChatRepository`
  - Any other unexpected server-side failure
