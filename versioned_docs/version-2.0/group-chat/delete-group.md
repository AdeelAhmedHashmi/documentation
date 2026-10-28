---
id: delete-group
title: Delete Group
---

# Delete Group

Permanently dissolves and deletes a group channel, removing all members and group history.

## Endpoint

- **Method:** `DELETE`
- **URL:** `/api/v1/group/:groupId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Only the **group owner** has the authority to permanently delete the group.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| groupId | string | Yes | The MongoDB ObjectID of the group to delete |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
DELETE /api/v1/group/6a4e2d25c11e524921cb6fcd HTTP/1.1
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
    "deleted": true,
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
| data.deleted | boolean | No | Deletion confirmation |
| data.groupId | string | No | Dissolved group ID |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (non-owner attempting deletion) | Show "Only the group owner can delete this group" alert |
| 404 | Group not found | Return to group list |
| 500 | Server error | Show deletion failure alert |

```json
{
  "message": "only owner can delete the group",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display blocking confirmation modal with destructive action warning.
- Empty state: Not applicable.
- Retry behavior: Allow user to retry if connection dropped.
- Cache invalidation: Remove group from client channels list and navigate to chat home.
- Side effects: Broadcasts `group.deleted` event via WebSocket to evict all connected members from the room.
- Related realtime events: `group.deleted`.

## Related Endpoints

- [Leave Group](./leave-group.md)
- [Create Group](./create-group.md)
