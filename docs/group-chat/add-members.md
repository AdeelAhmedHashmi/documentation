---
id: add-members
title: Add Members
---

# Add Members

Directly enrolls one or more users into a group channel without requiring an invitation approval workflow.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/:groupId/members/add`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. The caller must be an active **admin** or **owner** of the specified group. Blocked users cannot be added.

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

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| userIds | array | Yes | Min 1 MongoDB ObjectID | List of user IDs to add |

### Example Request

```json
{
  "userIds": [
    "6a4e2a0fc3e58d52269ce809",
    "69a026700812dd821414f341"
  ]
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "joinedUsers": [
      "6a4e2a0fc3e58d52269ce809",
      "69a026700812dd821414f341"
    ]
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.joinedUsers | array | No | Array of user IDs successfully enrolled as active members |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid userIds or empty list | Select at least one valid user |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (caller is not an admin) | Show "Only admins can add members" |
| 404 | Group not found | Return to group list |
| 500 | Server error | Show member addition failure toast |

```json
{
  "message": "unauthorized: only admins can add members",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display modal spinner over contacts picker during addition.
- Empty state: Not applicable.
- Retry behavior: Re-try adding members if network fails.
- Cache invalidation: Refresh group active members list and increment member counter.
- Side effects: Inserts records into `group_members` with `role: 'member'` and emits `group.member_added` WebSocket event.
- Related realtime events: `group.member_added`.

## Related Endpoints

- [Get Active Members](./get-active-members.md)
- [Add Admin](./add-admin.md)
- [Block Member](./block-member.md)
- [Leave Group](./leave-group.md)
