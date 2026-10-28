---
id: create-thread-message
title: Post Thread Message or Reply
---

# Post Thread Message or Reply

Posts a new root comment or a nested reply to an existing message within a discussion thread.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/thread/message`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

- Requires a valid Bearer access token.
- The user must be a member of the group where the thread is hosted.
- If the thread is locked, replies cannot be posted.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |
| Content-Type | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| threadId | string | Yes | Valid MongoDB ObjectId | The ID of the discussion thread. |
| content | string | No | String | The textual content or markdown of the comment or reply. |
| parentId | string | No | Valid MongoDB ObjectId or `null` | The parent message ID to reply to. Omit or set to `null` to create a top-level root comment. |

### Example Request

```json
{
  "threadId": "671e3d5b8f1a2c3d4e5f6a7b",
  "content": "I can bring extra trash bags and protective gloves for everyone!",
  "parentId": "671e3d998f1a2c3d4e5f6a90"
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "_id": "671e3df08f1a2c3d4e5f6aa1",
    "threadId": "671e3d5b8f1a2c3d4e5f6a7b",
    "sender": "651a2b3c4d5e6f7a8b9c0d1e",
    "content": "I can bring extra trash bags and protective gloves for everyone!",
    "parentId": "671e3d998f1a2c3d4e5f6a90",
    "depth": 1,
    "path": "0001.0002",
    "pathIndex": "0001.0002.0001",
    "score": 0,
    "upvotes": 0,
    "downvotes": 0,
    "replyCount": 0,
    "isDeleted": false,
    "isEdited": false,
    "createdAt": "2026-10-28T00:31:00.000Z",
    "updatedAt": "2026-10-28T00:31:00.000Z"
  },
  "timestamp": "2026-10-28T00:31:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data._id | string | No | Unique ID of the created thread message. |
| data.threadId | string | No | Thread ID reference. |
| data.sender | string | No | User ID of the sender. |
| data.content | string | Yes | Message text content. |
| data.parentId | string | Yes | Parent message ID if this is a reply (`null` for root comments). |
| data.depth | integer | No | Hierarchy nesting depth (`0` for root comments, `1` for direct replies, etc.). |
| data.path | string | No | Materialized path hierarchy string for nested comment tree ordering. |
| data.pathIndex | string | No | Lexicographical path index for fast sorting. |
| data.score | integer | No | Net voting score (`upvotes - downvotes`). |
| data.upvotes | integer | No | Total upvotes count. |
| data.downvotes | integer | No | Total downvotes count. |
| data.replyCount | integer | No | Number of direct replies under this message. |
| data.isDeleted | boolean | No | Soft-deletion indicator. |
| data.isEdited | boolean | No | Whether the message text has been edited. |
| data.createdAt | string | No | Creation timestamp. |
| data.updatedAt | string | No | Last update timestamp. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Validation error | Check thread ID format and required fields. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | User is not a member of the thread's group. |
| 409 | Thread or parent message not found | Display error indicating target thread or parent reply was removed. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "thread not found!",
  "code": 409,
  "cause": "Conflict",
  "timestamp": "2026-10-28T00:31:00.200Z"
}
```

## Frontend Notes

- Loading state: Optimistically append comment to the thread tree with a sending indicator.
- Empty state: Disable send button when input field is empty.
- Retry behavior: Safe to retry if optimistic message failed to send.
- Cache invalidation: Increment `totalReplies` on the parent thread in cache and append new message to the active reply list.
- Side effects: Updates parent message `replyCount` and thread's `lastActivityAt`.
- Related realtime events: Broadcasts `thread.message.created` to group members.

## Related Endpoints

- [Get Thread Root Messages](./get-thread-root-messages.md)
- [Get Thread Direct Replies](./get-thread-replies.md)
- [Delete Thread Message](./delete-thread-message.md)
