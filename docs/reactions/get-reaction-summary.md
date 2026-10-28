---
id: get-reaction-summary
title: Get Reaction Summary
---

# Get Reaction Summary

Retrieves the aggregated emoji reaction counts and the current authenticated user's active reactions for a given entity.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/reaction/:entityType/:entityId/summary`
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
| entityType | string | Yes | Type of entity. One of: `message`, `post`, `feed`. |
| entityId | string | Yes | Target entity identifier. |

### Example Request

```http
GET /api/v1/reaction/message/671e3d5b8f1a2c3d4e5f6a7b/summary HTTP/1.1
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
    "counts": {
      "👍": 8,
      "❤️": 5,
      "🔥": 2
    },
    "userReactions": [
      "👍"
    ],
    "total": 15
  },
  "timestamp": "2026-10-28T00:36:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful retrieval. |
| message | string | No | Response descriptor. |
| data.counts | object | No | Key-value dictionary mapping emoji characters to total reaction count. |
| data.userReactions | array | No | Array of emoji strings that the current user has actively reacted with. |
| data.total | integer | No | Sum total of all reactions applied to this entity. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid entity type or ID | Verify parameters. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | Access denied to entity reactions. |
| 404 | Entity not found | Show unavailable state. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": [
    "entityType must be one of the following values: message, post, feed"
  ],
  "code": 400,
  "cause": "Bad Request",
  "timestamp": "2026-10-28T00:36:00.180Z"
}
```

## Frontend Notes

- Loading state: Display reaction pill skeletons beneath the message or post.
- Empty state: Render empty reaction drawer or only the "+" button if `total === 0`.
- Retry behavior: Safe to retry.
- Cache invalidation: Read from cache or update cache on incoming `reaction.add` and `reaction.remove` real-time events.
- Side effects: None (read-only query).
- Related realtime events: `reaction.add`, `reaction.remove`.

## Related Endpoints

- [Toggle Emoji Reaction](./toggle-reaction.md)
- [Get Reaction Users](./get-reaction-users.md)
