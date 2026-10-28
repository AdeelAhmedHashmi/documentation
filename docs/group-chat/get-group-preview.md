---
id: get-group-preview
title: Get Group Preview
---

# Get Group Preview

Retrieves public preview information, member count, and join status for a group using an invitation code or numeric short code.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/group/preview/:code`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Non-members can preview group metadata before choosing to join or request access.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| code | string | Yes | The secret invitation UUID code or numeric info code |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
GET /api/v1/group/preview/013131b9-dd2a-48b9-b4f9-54bf4b5d1046 HTTP/1.1
Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "group": {
      "id": "6a4e2d25c11e524921cb6fcd",
      "name": "Suffa Developers Official",
      "description": "An official suffa group for help, updates, and open-source contributions.",
      "type": "general",
      "scope": "public",
      "image": {
        "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/group.webp"
      },
      "owner": {
        "id": "69831b4bc58eff75b4210b8e",
        "firstName": "Adeel",
        "lastName": "Ahmed"
      }
    },
    "memberCount": 24,
    "members": [
      {
        "userId": "69831b4bc58eff75b4210b8e",
        "role": "owner"
      }
    ],
    "invitationLink": "http://suffah.buzz/join/013131b9-dd2a-48b9-b4f9-54bf4b5d1046",
    "status": "NOT_MEMBER"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.group | object | No | Summary of group metadata |
| data.memberCount | number | No | Total active members enrolled |
| data.members | array | No | Sample of prominent members / admins |
| data.invitationLink | string | No | Full shareable invite URL |
| data.status | string | No | Relationship of requesting user to the group (`MEMBER`, `PENDING_REQUEST`, `BLOCKED`, `NOT_MEMBER`) |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid code format | Show "Invalid invite link" |
| 401 | Unauthenticated | Redirect to login |
| 404 | Group not found or invite expired | Render "Group invitation is no longer valid" screen |
| 500 | Server error | Show standard error alert |

```json
{
  "message": "invalid invitation code",
  "code": 404,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render group invitation preview card with banner, title, and member avatars.
- Empty state: Show invalid link graphic if group doesn't exist.
- Retry behavior: Re-query on navigation.
- Cache invalidation: Cache preview for active invitation session.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Request to Join Group](./request-to-join.md)
- [Get Group Info Code](./get-group-info-code.md)
- [Reset Invitation Code](./reset-invitation-code.md)
