---
id: leave-group
title: Leave Group
---

# Leave Group

Removes the authenticated user's active membership from a group channel.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/:groupId/leave`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The caller must be an active member of the group. Note: The group owner cannot leave without transferring ownership or deleting the group.

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

None.

### Request Body

None.

### Example Request

```http
PATCH /api/v1/group/6a4e2d25c11e524921cb6fcd/leave HTTP/1.1
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
    "left": true,
    "groupId": "6a4e2d25c11e524921cb6fcd"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.left | boolean | No | Confirmation flag |
| data.groupId | string | No | The group ID left by the user |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Owner attempting to leave without transferring ownership | Prompt owner to delete group or appoint new owner |
| 401 | Unauthenticated | Redirect to login |
| 403 | User is not a member of this group | Show "Not a member" message |
| 404 | Group not found | Return to groups view |
| 500 | Server error | Show leave group error alert |

```json
{
  "message": "group owner cannot leave the group",
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display confirmation prompt, then loading spinner on the "Leave Group" action.
- Empty state: Not applicable.
- Retry behavior: Allow user to retry if request timed out.
- Cache invalidation: Remove group from the user's active groups feed and navigate to home tab.
- Side effects: Deletes member record from `group_members` collection and broadcasts departure event to the room.
- Related realtime events: `group.member_left`.

## Related Endpoints

- [Delete Group](./delete-group.md)
- [Get All Groups](./get-all-groups.md)
