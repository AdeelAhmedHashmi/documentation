---
id: group-blocking
title: Block or Unblock Group Member
---

# Block or Unblock Group Member

Block a member from a group or restore their access. Only admins can perform these actions.

---

## PATCH /group/member/block

Block a user in a group.

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "groupId": "67d0f84f0a4f4f49f2a4c111",
  "userId": "67d0f84f0a4f4f49f2a4c222"
}
```

**Example cURL Request**:

```bash
curl -X PATCH "{{baseUrl}}/group/member/block" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "67d0f84f0a4f4f49f2a4c111",
    "userId": "67d0f84f0a4f4f49f2a4c222"
  }'
```

**Response 200 OK**:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "user blocked!"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

**Notes**:

- The requester must be an admin of the group.
- A group notification may be emitted after blocking.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

**Error Cases**:

- `400 Bad Request` — Invalid `groupId` or `userId`.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `409 Conflict` — User is not a member or already blocked, or requester lacks admin permission.
- `500 Internal Server Error` — Any unexpected server-side failure.

---

## PATCH /group/member/unblock

Unblock a user in a group.

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "groupId": "67d0f84f0a4f4f49f2a4c111",
  "userId": "67d0f84f0a4f4f49f2a4c222"
}
```

**Example cURL Request**:

```bash
curl -X PATCH "{{baseUrl}}/group/member/unblock" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "67d0f84f0a4f4f49f2a4c111",
    "userId": "67d0f84f0a4f4f49f2a4c222"
  }'
```

**Response 200 OK**:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "user unblocked!"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

**Notes**:

- The requester must be an admin of the group.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

**Error Cases**:

- `400 Bad Request` — Invalid `groupId` or `userId`.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `409 Conflict` — User is not blocked or requester lacks admin permission.
- `500 Internal Server Error` — Any unexpected server-side failure.
