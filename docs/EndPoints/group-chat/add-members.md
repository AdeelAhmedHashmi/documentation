---
id: add-group-members
title: Add Group Members
---

# Add Group Members

Add one or more users to a group. Only a group admin can perform this action.

---

## Endpoint

`PATCH /group/:groupId/members/add`

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "userIds": [
    "67d0f84f0a4f4f49f2a4c111",
    "67d0f84f0a4f4f49f2a4c222"
  ]
}
```

**Field Rules**:

- `groupId` is required in the path and should be a valid MongoDB ObjectId string.
- `userIds` is required.
- `userIds` must be an array.
- Each item in `userIds` must be a valid MongoDB ObjectId string.
- `userIds` must contain at least 1 item.
- `userIds` can contain at most 5 items.

---

## Example cURL Request

```bash
curl -X PATCH "{{baseUrl}}/group/{{groupId}}/members/add" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": [
      "67d0f84f0a4f4f49f2a4c111",
      "67d0f84f0a4f4f49f2a4c222"
    ]
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "joinedUsers": [
      "67d0f84f0a4f4f49f2a4c111",
      "67d0f84f0a4f4f49f2a4c222"
    ]
  },
  "timestamp": "2026-03-17T10:30:10.000Z"
}
```

---

## Notes

- Authentication is enforced via the global `AuthGuard` (`@UserParam()` indicates the route always receives the authenticated user).
- Only group admins can add members to a group.
- Added users are created with member role and joined status.
- Duplicate `userIds` in the same request are de-duplicated before insertion.
- Users already present in the member collection are skipped and not returned in `joinedUsers`.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).

---

## Error Cases

- `400 Bad Request` — Missing `userIds`, non-array `userIds`, invalid MongoDB ObjectId values in `userIds`, or `userIds` length outside the 1 to 5 range.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, suspended/inactive/untrusted device, or authenticated user is not a group admin.
- `500 Internal Server Error` — Database insert failure, malformed `groupId`, or any other unexpected server-side failure.
