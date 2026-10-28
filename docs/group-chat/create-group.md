---
id: create-group
title: Create Group
---

# Create Group

Creates a new group conversation channel, assigning the caller as group owner and super admin.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/group`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. The authenticated user is automatically enrolled as the owner with admin permissions.

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
| name | string | Yes | 1–100 chars | Group display name |
| description | string | No | Max 500 chars | Description of the group purpose |
| circleId | string | No | MongoDB ObjectID | Parent circle ID if associated with a circle |
| type | string | No | GroupType enum | Group category |
| scope | string | No | GroupScope enum | Access scope |
| image | string | No | String | Cloudinary media image URL |
| visibility | boolean | No | `true` or `false` | Discoverability in public searches |

### Example Request

```json
{
  "name": "Suffa Developers Community",
  "description": "Official community for developers building on the Suffa ecosystem.",
  "visibility": true
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "6a4e2d25c11e524921cb6fcd",
    "name": "Suffa Developers Community",
    "description": "Official community for developers building on the Suffa ecosystem.",
    "owner": "69831b4bc58eff75b4210b8e",
    "invitationCode": "013131b9-dd2a-48b9-b4f9-54bf4b5d1046",
    "infoCode": "364585",
    "visibility": true,
    "createdAt": "2026-02-04T13:00:00.000Z",
    "updatedAt": "2026-02-04T13:00:00.000Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | Group unique identifier |
| data.name | string | No | Group name |
| data.description | string | Yes | Group description |
| data.owner | string | No | User ID of group creator |
| data.invitationCode | string | No | Secret UUID for invite links |
| data.infoCode | string | No | Numeric short code |
| data.createdAt | string | No | Creation timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid group name or parameters | Show validation message |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show group creation error alert |

```json
{
  "message": [
    "name should not be empty"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Show modal spinner with "Creating group...".
- Empty state: Not applicable.
- Retry behavior: Allow re-submission if network fails.
- Cache invalidation: Prepend new group to the user's groups list.
- Side effects: Creates group record, adds owner to `group_members`, and initializes invitation codes.
- Related realtime events: `group.created`.

## Related Endpoints

- [Get All Groups](./get-all-groups.md)
- [Get Group By ID](./get-group-by-id.md)
- [Update Group Info](./update-group-info.md)
- [Add Members](./add-members.md)
