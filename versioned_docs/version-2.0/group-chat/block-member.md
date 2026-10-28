---
id: block-member
title: Block Member
---

# Block Member

Blocks a user from a group channel, revoking their membership and preventing them from re-joining or viewing group content.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/member/block`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Only group **admins** or the **owner** can block users. Admins cannot block other admins or the group owner.

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
| groupId | string | Yes | MongoDB ObjectID | The group identifier |
| userId | string | Yes | MongoDB ObjectID | The member to block |

### Example Request

```json
{
  "groupId": "69b8295e4eb53689e88e4fed",
  "userId": "69b824284eb53689e88e4fcc"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "blocked": true,
    "userId": "69b824284eb53689e88e4fcc",
    "status": "blocked"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.blocked | boolean | No | Block confirmation flag |
| data.userId | string | No | Blocked user ID |
| data.status | string | No | Status updated to `blocked` |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Attempting to block owner or self | Show error notice |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (caller is not an admin) | Show "Only admins can block members" |
| 404 | User or group not found | Refresh member list |
| 500 | Server error | Show block error alert |

```json
{
  "message": "cannot block group admin or owner",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim member tile and display blocking spinner.
- Empty state: Not applicable.
- Retry behavior: Allow user to retry if request timed out.
- Cache invalidation: Move user from active members list to group blocklist.
- Side effects: Disconnects the blocked user from the WebSocket room and closes their active chat session.
- Related realtime events: `group.member_kicked`.

## Related Endpoints

- [Unblock Member](./unblock-member.md)
- [Get Blocked Members](./get-blocked-members.md)
- [Get Active Members](./get-active-members.md)
