---
id: delete-group
title: Delete Group
---

# Delete Group

Delete a group. Only the group owner can delete.

---

## Endpoint

`DELETE /group/:groupId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `groupId` string

---

## Example cURL Request

```bash
curl -X DELETE "{{baseUrl}}/group/67d0f84f0a4f4f49f2a4c111" \
  -H "Authorization: Bearer {{token}}"
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "acknowledged": true,
    "deletedCount": 1
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard`.
- Only the group owner can delete the group.
- The response contains the delete result summary.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

---

## Error Cases

- `400 Bad Request` — Invalid `groupId`.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `500 Internal Server Error` — Database delete failure or any other unexpected server-side failure.
