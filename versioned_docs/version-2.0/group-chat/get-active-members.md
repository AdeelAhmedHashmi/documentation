---
id: get-active-members
title: Get Active Members
---

# Get Active Members

Retrieves a paginated list of all active enrolled members and administrators in a group channel.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/group/:groupId/members/active`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Any active member of the group can view the list of participating members.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| groupId | string | Yes | The MongoDB ObjectID of the group |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| page | string | No | `"1"` | Page number index |
| limit | string | No | `"10"` | Maximum members per page |

### Request Body

None.

### Example Request

```http
GET /api/v1/group/6a0586923efbbabf8375f89c/members/active?page=1&limit=20 HTTP/1.1
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
    "members": [
      {
        "memberId": "6a058592db7fb3113b842973",
        "user": {
          "id": "69831b4bc58eff75b4210b8e",
          "firstName": "Adeel",
          "lastName": "Ahmed",
          "avatar": {
            "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/avatar.webp"
          }
        },
        "role": "owner",
        "status": "joined"
      },
      {
        "memberId": "6a058592db7fb3113b842974",
        "user": {
          "id": "69a026700812dd821414f341",
          "firstName": "Muhammad",
          "lastName": "Hussain",
          "avatar": null
        },
        "role": "member",
        "status": "joined"
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 2,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.members | array | No | Array of active member records |
| data.members[].memberId | string | No | Membership record identifier |
| data.members[].user | object | No | User profile summary |
| data.members[].role | string | No | Role designation (`owner`, `admin`, `member`) |
| data.members[].status | string | No | Membership state (`joined`) |
| data.meta | object | No | Pagination metadata |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (not a group member) | Show restricted group notice |
| 404 | Group not found | Return to group catalog |
| 500 | Server error | Show member load failure toast |

```json
{
  "message": "unauthorized access to group",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render member list skeleton avatars and name bars.
- Empty state: Not applicable (groups always have at least one owner member).
- Retry behavior: Pull-to-refresh on error.
- Cache invalidation: Invalidate on add, remove, promote, demote, or leave member events.
- Side effects: None.
- Related realtime events: `group.member_added`, `group.member_left`, `group.member_promoted`.

## Related Endpoints

- [Add Members](./add-members.md)
- [Add Admin](./add-admin.md)
- [Remove Admin](./remove-admin.md)
- [Block Member](./block-member.md)
