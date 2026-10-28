---
id: get-thread-root-messages
title: Get Thread Root Messages
---

# Get Thread Root Messages

Fetches paginated top-level root comments for a discussion thread alongside shallow reply previews for each root comment.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/thread/message/:threadId`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- User must be a member of the group where the thread is located.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| threadId | string | Yes | Unique 24-character hex MongoDB ObjectId of the thread. |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| sort | string | No | `top` | Sort order for root messages. Options: `top` (score-ranked), `new` (chronological desc), `old` (chronological asc). |
| cursor | string | No | `null` | Base64 cursor from previous page for infinite scrolling. |
| limit | integer | No | 20 | Maximum number of root messages per page. |
| replylimit | integer | No | 2 | Number of preview replies to eagerly load per root message (maximum `5`). |

### Example Request

```http
GET /api/v1/thread/message/671e3d5b8f1a2c3d4e5f6a7b?sort=top&limit=10&replylimit=2 HTTP/1.1
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
    "messages": [
      {
        "_id": "671e3d998f1a2c3d4e5f6a90",
        "threadId": "671e3d5b8f1a2c3d4e5f6a7b",
        "sender": "651a2b3c4d5e6f7a8b9c0d1e",
        "content": "I can arrange refreshments and drinks for all volunteers.",
        "parentId": null,
        "depth": 0,
        "path": "0001",
        "pathIndex": "0001",
        "score": 12,
        "upvotes": 12,
        "downvotes": 0,
        "replyCount": 3,
        "isDeleted": false,
        "isEdited": false,
        "createdAt": "2026-10-28T00:15:00.000Z",
        "updatedAt": "2026-10-28T00:15:00.000Z"
      }
    ],
    "replies": {
      "671e3d998f1a2c3d4e5f6a90": {
        "replies": [
          {
            "_id": "671e3df08f1a2c3d4e5f6aa1",
            "threadId": "671e3d5b8f1a2c3d4e5f6a7b",
            "sender": "651a2b3c4d5e6f7a8b9c0d99",
            "content": "That would be awesome! We need water bottles mostly.",
            "parentId": "671e3d998f1a2c3d4e5f6a90",
            "depth": 1,
            "path": "0001.0001",
            "score": 4,
            "upvotes": 4,
            "downvotes": 0,
            "replyCount": 0,
            "isDeleted": false,
            "isEdited": false,
            "createdAt": "2026-10-28T00:20:00.000Z",
            "updatedAt": "2026-10-28T00:20:00.000Z"
          }
        ],
        "hasMore": true,
        "nextCursor": "eyJzY29yZSI6NCwiX2lkIjoiNjcxZTNkZjA4ZjFhMmMzZDRlNWY2YWExIn0="
      }
    },
    "nextCursor": "eyJzY29yZSI6MTIsIl9pZCI6IjY3MWUzZDk5OGYxYTJjM2Q0ZTVmNmE5MCJ9",
    "hasMore": false
  },
  "timestamp": "2026-10-28T00:32:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful retrieval. |
| message | string | No | Response descriptor. |
| data.messages | array | No | Array of top-level root comment objects (`depth: 0`). |
| data.messages[]._id | string | No | Unique message ID. |
| data.messages[].threadId | string | No | Parent thread ID. |
| data.messages[].sender | string | No | Author user ID. |
| data.messages[].content | string | Yes | Message text content. |
| data.messages[].parentId | string | Yes | Always `null` for root messages. |
| data.messages[].depth | integer | No | Hierarchy level (`0` for roots). |
| data.messages[].score | integer | No | Net voting score. |
| data.messages[].replyCount | integer | No | Number of total direct replies under this comment. |
| data.messages[].isDeleted | boolean | No | Deletion flag. |
| data.replies | object | No | Dictionary keyed by root comment ID containing preview replies map. |
| data.replies[rootId].replies | array | No | List of preview replies under this root. |
| data.replies[rootId].hasMore | boolean | No | Whether more direct replies exist for this root. |
| data.replies[rootId].nextCursor | string | Yes | Pagination cursor to load next batch of direct replies. |
| data.nextCursor | string | Yes | Cursor for subsequent page of root messages. |
| data.hasMore | boolean | No | Whether additional pages of root comments exist. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid thread ID or query parameter | Check query parameters and thread ID. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | User lacks permission to view discussions in this group. |
| 409 | Reply limit exceeded | `replylimit` exceeds maximum allowed (`5`). Set value $\le 5$. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "reply limit is too high",
  "code": 409,
  "cause": "Conflict",
  "timestamp": "2026-10-28T00:32:00.180Z"
}
```

## Frontend Notes

- Loading state: Display comment thread skeletons.
- Empty state: Show "No comments yet. Be the first to share your thoughts!"
- Retry behavior: Safe to retry idempotent GET requests.
- Cache invalidation: Update when user posts a root comment or expands replies.
- Side effects: None.
- Related realtime events: `thread.message.created`, `reaction.add`, `reaction.remove`.

## Related Endpoints

- [Post Thread Message or Reply](./create-thread-message.md)
- [Get Thread Direct Replies](./get-thread-replies.md)
- [Get Thread by ID](../thread-management/get-thread-by-id.md)
