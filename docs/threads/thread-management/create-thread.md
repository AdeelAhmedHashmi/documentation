---
id: create-thread
title: Create Discussion Thread
---

# Create Discussion Thread

Creates a new topical discussion thread within a group conversation, supporting markdown content and uploaded media attachments.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/thread/create`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

- Requires a valid Bearer access token with active `userId` and trusted `deviceId`.
- The user must be a member of the group identified by `conversationId`.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |
| Content-Type | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| conversationId | string | Yes | Valid 24-character hex MongoDB ObjectId | The group conversation ID where this thread will be created. |
| title | string | No | Optional string | Headline or subject title for the discussion thread. |
| content | string | Conditional | String (Required if `attachments` is omitted) | Main textual content or question of the thread. |
| attachments | array | Conditional | Array of objects (max 5 items; Required if `content` is omitted) | Pre-uploaded temporary media attachments to attach. |
| attachments[].publicId | string | Yes | Valid Cloudinary temporary asset public ID | Temporary storage public ID obtained from `/media/media-intent`. |

### Example Request

```json
{
  "conversationId": "651a2b3c4d5e6f7a8b9c0d1e",
  "title": "Weekend Community Volunteer Schedule",
  "content": "Please share your availability for this coming Saturday's community cleanup drive.",
  "attachments": [
    {
      "publicId": "suffa/temp/user_651a2b3c4d5e6f7a8b9c0d1e/image/sample_flyer_xyz"
    }
  ]
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "_id": "671e3d5b8f1a2c3d4e5f6a7b",
    "conversationId": "651a2b3c4d5e6f7a8b9c0d1e",
    "author": "651a2b3c4d5e6f7a8b9c0d1e",
    "title": "Weekend Community Volunteer Schedule",
    "content": "Please share your availability for this coming Saturday's community cleanup drive.",
    "attachments": [
      "671e3d5a8f1a2c3d4e5f6a70"
    ],
    "totalReplies": 0,
    "score": 0,
    "upvotes": 0,
    "downvotes": 0,
    "isDeleted": false,
    "isEdited": false,
    "isLocked": false,
    "isPinned": false,
    "isHidden": false,
    "deletedAt": null,
    "lastActivityAt": "2026-10-28T00:25:00.000Z",
    "meta": {},
    "createdAt": "2026-10-28T00:25:00.000Z",
    "updatedAt": "2026-10-28T00:25:00.000Z"
  },
  "timestamp": "2026-10-28T00:25:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data._id | string | No | Unique thread identifier. |
| data.conversationId | string | No | Group conversation ID. |
| data.author | string | No | Creator user ID. |
| data.title | string | Yes | Title of the thread. |
| data.content | string | Yes | Body content of the thread. |
| data.attachments | array | No | Array of created Media ObjectId references. |
| data.totalReplies | integer | No | Initial reply counter (defaults to `0`). |
| data.score | integer | No | Net voting score (`upvotes - downvotes`). |
| data.upvotes | integer | No | Total upvotes count. |
| data.downvotes | integer | No | Total downvotes count. |
| data.isDeleted | boolean | No | Soft delete status flag. |
| data.isEdited | boolean | No | Modification indicator. |
| data.isLocked | boolean | No | Whether replies are locked. |
| data.isPinned | boolean | No | Whether pinned to top of group thread list. |
| data.isHidden | boolean | No | Moderation visibility flag. |
| data.deletedAt | string | Yes | ISO 8601 deletion date if soft-deleted. |
| data.lastActivityAt | string | No | ISO 8601 timestamp of latest thread activity. |
| data.createdAt | string | No | ISO 8601 creation timestamp. |
| data.updatedAt | string | No | ISO 8601 update timestamp. |
| timestamp | string | No | ISO 8601 timestamp of the response envelope. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload or missing required content | Prompt user to provide either text content or at least one attachment. |
| 401 | Unauthenticated | Redirect user to sign in or refresh tokens. |
| 403 | Forbidden | User is not a member of the group. |
| 409 | Group not found | Display error indicating the group conversation does not exist. |
| 500 | Server error | Show generic retry prompt. |

```json
{
  "message": "one is required from content and attachments fields",
  "code": 400,
  "cause": "Bad Request",
  "timestamp": "2026-10-28T00:25:00.150Z"
}
```

## Frontend Notes

- Loading state: Disable submit button and display upload progress if attachments are being promoted.
- Empty state: Validate client-side that at least one of `content` or `attachments` contains valid data before dispatching request.
- Retry behavior: Safe to retry if media upload completed; prevent double submission with unique client interaction locks.
- Cache invalidation: Invalidate thread list cache for the given `conversationId` (`GET /api/v1/thread/all/:conversationId`).
- Side effects: Moves uploaded Cloudinary assets from `suffa/temp/...` to permanent group storage `suffa/groups/group_<id>/...`.
- Related realtime events: Group members may receive real-time notifications of new thread activity.

## Related Endpoints

- [Get All Threads](./get-all-threads.md)
- [Get Thread by ID](./get-thread-by-id.md)
- [Get Upload Signature](../../media-handling/get-upload-signature.md)
