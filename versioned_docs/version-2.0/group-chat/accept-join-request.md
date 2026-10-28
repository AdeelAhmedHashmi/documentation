---
id: accept-join-request
title: Accept Join Request
---

# Accept Join Request

Approves a pending user membership request, admitting the user into the group as an active member.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/request/accept`
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
    "accepted": true,
    "requestId": "6a058592db7fb3113b842973",
    "status": "joined"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.accepted | boolean | No | Confirmation flag |
| data.requestId | string | No | The processed request ID |
| data.status | string | No | New membership state (`joined`) |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid group or request identifier | Show format validation error |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (caller is not a group admin) | Show permission denied alert |
| 404 | Request or group not found | Remove item from list |
| 500 | Server error | Show acceptance error alert |

```json
{
  "message": "unauthorized: only admins can accept requests",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim the accept button and show inline spinner on the request item.
- Empty state: Not applicable.
- Retry behavior: Allow re-clicking accept on network failure.
- Cache invalidation: Remove request from pending requests cache and increment active members count.
- Side effects: Updates member status to `joined`, emits WebSocket event into the room, and dispatches notification to the accepted user.
- Related realtime events: `group.member_joined`, `group.request_accepted`.

## Related Endpoints

- [Get Pending Requests](./get-pending-requests.md)
- [Reject Join Request](./reject-join-request.md)
- [Get Active Members](./get-active-members.md)
