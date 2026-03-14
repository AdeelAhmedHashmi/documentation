---
id: fetch-groups
title: Fetch Groups
---

# Fetch Groups

Retrieve the authenticated user's groups with pagination.

---

## Endpoint

`GET /group`

**Headers**:

- `Authorization: Bearer {{token}}`

**Query Parameters**:

- `page` Optional string. Parsed with `Number(page)` in controller before passing to the service.
- `limit` Optional string. Parsed with `Number(limit)` in controller before passing to the service.

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/group?page=1&limit=20" \
  -H "Authorization: Bearer {{token}}"
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "groups": [
      {
        "_id": "67d0f84f0a4f4f49f2a4c111",
        "name": "Study Circle",
        "circleId": "67d0f84f0a4f4f49f2a4c222",
        "scope": "standalone",
        "type": "general",
        "description": "Weekly study group",
        "image": {
          "_id": "67d0f84f0a4f4f49f2a4c333",
          "url": "https://cdn.example.com/group-image.jpg",
          "storageKey": "groups/67d0f84f0a4f4f49f2a4c111/image.jpg"
        },
        "members": ["67d0f84f0a4f4f49f2a4c444"],
        "admins": ["67d0f84f0a4f4f49f2a4c555"],
        "invitationCode": "K9J2VQ",
        "lastMessage": {
          "_id": "67d0f84f0a4f4f49f2a4c666",
          "content": "Welcome everyone",
          "senderId": {
            "username": "alice"
          },
          "updatedAt": "2026-03-09T10:30:00.000Z"
        },
        "unreadCount": 0,
        "createdAt": "2026-03-09T10:00:00.000Z",
        "updatedAt": "2026-03-09T10:30:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "hasMore": false
    }
  },
  "timestamp": "2026-03-09T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard` (`@UserParam()` indicates the route always receives the authenticated user).
- `GroupRepository.findAll` filters by the authenticated user's `_id` (member or admin).
- `image` is populated from its reference.
- `lastMessage` is populated with `content`, `senderId.username`, and `updatedAt`.
- Pagination metadata is computed in `GroupService.getAllGroups` using `page` and `limit` passed from the controller.
- Unknown query fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `401 Unauthorized`
  - Missing or malformed `Authorization` header
  - Invalid/expired token
  - Suspended, inactive, or untrusted device (see `AuthGuard` checks)
- `500 Internal Server Error`
  - Database query failure in `GroupRepository`
  - Any other unexpected server-side failure

---

# Fetch Group By Id

Retrieve a single group by its id.

---

## Endpoint

`GET /group/:id`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `id` Group id (string)

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/group/67d0f84f0a4f4f49f2a4c111" \
  -H "Authorization: Bearer {{token}}"
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "69b5748861c8212a3189cb16",
    "name": "Programmer's Team",
    "scope": "STANDALONE",
    "type": "GENERAL",
    "description": null,
    "image": {
      "url": "<image url>",
      "storageKey": "suffa/group_media/3242.png"
    },
    "members": [],
    "admins": ["69a026700812dd821414f341"],
    "invitationCode": "2646fa25-df5e-42d4-97cd-7ca3f2a4dba9",
    "requests": [],
    "blocked": [],
    "unreadCount": 0,
    "createdAt": "2026-03-14T14:45:28.626Z",
    "updatedAt": "2026-03-14T16:06:39.853Z",
    "__v": 0,
    "lastMessage": {
      "_id": "69b5878f1ffb4b0caedd84ff",
      "senderId": {
        "username": "adeelahmed"
      },
      "content": "hi this is a test message!",
      "updatedAt": "2026-03-14T16:06:39.759Z"
    }
  },
  "timestamp": "2026-03-14T16:28:31.906Z"
}
```

---

## Notes

- If the requester is an admin of the group, the response includes `requests` and `blocked` arrays (these fields are selected only for admins).
- If the requester is not an admin, the response is returned without `requests` and `blocked`.
- The service first tries to fetch by admin membership, then by id. If neither query matches, it returns `null`.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `400 Bad Request`
  - Invalid `id`
- `401 Unauthorized`
  - Missing or malformed `Authorization` header
  - Invalid/expired token
  - Suspended, inactive, or untrusted device (see `AuthGuard` checks)
- `500 Internal Server Error`
  - Database query failure in `GroupRepository`
  - Any other unexpected server-side failure
