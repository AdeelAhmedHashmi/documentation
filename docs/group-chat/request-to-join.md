---
id: request-to-join
title: Request to Join Group
---

# Request to Join Group

Toggles a membership join request for a private group channel using its invitation code. Calling again cancels the pending request.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/group/request`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. Non-members who are not blocked can submit or cancel a join request.

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
| invitationCode | string | Yes | None | The secret invitation UUID code of the target group |

### Request Body

None.

### Example Request

```http
POST /api/v1/group/request?invitationCode=013131b9-dd2a-48b9-b4f9-54bf4b5d1046 HTTP/1.1
Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "action": "REQUESTED"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.action | string | No | The resulting join request status: `"REQUESTED"` or `"CANCELED"` |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid code or already a joined member | Show appropriate message |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (blocked from group) | Show "You cannot join this group" alert |
| 404 | Group or invitation code not found | Show invalid invite screen |
| 500 | Server error | Show request failure alert |

```json
{
  "message": "user is blocked in this group",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Toggle join button state to loading with spinner.
- Empty state: Not applicable.
- Retry behavior: Allow user to tap again on failure.
- Cache invalidation: Mutate local status to `PENDING_REQUEST` (or revert to `NOT_MEMBER` if canceled).
- Side effects: Enqueues pending request in `group_members` collection and dispatches notification to group admins.
- Related realtime events: `group.join_request_created`.

## Related Endpoints

- [Get Group Preview](./get-group-preview.md)
- [Get Pending Requests](./get-pending-requests.md)
- [Accept Join Request](./accept-join-request.md)
- [Reject Join Request](./reject-join-request.md)
