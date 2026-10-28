---
id: hard-delete-thread
title: Permanently Delete Thread
---

# Permanently Delete Thread

Permanently purges a discussion thread from the database, accessible only to the thread's original author.

## Endpoint

- **Method:** `DELETE`
- **URL:** `/api/v1/thread/:threadId/delete/hard`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- Only the original creator/author of the thread can execute a hard deletion.

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
DELETE /api/v1/thread/671e3d5b8f1a2c3d4e5f6a7b/delete/hard HTTP/1.1
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
    "deletedCount": 1
  },
  "timestamp": "2026-10-28T00:30:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.acknowledged | boolean | No | MongoDB acknowledgment of delete execution. |
| data.deletedCount | integer | No | Total count of permanently deleted records (`1` on success). |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid thread ID format | Verify ID before submitting. |
| 401 | Unauthenticated | Redirect user to login. |
| 403 | Forbidden | User is not the author of the thread. |
| 409 | Thread not found | Show message that thread does not exist or was already purged. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "thread not found!",
  "code": 409,
  "cause": "Conflict",
  "timestamp": "2026-10-28T00:30:00.180Z"
}
```

## Frontend Notes

- Loading state: Display warning dialog confirmation before initiating deletion.
- Empty state: N/A.
- Retry behavior: Not recommended to retry without checking whether resource was already deleted.
- Cache invalidation: Immediately remove the thread from all client-side stores, navigation history, and thread lists.
- Side effects: Irreversible removal of thread record.
- Related realtime events: Emits `thread.purged` / `thread.deleted`.

## Related Endpoints

- [Soft Delete Thread](./soft-delete-thread.md)
- [Get All Threads](./get-all-threads.md)
