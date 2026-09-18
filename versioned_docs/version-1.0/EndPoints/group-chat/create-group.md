---
id: create-group
title: Create Group
---

# Create Group

Create a new group. The authenticated user becomes the initial admin.

---

## Endpoint

`POST /group`

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "name": "Study Circle",
  "circleId": "67d0f84f0a4f4f49f2a4c222",
  "type": "GENERAL",
  "scope": "STANDALONE",
  "description": "Weekly study group",
  "image": "67d0f84f0a4f4f49f2a4c333",
  "visibility": true
}
```

**Field Rules**:

- `name` is required.
- `circleId` is optional and must be a valid MongoDB ObjectId string if provided.
- `type` is optional. Supported values: `GENERAL`, `ANNOUNCEMENT`.
- `scope` is optional. Supported values: `CIRCLE`, `STANDALONE`.
- `description` is optional and limited to 500 characters.
- `image` is optional.
- `visibility` is optional and must be boolean if provided.

---

## Example cURL Request

```bash
curl -X POST "{{baseUrl}}/group" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Study Circle",
    "description": "Weekly study group",
    "type": "GENERAL",
    "scope": "STANDALONE"
  }'
```

---

## Response 201 OK

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
    "image": "67d0f84f0a4f4f49f2a4c333",
    "members": [],
    "admins": ["67d0f84f0a4f4f49f2a4c555"],
    "invitationCode": "K9J2VQ",
    "unreadCount": 0,
    "createdAt": "2026-03-17T10:30:00.000Z",
    "updatedAt": "2026-03-17T10:30:00.000Z"
  },
  "timestamp": "2026-03-17T10:30:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard` (`@UserParam()` indicates the route always receives the authenticated user).
- The authenticated user is added to the `admins` array.
- `invitationCode` is generated automatically.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).

---

## Error Cases

- `400 Bad Request` — Missing or invalid `name`, invalid `circleId`, or invalid `type` or `scope`.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `500 Internal Server Error` — Database insert failure or any other unexpected server-side failure.
