---
id: group-admin-add
title: Add Group Admin
---

# Add Group Admin

Promote a group member to admin. Only existing admins can perform this action.

---

## Endpoint

`PATCH /group/admin/add`

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "groupId": "67d0f84f0a4f4f49f2a4c111",
  "userId": "67d0f84f0a4f4f49f2a4c222"
}
```

---

## Example cURL Request

```bash
curl -X PATCH "{{baseUrl}}/group/admin/add" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "67d0f84f0a4f4f49f2a4c111",
    "userId": "67d0f84f0a4f4f49f2a4c222"
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "admin assigned!"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard`.
- The requester must already be an admin in the group.
- The target user must be a member of the group.
- If the group already has the maximum number of admins, the request fails.
- A group notification may be emitted after the admin is added.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).

---

## Error Cases

- `400 Bad Request` — Invalid `groupId` or `userId`.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `409 Conflict` — User is already an admin, not a member, or admin limit reached.
- `500 Internal Server Error` — Any unexpected server-side failure.
