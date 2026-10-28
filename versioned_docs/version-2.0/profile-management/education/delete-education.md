---
id: delete-education
title: Delete Education
---

# Delete Education

Permanently deletes a specific education record from the authenticated user's profile.

## Endpoint

- **Method:** `DELETE`
- **URL:** `/api/v1/user/profile/info/education/:educationId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Users can only delete education records belonging to their own account.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| educationId | string | Yes | The MongoDB ObjectID of the education entry to delete |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
DELETE /api/v1/user/profile/info/education/697dc679f4536661050bdb01 HTTP/1.1
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
| 400 | Invalid education ID format | Show format error alert |
| 401 | Unauthenticated | Redirect to login |
| 404 | Education entry not found | Remove item from local list |
| 500 | Server error | Show deletion failure alert |

```json
{
  "message": "education record not found",
  "code": 404,
  "data": {
    "message": "education record not found",
    "error": "Not Found",
    "statusCode": 404
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim education item card and show delete confirmation spinner.
- Empty state: If last education entry is removed, display empty education card with "+ Add Education".
- Retry behavior: Allow user to retry if network failed.
- Cache invalidation: Optimistically filter out the deleted item from local state.
- Side effects: Deletes document from `educations` collection in MongoDB.
- Related realtime events: None.

## Related Endpoints

- [Create Education](./create-education.md)
- [Get My Educations](./get-my-educations.md)
- [Update Education](./update-education.md)
