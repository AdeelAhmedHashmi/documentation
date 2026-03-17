---
id: fetch-group
title: Fetch Group By Id
---

# Fetch Group By Id

Retrieve a single group by its id. The requester must be a joined member.

---

## Endpoint

`GET /group/:groupId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `groupId` string

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
    "_id": "67d0f84f0a4f4f49f2a4c111",
    "name": "Study Circle",
    "circleId": "67d0f84f0a4f4f49f2a4c222",
    "scope": "STANDALONE",
    "type": "GENERAL",
    "description": "Weekly study group",
    "image": {
      "_id": "67d0f84f0a4f4f49f2a4c333",
      "url": "https://cdn.example.com/group-image.jpg",
      "storageKey": "groups/67d0f84f0a4f4f49f2a4c111/image.jpg"
    },
    "owner": "67d0f84f0a4f4f49f2a4c444",
    "admins": ["67d0f84f0a4f4f49f2a4c555"],
    "members": ["67d0f84f0a4f4f49f2a4c666"],
    "invitationCode": "K9J2VQ",
    "lastMessage": {
      "_id": "67d0f84f0a4f4f49f2a4c777",
      "content": "Welcome everyone",
      "senderId": {
        "username": "alice"
      },
      "updatedAt": "2026-03-17T10:30:00.000Z"
    },
    "unreadCount": 0,
    "createdAt": "2026-03-17T10:00:00.000Z",
    "updatedAt": "2026-03-17T10:30:00.000Z"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard`.
- The requester must be a joined member of the group; otherwise a `400` error is returned.
- `image` is populated with `url` and `storageKey` when present.
- `lastMessage` is populated with `content`, `senderId.username`, and `updatedAt`.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `400 Bad Request` — Invalid `groupId` or requester is not a joined member.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `500 Internal Server Error` — Database query failure or any other unexpected server-side failure.
