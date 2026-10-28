---
id: remove-admin
title: Remove Admin
---

# Remove Admin

Demotes an administrator back to a standard group member, revoking administrative permissions.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/admin/remove`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The caller must be the **group owner** (or an authorized admin). Cannot demote the group owner.

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
| userId | string | Yes | MongoDB ObjectID | The admin member to demote |

### Example Request

```json
{
  "groupId": "69b8295e4eb53689e88e4fed",
  "userId": "69b824284eb53689e88e4fd7"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "demoted": true,
    "userId": "69b824284eb53689e88e4fd7",
    "role": "member"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.demoted | boolean | No | Demotion confirmation flag |
| data.userId | string | No | Target user ID |
| data.role | string | No | Updated role designation (`member`) |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Attempting to demote owner or target is not an admin | Show error notice |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden | Show "Only group owner can demote admins" |
| 404 | User or group not found | Refresh member list |
| 500 | Server error | Show demotion error alert |

```json
{
  "message": "cannot demote group owner",
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim action button and show spinner on member tile.
- Empty state: Not applicable.
- Retry behavior: Allow user to retry on failure.
- Cache invalidation: Update member's role badge in local state to "Member".
- Side effects: Broadcasts `group.admin_removed` notification to all room subscribers.
- Related realtime events: `group.admin_removed`.

## Related Endpoints

- [Add Admin](./add-admin.md)
- [Get Active Members](./get-active-members.md)
