---
id: soft-delete-thread
title: Soft Delete Thread
---

# Soft Delete Thread

Soft deletes a discussion thread by setting its `isDeleted` flag to true and recording the deletion timestamp while preserving reply history for integrity.

## Endpoint

- **Method:** `DELETE`
- **URL:** `/api/v1/thread/:threadId/delete/soft`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- The user must be a member of the group containing the thread and have permission to delete the thread (author or group administrator).

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| threadId | string | Yes | Unique 24-character hex MongoDB ObjectId of the thread. |

### Example Request

```http
DELETE /api/v1/thread/671e3d5b8f1a2c3d4e5f6a7b/delete/soft HTTP/1.1
Host: api.suffa.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource deleted successfully",
  "data": {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  },
  "timestamp": "2026-10-28T00:29:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.acknowledged | boolean | No | MongoDB acknowledgment of write operation. |
| data.modifiedCount | integer | No | Count of documents soft-deleted (`1` on success). |
| data.matchedCount | integer | No | Count of matching documents found. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid thread ID format | Validate thread ID before sending. |
| 401 | Unauthenticated | Redirect user to login. |
| 403 | Forbidden | Access denied; user cannot delete this thread. |
| 409 | Thread not found | Show message that thread was already removed. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "thread not found!",
  "code": 409,
  "cause": "Conflict",
  "timestamp": "2026-10-28T00:29:00.180Z"
}
```

## Frontend Notes

- Loading state: Display deleting spinner or disable interaction on the thread card.
- Empty state: N/A.
- Retry behavior: Safe to retry.
- Cache invalidation: Remove the thread from active thread lists (`GET /api/v1/thread/all/:conversationId`).
- Side effects: Thread status changes to `isDeleted: true`; replies remain visible with tombstone author info.
- Related realtime events: `thread.deleted` event emitted across group channel.

## Related Endpoints

- [Hard Delete Thread](./hard-delete-thread.md)
- [Get All Threads](./get-all-threads.md)
