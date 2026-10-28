---
id: delete-social-link
title: Delete Social Link
---

# Delete Social Link

Removes a specific social media link from the authenticated user's profile by its URL.

## Endpoint

- **Method:** `DELETE`
- **URL:** `/api/v1/user/profile/social-links`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Users can only remove links from their own profile.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| link | string | Yes | None | The exact URL string of the social link to delete (URL-encoded) |

### Request Body

None.

### Example Request

```http
DELETE /api/v1/user/profile/social-links?link=https%3A%2F%2Fgithub.com%2Fsuffa HTTP/1.1
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
    "result": "ok"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates successful deletion |
| message | string | No | Response message |
| data.result | string | No | Result confirmation status |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Missing `link` query parameter | Ensure query parameter is supplied and encoded |
| 401 | Unauthenticated | Redirect to login |
| 404 | Link not found in profile | Refresh social links list |
| 500 | Server error | Show deletion failure toast |

```json
{
  "message": [
    "link should not be empty"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim or render inline spinner next to the specific link badge being removed.
- Empty state: If last social link is deleted, show "No social links" placeholder.
- Retry behavior: Re-try deletion if request failed.
- Cache invalidation: Optimistically remove link from client state and rollback on error.
- Side effects: Pulls item from `socialLinks` array in user's MongoDB record.
- Related realtime events: None.

## Related Endpoints

- [Add Social Links](./add-social-links.md)
- [Get My Profile](../get-my-profile.md)
