---
id: delete-experience
title: Delete Experience
---

# Delete Experience

Permanently deletes a specific work experience record from the authenticated user's profile.

## Endpoint

- **Method:** `DELETE`
- **URL:** `/api/v1/user/profile/info/experience/:experienceId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. Users can only delete experience entries that they personally created.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| experienceId | string | Yes | The MongoDB ObjectID of the experience entry to delete |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
DELETE /api/v1/user/profile/info/experience/697dc679f4536661050bdb01 HTTP/1.1
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
    "deleted": true
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates successful deletion |
| message | string | No | Response message |
| data.deleted | boolean | No | Confirmation flag |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid experience ID | Show format error |
| 401 | Unauthenticated | Redirect to login |
| 404 | Experience entry not found | Remove item from local list |
| 500 | Server error | Show deletion failure alert |

```json
{
  "message": "experience not found",
  "code": 404,
  "data": {
    "message": "experience not found",
    "error": "Not Found",
    "statusCode": 404
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim experience item card and show delete confirmation spinner.
- Empty state: If last experience item is removed, display empty experience placeholder.
- Retry behavior: Prompt user to retry deletion if network disconnected.
- Cache invalidation: Optimistically filter out the deleted item from the local UI state.
- Side effects: Deletes document from `experiences` collection in MongoDB.
- Related realtime events: None.

## Related Endpoints

- [Create Experience](./create-experience.md)
- [Get My Experiences](./get-my-experiences.md)
- [Update Experience](./update-experience.md)
