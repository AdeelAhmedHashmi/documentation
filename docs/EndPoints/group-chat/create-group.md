---
id: create-group
title: Create Group
---

# Create Group

Create a new group with the authenticated user as the first admin. This endpoint validates the payload, generates an invitation code, and returns the created group.

---

## Endpoint

`POST /group`

**Headers**:

- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Request Body**:

```json
{
  "name": "Programmer's Team"
}
```

- `name` Required. Group name.
- `description` Optional. Max 500 characters.
- `image` Optional. Image URL or reference string.
- `visibility` Optional. Boolean, group visibility.

---

## Example cURL Request

```bash
curl -X POST "{{baseUrl}}/group/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "name": "Programmer\u0027s Team",
    "description": "A public group for developers",
    "visibility": true
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "<groupId>",
    "name": "Programmer's Team",
    "circleId": "<circleId>",
    "scope": "STANDALONE",
    "type": "GENERAL",
    "description": "A public group for developers",
    "image": "https://...",
    "members": [],
    "admins": ["<creatorUserId>"],
    "invitationCode": "<code>",
    "createdAt": "2026-02-07T00:00:00.000Z",
    "updatedAt": "2026-02-07T00:00:00.000Z"
  },
  "timestamp": "2026-02-07T00:00:00.000Z"
}
```

---

## Notes

- Authentication is required. Requests without a valid token are rejected.
- `name` is required. All other fields are optional.
- `description` is limited to 500 characters.
- The authenticated user becomes the initial group admin.
- An `invitationCode` is generated automatically for join requests.
- Unknown fields in the body are rejected by validation.

---

## Error Cases

- `400 Bad Request`
  - Missing `name`
  - Invalid `circleId`
  - Invalid `type` or `scope`
  - Invalid payload format
- `401 Unauthorized`
  - Missing or invalid token
  - Suspended or inactive account
  - Untrusted device
