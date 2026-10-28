---
id: update-thread
title: Update Thread
---

# Update Thread

Updates the title or text content of an existing discussion thread created by the authenticated user.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/thread/:threadId`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- Only the original author of the thread can update its details.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| threadId | string | Yes | Unique 24-character hex MongoDB ObjectId of the thread. |

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| title | string | No | Optional string | Updated subject or title of the thread. |
| content | string | No | Optional string | Updated markdown or text content of the thread. |

### Example Request

```json
{
  "title": "Updated: Weekend Community Cleanup Drive (Postponed)",
  "content": "Due to weather forecasts, the community cleanup has been moved to Sunday morning at 9:00 AM."
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  },
  "timestamp": "2026-10-28T00:28:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.acknowledged | boolean | No | MongoDB acknowledgment of write operation. |
| data.modifiedCount | integer | No | Number of modified documents (`1` when updated). |
| data.matchedCount | integer | No | Number of matched documents (`1` when found and owned). |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload or thread ID format | Validate inputs client-side before sending. |
| 401 | Unauthenticated | Redirect to login. |
| 403 | Forbidden | User is not the author of this thread. |
| 404 | Thread not found | Show thread not found state. |
| 500 | Server error | Show retry notification. |

```json
{
  "message": "failed to update resource",
  "code": 400,
  "cause": "Bad Request",
  "timestamp": "2026-10-28T00:28:00.180Z"
}
```

## Frontend Notes

- Loading state: Show inline spinner in the edit dialog or card.
- Empty state: Keep submit disabled if neither title nor content has changed.
- Retry behavior: Safe to retry idempotent patch operations.
- Cache invalidation: Update the thread in both detail cache and list cache.
- Side effects: Marks thread as edited (`isEdited: true`).
- Related realtime events: Group members may receive `thread.updated` websocket broadcast.

## Related Endpoints

- [Get Thread by ID](./get-thread-by-id.md)
- [Soft Delete Thread](./soft-delete-thread.md)
