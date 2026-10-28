---
id: get-thread-by-id
title: Get Thread by ID
---

# Get Thread by ID

Fetches detailed information for a specific discussion thread, including its author profile, vote metrics, attachments, and current state.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/thread/:threadId`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- The user must belong to the group associated with the thread.

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
GET /api/v1/thread/671e3d5b8f1a2c3d4e5f6a7b HTTP/1.1
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
    "id": "671e3d5b8f1a2c3d4e5f6a7b",
    "conversationId": "651a2b3c4d5e6f7a8b9c0d1e",
    "author": {
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
    },
    "title": "Weekend Community Volunteer Schedule",
    "content": "Please share your availability for this coming Saturday's community cleanup drive.",
    "attachments": [
      {
        "id": "671e3d5a8f1a2c3d4e5f6a70",
        "url": "https://res.cloudinary.com/suffa/image/upload/v1/suffa/groups/group_651a2b3c/flyer.jpg",
        "type": "IMAGE",
        "size": 1048576,
        "width": 1200,
        "height": 800
      }
    ],
    "totalReplies": 14,
    "score": 8,
    "upvotes": 10,
    "downvotes": 2,
    "isDeleted": false,
    "isEdited": false,
    "isLocked": false,
    "isPinned": false,
    "isHidden": false,
    "deletedAt": null,
    "lastActivityAt": "2026-10-28T00:20:00.000Z",
    "meta": {},
    "createdAt": "2026-10-28T00:10:00.000Z"
  },
  "timestamp": "2026-10-28T00:27:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.id | string | No | Unique thread ID. |
| data.conversationId | string | No | Parent group conversation ObjectId. |
| data.author | object | No | Thread author profile object (`RUser`). |
| data.title | string | Yes | Title/subject of the thread. |
| data.content | string | Yes | Textual content of the thread. |
| data.attachments | array | No | Array of media attachments (`RMedia`). |
| data.totalReplies | integer | No | Total count of root comments and nested replies. |
| data.score | integer | No | Net voting score (`upvotes - downvotes`). |
| data.upvotes | integer | No | Total upvotes count. |
| data.downvotes | integer | No | Total downvotes count. |
| data.isDeleted | boolean | No | Whether the thread has been soft-deleted. |
| data.isEdited | boolean | No | Whether original title/content was modified. |
| data.isLocked | boolean | No | If locked, prevents adding new messages or replies. |
| data.isPinned | boolean | No | Indicates if thread is pinned in the group. |
| data.isHidden | boolean | No | Indicates moderation hiding flag. |
| data.deletedAt | string | Yes | Date string if deleted. |
| data.lastActivityAt | string | No | Timestamp of latest thread activity. |
| data.meta | object | No | Arbitrary thread metadata. |
| data.createdAt | string | No | Creation date timestamp. |
| timestamp | string | No | Envelope response timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid thread ID format | Validate ObjectId before making request. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | User is not a member of the group where this thread resides. |
| 404 | Thread not found | Show thread removed or not found screen. |
| 500 | Server error | Show retry option. |

```json
{
  "message": "thread not found!",
  "code": 409,
  "cause": "Conflict",
  "timestamp": "2026-10-28T00:27:00.180Z"
}
```

## Frontend Notes

- Loading state: Display discussion thread skeleton with banner, author card, and comments placeholder.
- Empty state: If `attachments` or `content` are empty, handle graceful display according to thread type.
- Retry behavior: Safe to retry.
- Cache invalidation: Update thread details in local cache when updated or deleted.
- Side effects: None.
- Related realtime events: Listen for `thread.reaction`, `thread.comment`, `thread.updated`.

## Related Endpoints

- [Get All Threads](./get-all-threads.md)
- [Update Thread](./update-thread.md)
- [Get Thread Root Messages](../thread-messages/get-thread-root-messages.md)
