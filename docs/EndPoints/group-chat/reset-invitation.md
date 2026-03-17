---
id: group-invitation-reset
title: Reset Group Invitation Code
---

# Reset Group Invitation Code

Generate a new invitation code for a group. Only admins can reset.

---

## Endpoint

`PATCH /group/:groupId/invitation/reset`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `groupId` string

---

## Example cURL Request

```bash
curl -X PATCH "{{baseUrl}}/group/67d0f84f0a4f4f49f2a4c111/invitation/reset" \
  -H "Authorization: Bearer {{token}}"
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "invitationCode": "K9J2VQ"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard`.
- The requester must be an admin of the group.
- The previous invitation code becomes invalid immediately.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `400 Bad Request` — Invalid `groupId`.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `409 Conflict` — Requester lacks admin permission.
- `500 Internal Server Error` — Any unexpected server-side failure.
