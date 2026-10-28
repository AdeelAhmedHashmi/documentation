---
id: reject-join-request
title: Reject Join Request
---

# Reject Join Request

Declines a pending user join request, preventing the user from joining the group.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/request/reject`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Caller must be an active **admin** or **owner** of the specified group.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| groupId | string | Yes | MongoDB ObjectID | The target group identifier |
| requestId | string | Yes | MongoDB ObjectID | The join request identifier |

### Example Request

```json
{
  "groupId": "6a0586923efbbabf8375f89c",
  "requestId": "6a058592db7fb3113b842973"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "rejected": true,
    "requestId": "6a058592db7fb3113b842973"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.rejected | boolean | No | Confirmation flag |
| data.requestId | string | No | The rejected request ID |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid group or request ID | Check input IDs |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (caller is not an admin) | Show permission denied alert |
| 404 | Request or group not found | Remove item from list |
| 500 | Server error | Show rejection failure toast |

```json
{
  "message": "unauthorized: only admins can reject requests",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim reject button and show progress spinner on candidate item.
- Empty state: Not applicable.
- Retry behavior: Allow re-trying reject action.
- Cache invalidation: Remove request from pending requests list.
- Side effects: Deletes or marks request as rejected in `group_members` collection.
- Related realtime events: `group.request_rejected`.

## Related Endpoints

- [Get Pending Requests](./get-pending-requests.md)
- [Accept Join Request](./accept-join-request.md)
- [Request to Join Group](./request-to-join.md)
