---
id: get-thread-replies
title: Get Thread Direct Replies
---

# Get Thread Direct Replies

Fetches paginated direct replies for a specific parent message within a discussion thread.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/thread/message/:threadId/:parentId/replies`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- User must be a member of the group where the thread is hosted.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| threadId | string | Yes | Unique 24-character hex MongoDB ObjectId of the thread. |
| parentId | string | Yes | Unique 24-character hex MongoDB ObjectId of the parent comment being expanded. |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| sort | string | No | `top` | Sort order for replies. Options: `top`, `new`, `old`. |
| cursor | string | No | `null` | Base64 pagination cursor returned from previous page. |
| limit | integer | No | 10 | Maximum number of replies to return per page. |

### Example Request

```http
GET /api/v1/thread/message/671e3d5b8f1a2c3d4e5f6a7b/671e3d998f1a2c3d4e5f6a90/replies?sort=top&limit=10 HTTP/1.1
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
    "replies": [
      {
        "_id": "671e3df08f1a2c3d4e5f6aa1",
        "threadId": "671e3d5b8f1a2c3d4e5f6a7b",
        "sender": "651a2b3c4d5e6f7a8b9c0d99",
        "content": "That would be awesome! We need water bottles mostly.",
        "parentId": "671e3d998f1a2c3d4e5f6a90",
        "depth": 1,
        "path": "0001.0001",
        "pathIndex": "0001.0001",
        "score": 4,
        "upvotes": 4,
        "downvotes": 0,
        "replyCount": 1,
        "isDeleted": false,
        "isEdited": false,
        "createdAt": "2026-10-28T00:20:00.000Z",
        "updatedAt": "2026-10-28T00:20:00.000Z"
      }
    ],
    "nextCursor": null,
    "hasMore": false
  },
  "timestamp": "2026-10-28T00:33:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful retrieval. |
| message | string | No | Response descriptor. |
| data.replies | array | No | List of reply message objects. |
| data.replies[]._id | string | No | Unique message ID of the reply. |
| data.replies[].threadId | string | No | Parent thread ID. |
| data.replies[].sender | string | No | Author user ID. |
| data.replies[].content | string | Yes | Reply text content. |
| data.replies[].parentId | string | No | Parent message ID. |
| data.replies[].depth | integer | No | Nesting depth level. |
| data.replies[].score | integer | No | Net voting score. |
| data.replies[].replyCount | integer | No | Direct replies under this reply. |
| data.replies[].isDeleted | boolean | No | Soft deletion status. |
| data.nextCursor | string | Yes | Cursor for the next page of replies (`null` if last page). |
| data.hasMore | boolean | No | Whether more replies exist under this parent message. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid thread or parent ID | Check parameter values. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | User lacks access to this thread. |
| 404 | Parent message not found | Display unavailable message state. |
| 500 | Server error | Show retry option. |

```json
{
  "message": "Invalid parameter ID",
  "code": 400,
  "cause": "Bad Request",
  "timestamp": "2026-10-28T00:33:00.180Z"
}
```

## Frontend Notes

- Loading state: Show small inline loader under the expanded comment thread.
- Empty state: Hide "Load more replies" button when `hasMore` is false.
- Retry behavior: Safe to retry.
- Cache invalidation: Append loaded replies to the parent message's cached reply set.
- Side effects: None.
- Related realtime events: `thread.message.created`.

## Related Endpoints

- [Get Thread Root Messages](./get-thread-root-messages.md)
- [Post Thread Message or Reply](./create-thread-message.md)
- [Delete Thread Message](./delete-thread-message.md)
