---
id: update-group
title: Update Group
---

# Update Group

Update a group’s name and/or description. Only group admins can update.

---

## Endpoint

`PATCH /group/:groupId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `groupId` string

**Body**:

```json
{
  "name": "New Group Name",
  "description": "Updated group description"
}
```

**Field Rules**:

- At least one of `name` or `description` should be provided.
- `name` must be a string, 3–50 characters.
- `description` must be a string, 10–500 characters.

---

## Example cURL Request

```bash
curl -X PATCH "{{baseUrl}}/group/67d0f84f0a4f4f49f2a4c111" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Group Name",
    "description": "Updated group description"
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "acknowledged": true,
    "matchedCount": 1,
    "modifiedCount": 1
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard`.
- The requester must be an admin of the group; otherwise the request fails.
- The response is a write result summary (counts may be `0` if nothing changed).
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).

---

## Error Cases

- `400 Bad Request` — Invalid `groupId`, missing/invalid `name` or `description`, or the user lacks permission to update the group.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `500 Internal Server Error` — Database update failure or any other unexpected server-side failure.
