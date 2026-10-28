---
id: get-all-groups
title: Get All Groups
---

# Get All Groups

Retrieves a paginated list of all group channels where the authenticated user is currently an active member.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/group`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Only returns groups in which the caller has an active membership.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| page | string | No | `"1"` | Page index number |
| limit | string | No | `"10"` | Maximum groups to return |

### Request Body

None.

### Example Request

```http
GET /api/v1/group?page=1&limit=10 HTTP/1.1
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
    "groups": [
      {
        "id": "6a4e2d25c11e524921cb6fcd",
        "name": "Suffa Developers Community",
        "description": "Official community for developers building on the Suffa ecosystem.",
        "image": {
          "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/group.webp"
        },
        "owner": {
          "id": "69831b4bc58eff75b4210b8e",
          "firstName": "Adeel",
          "lastName": "Ahmed"
        },
        "unreadCount": 0,
        "lastMessage": {
          "id": "6a4e54bb1725ec10e4314539",
          "content": "Welcome to the group!",
          "createdAt": "2026-02-04T13:05:00.000Z"
        }
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
| data.groups | array | No | Array of joined groups |
| data.groups[].id | string | No | Group ID |
| data.groups[].name | string | No | Group name |
| data.groups[].description | string | Yes | Group description |
| data.groups[].image | object | Yes | Avatar / logo media object |
| data.groups[].owner | object | No | Creator profile summary |
| data.groups[].unreadCount | number | No | Number of unread messages |
| data.groups[].lastMessage | object | Yes | Latest message preview |
| data.meta | object | No | Pagination metadata |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show group list load failure |

```json
{
  "message": "unauthorized request",
  "code": 401,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display group list skeleton rows.
- Empty state: Show "You have not joined any groups yet. Explore or create a group!".
- Retry behavior: Pull-to-refresh on error.
- Cache invalidation: Update list when joined, created, or left a group.
- Side effects: None.
- Related realtime events: `group.joined`, `group.left`.

## Related Endpoints

- [Create Group](./create-group.md)
- [Get Group By ID](./get-group-by-id.md)
- [Leave Group](./leave-group.md)
