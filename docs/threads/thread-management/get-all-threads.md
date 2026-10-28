---
id: get-all-threads
title: Get All Threads in Group
---

# Get All Threads in Group

Retrieves a paginated list of discussion threads belonging to a group conversation, ordered by pinned status and latest activity.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/thread/all/:conversationId`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- The authenticated user must be an active member of the target group.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| conversationId | string | Yes | Group conversation MongoDB ObjectId. |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| limit | integer | No | 10 | Maximum number of threads to return per page. |
| cursor | string | No | `null` | Base64-encoded pagination cursor returned from the previous page. |

### Example Request

```http
GET /api/v1/thread/all/651a2b3c4d5e6f7a8b9c0d1e?limit=10 HTTP/1.1
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
    "threads": [
      {
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
        "attachments": [],
        "totalReplies": 14,
        "score": 8,
        "upvotes": 10,
        "downvotes": 2,
        "isDeleted": false,
        "isEdited": false,
        "isLocked": false,
        "isPinned": true,
        "isHidden": false,
        "deletedAt": null,
        "lastActivityAt": "2026-10-28T00:20:00.000Z",
        "meta": {},
        "createdAt": "2026-10-28T00:10:00.000Z"
      }
    ],
    "nextCursor": "eyJpc1Bpbm5lZCI6ZmFsc2UsImxhc3RBY3Rpdml0eUF0IjoiMjAyNi0xMC0yOFQwMDoyMDowMC4wMDBaIiwiX2lkIjoiNjcxZTNkNWI4ZjFhMmMzZDRlNWY2YTdiIn0="
  },
  "timestamp": "2026-10-28T00:26:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful retrieval. |
| message | string | No | Response descriptor. |
| data.threads | array | No | List of thread summary items. |
| data.threads[].id | string | No | Unique thread ID. |
| data.threads[].conversationId | string | No | Group conversation ID. |
| data.threads[].author | object | No | Author profile details (`RUser`). |
| data.threads[].title | string | Yes | Thread title. |
| data.threads[].content | string | Yes | Main body text. |
| data.threads[].attachments | array | No | Array of media attachments (`RMedia`). |
| data.threads[].totalReplies | integer | No | Total count of root comments and nested replies. |
| data.threads[].score | integer | No | Net score rating (`upvotes - downvotes`). |
| data.threads[].upvotes | integer | No | Total upvotes count. |
| data.threads[].downvotes | integer | No | Total downvotes count. |
| data.threads[].isDeleted | boolean | No | Whether the thread was soft deleted. |
| data.threads[].isEdited | boolean | No | Whether the thread content was modified. |
| data.threads[].isLocked | boolean | No | If locked, new replies cannot be posted. |
| data.threads[].isPinned | boolean | No | If pinned, pinned threads appear at the top. |
| data.threads[].isHidden | boolean | No | Moderation flag. |
| data.threads[].deletedAt | string | Yes | Timestamp of soft-deletion. |
| data.threads[].lastActivityAt | string | No | Timestamp of latest reply or update. |
| data.threads[].meta | object | No | Custom thread metadata dictionary. |
| data.threads[].createdAt | string | No | ISO 8601 thread creation date. |
| data.nextCursor | string | Yes | Opaque cursor token for subsequent page. `null` if no more threads. |
| timestamp | string | No | ISO 8601 timestamp of response envelope. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid conversation ID or malformed cursor | Verify URL parameters and reset pagination state. |
| 401 | Unauthenticated | Redirect user to login. |
| 403 | Forbidden | Display group access required prompt. |
| 404 | Group not found | Display unavailable conversation state. |
| 500 | Server error | Show retry banner. |

```json
{
  "message": "Group conversation not found or access denied",
  "code": 403,
  "cause": "Forbidden",
  "timestamp": "2026-10-28T00:26:00.200Z"
}
```

## Frontend Notes

- Loading state: Render skeleton cards for thread previews.
- Empty state: Show empty discussion screen with "Start the first thread" button.
- Retry behavior: Safe to auto-retry on 5xx or network disconnects.
- Cache invalidation: Refresh when a new thread is created or when real-time thread events occur.
- Side effects: None (read-only query).
- Related realtime events: Listen for `thread.created`, `thread.updated`, `thread.deleted`.

## Related Endpoints

- [Create Discussion Thread](./create-thread.md)
- [Get Thread by ID](./get-thread-by-id.md)
