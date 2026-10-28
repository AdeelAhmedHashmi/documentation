---
id: add-admin
title: Add Admin
---

# Add Admin

Promotes an existing active member to group administrator, granting administrative permissions.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/admin/add`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Only the **group owner** or an existing **admin** can promote members to administrators.

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
| userId | string | Yes | MongoDB ObjectID | The member to promote to admin |

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
    "promoted": true,
    "userId": "69b824284eb53689e88e4fd7",
    "role": "admin"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.promoted | boolean | No | Promotion confirmation flag |
| data.userId | string | No | Target user ID |
| data.role | string | No | New role designation (`admin`) |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Target user is already an admin or invalid IDs | Show validation alert |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (caller lacks admin permissions) | Show "Only admins can promote members" |
| 404 | User or group not found | Refresh member list |
| 500 | Server error | Show promotion failure toast |

```json
{
  "message": "unauthorized: only admins can manage admin privileges",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display progress spinner next to candidate member's option menu.
- Empty state: Not applicable.
- Retry behavior: Allow re-trying action.
- Cache invalidation: Update member's role badge in the member list cache to "Admin".
- Side effects: Emits `group.member_promoted` WebSocket notification.
- Related realtime events: `group.member_promoted`.

## Related Endpoints

- [Remove Admin](./remove-admin.md)
- [Get Active Members](./get-active-members.md)
- [Add Members](./add-members.md)
