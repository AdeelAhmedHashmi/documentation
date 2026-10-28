---
id: get-reaction-users
title: Get Users Who Reacted with Emoji
---

# Get Users Who Reacted with Emoji

Retrieves a paginated list of user profiles who reacted with a specific emoji on a target entity.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/reaction/:entityType/:entityId/:emoji/users`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- User must have permission to view the target entity.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| entityType | string | Yes | Target entity type (`message`, `post`, `feed`). |
| entityId | string | Yes | Unique identifier of the target entity. |
| emoji | string | Yes | Emoji character whose reacting users are being requested (e.g. `👍`). |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| limit | integer | No | 10 | Maximum number of user profiles to return per page. |
| cursor | string | No | `null` | Pagination cursor from the previous page response. |

### Example Request

```http
GET /api/v1/reaction/message/671e3d5b8f1a2c3d4e5f6a7b/%F0%9F%91%8D/users?limit=10 HTTP/1.1
Host: api.suffa.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    "users": [
      {
        "id": "651a2b3c4d5e6f7a8b9c0d1e",
        "firstName": "Zaid",
        "lastName": "Ali",
        "username": "zaidali",
        "phone": "+923001234567",
        "avatar": {
          "id": "671e3d5a8f1a2c3d4e5f6a70",
          "url": "https://res.cloudinary.com/suffa/image/upload/v1/suffa/users/avatar.jpg",
          "type": "IMAGE"
        }
      }
    ],
    "nextCursor": "671e3d998f1a2c3d4e5f6a90"
  },
  "timestamp": "2026-10-28T00:37:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful retrieval. |
| message | string | No | Response descriptor. |
| data.users | array | No | List of reacting user profile objects (`RUser`). |
| data.users[].id | string | No | User ID. |
| data.users[].firstName | string | No | User's first name. |
| data.users[].lastName | string | No | User's last name. |
| data.users[].username | string | No | Unique username handle. |
| data.users[].phone | string | No | Phone number. |
| data.users[].avatar | object | Yes | User avatar media object. |
| data.nextCursor | string | Yes | Opaque cursor token for subsequent page. `null` if no more users. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid entity type or query params | Verify parameters. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | Access denied to view reactions on this entity. |
| 404 | Entity not found | Show unavailable state. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "Invalid entity or emoji parameters",
  "code": 400,
  "cause": "Bad Request",
  "timestamp": "2026-10-28T00:37:00.180Z"
}
```

## Frontend Notes

- Loading state: Display avatar and username placeholder list in reaction modal.
- Empty state: Show "No reactions with this emoji yet."
- Retry behavior: Safe to retry.
- Cache invalidation: Invalidate modal cache when user toggles this reaction emoji.
- Side effects: None.
- Related realtime events: `reaction.add`, `reaction.remove`.

## Related Endpoints

- [Toggle Emoji Reaction](./toggle-reaction.md)
- [Get Reaction Summary](./get-reaction-summary.md)
