---
id: toggle-reaction
title: Toggle Emoji Reaction
---

# Toggle Emoji Reaction

Adds or removes an emoji reaction on a target entity (message, post, or feed item) for the authenticated user.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/reaction/:entityType/:entityId/:emoji`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- User must have read/interact access to the target entity.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| entityType | string | Yes | Target entity type. Must be one of: `message`, `post`, `feed`. |
| entityId | string | Yes | Unique identifier of the target entity (e.g. message ObjectId). |
| emoji | string | Yes | Unicode emoji character or identifier (e.g. `👍`, `❤️`, `🔥`). |

### Example Request

```http
POST /api/v1/reaction/message/671e3d5b8f1a2c3d4e5f6a7b/%F0%9F%91%8D HTTP/1.1
Host: api.suffa.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "action": "ADDED"
  },
  "timestamp": "2026-10-28T00:35:00.120Z"
}
```

#### Alternate State: `REMOVED`

When toggling an emoji that the user had previously reacted with:

```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "action": "REMOVED"
  },
  "timestamp": "2026-10-28T00:35:05.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful toggle. |
| message | string | No | Response descriptor. |
| data.action | string | No | Reaction result action: `"ADDED"` if reaction was newly added, or `"REMOVED"` if an existing reaction was retracted. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid entity type or parameters | Verify that `entityType` is one of `message`, `post`, `feed` and emoji is valid. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | User does not have access to react to this entity. |
| 404 | Entity not found | Show entity unavailable prompt. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": [
    "entityType must be one of the following values: message, post, feed"
  ],
  "code": 400,
  "cause": "Bad Request",
  "timestamp": "2026-10-28T00:35:00.180Z"
}
```

## Frontend Notes

- Loading state: Optimistically increment or decrement the reaction badge count and toggle active highlight on the emoji button.
- Empty state: N/A.
- Retry behavior: Toggling is state-dependent; if an optimistic toggle fails, roll back UI badge state to match server.
- Cache invalidation: Update the entity's reaction summary cache (`GET /api/v1/reaction/:entityType/:entityId/summary`).
- Side effects: Writes to Redis reaction cache, updates MongoDB reaction record, and fires internal event.
- Related realtime events: `reaction.add` and `reaction.remove` broadcasted to all viewers of the entity.

## Related Endpoints

- [Get Reaction Summary](./get-reaction-summary.md)
- [Get Reaction Users](./get-reaction-users.md)
