---
id: get-pending-requests
title: Get Pending Requests
---

# Get Pending Requests

Retrieves a paginated list of pending user join requests waiting for administrative approval.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/group/:groupId/requests`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Only active **admins** or the **owner** of the group can view pending join requests.

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
| page | string | No | `"1"` | Page index number |
| limit | string | No | `"10"` | Maximum requests per page |

### Request Body

None.

### Example Request

```http
GET /api/v1/group/6a4e2d25c11e524921cb6fcd/requests?page=1&limit=10 HTTP/1.1
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
    "requests": [
      {
        "id": "6a058592db7fb3113b842973",
        "userId": "69a026700812dd821414f341",
        "role": "member",
        "status": "pending",
        "user": {
          "id": "69a026700812dd821414f341",
          "firstName": "Muhammad",
          "lastName": "Hussain",
          "avatar": null
        },
        "createdAt": "2026-02-04T13:25:00.000Z"
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
| data.requests | array | No | Array of pending member request objects |
| data.requests[].id | string | No | Join request record ID |
| data.requests[].userId | string | No | Requesting user ID |
| data.requests[].user | object | No | Profile preview of candidate |
| data.requests[].status | string | No | Membership status (`pending`) |
| data.meta | object | No | Pagination metadata |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (caller is not an admin) | Show permission denied alert |
| 404 | Group not found | Return to group catalog |
| 500 | Server error | Show request loading failure toast |

```json
{
  "message": "only group admins can view pending requests",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display list item skeleton in the "Member Requests" tab.
- Empty state: Render "No pending join requests" with a checkmark graphic.
- Retry behavior: Allow pull-to-refresh.
- Cache invalidation: Invalidate when accepting or rejecting a request.
- Side effects: None.
- Related realtime events: `group.join_request_received`.

## Related Endpoints

- [Accept Join Request](./accept-join-request.md)
- [Reject Join Request](./reject-join-request.md)
- [Request to Join Group](./request-to-join.md)
