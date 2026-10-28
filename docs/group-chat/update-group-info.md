---
id: update-group-info
title: Update Group Info
---

# Update Group Info

Modifies the name and description for an existing group channel.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/:groupId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The authenticated user must hold an **admin** or **owner** role within the group.

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
| name | string | No | 3–50 chars | Updated group title |
| description | string | No | 10–500 chars | Updated group description |

### Example Request

```json
{
  "name": "Suffa Developers Official",
  "description": "An official suffa group for help, updates, and open-source contributions."
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "6a4e2d25c11e524921cb6fcd",
    "name": "Suffa Developers Official",
    "description": "An official suffa group for help, updates, and open-source contributions.",
    "updatedAt": "2026-02-04T13:15:00.000Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | Group identifier |
| data.name | string | No | Updated group name |
| data.description | string | Yes | Updated description |
| data.updatedAt | string | No | Update timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Validation error (e.g. name too short) | Display character constraint feedback |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (non-admin member) | Show "Only admins can change group settings" |
| 404 | Group not found | Return to groups view |
| 500 | Server error | Show update error alert |

```json
{
  "message": [
    "name must be longer than or equal to 3 characters"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Disable submit button and display saving spinner.
- Empty state: Pre-fill input fields with existing group title and description.
- Retry behavior: Allow immediate re-submission on network failure.
- Cache invalidation: Mutate local group state and notify components.
- Side effects: Emits group updated event across WebSocket to all members.
- Related realtime events: `group.info_updated`.

## Related Endpoints

- [Get Group By ID](./get-group-by-id.md)
- [Update Group Image](./update-group-image.md)
- [Add Admin](./add-admin.md)
