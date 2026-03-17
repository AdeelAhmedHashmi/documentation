---
id: group-leave
title: Leave Group
---

# Leave Group

Leave a group as the authenticated user. If the user is the only admin, they must assign another admin first.

---

## Endpoint

`PATCH /group/:groupId/leave`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `groupId` string

---

## Example cURL Request

```bash
curl -X PATCH "{{baseUrl}}/group/67d0f84f0a4f4f49f2a4c111/leave" \
  -H "Authorization: Bearer {{token}}"
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "user left!"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard`.
- The user must already be a member of the group.
- If the user is an admin and is the only admin, the request fails until another admin is assigned.
- A group notification and system message may be emitted after leaving.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `400 Bad Request` — Invalid `groupId` or group not found.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `409 Conflict` — User is not a member or is the only admin and cannot leave.
- `500 Internal Server Error` — Any unexpected server-side failure.
