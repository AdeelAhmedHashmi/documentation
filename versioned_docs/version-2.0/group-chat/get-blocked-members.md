---
id: get-blocked-members
title: Get Blocked Members
---

# Get Blocked Members

Retrieves a paginated list of all users currently banned/blocked from a group channel.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/group/:groupId/blocks`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Only group **admins** or the **owner** can view the group blocklist.

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
| limit | string | No | `"10"` | Maximum blocked records per page |

### Request Body

None.

### Example Request

```http
GET /api/v1/group/6a0586923efbbabf8375f89c/blocks?page=1&limit=20 HTTP/1.1
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
    "blocklist": [
      {
        "memberId": "6a058592db7fb3113b842999",
        "user": {
          "id": "69b824284eb53689e88e4fcc",
          "firstName": "Blocked",
          "lastName": "User",
          "avatar": null
        },
        "role": "member",
        "status": "blocked"
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 1,
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
| data.blocklist | array | No | Array of blocked member records |
| data.blocklist[].memberId | string | No | Membership record identifier |
| data.blocklist[].user | object | No | User profile preview |
| data.blocklist[].status | string | No | Always `"blocked"` |
| data.meta | object | No | Pagination metadata |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (caller is not an admin) | Show permission denied alert |
| 404 | Group not found | Return to group catalog |
| 500 | Server error | Show blocklist load failure toast |

```json
{
  "message": "unauthorized: only admins can view the blocklist",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display skeleton list items in group settings "Blocked Users" view.
- Empty state: Show "No blocked users" with a green shield graphic.
- Retry behavior: Pull-to-refresh on error.
- Cache invalidation: Invalidate on block or unblock member actions.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Block Member](./block-member.md)
- [Unblock Member](./unblock-member.md)
- [Get Active Members](./get-active-members.md)
