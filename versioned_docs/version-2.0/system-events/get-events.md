---
id: get-events
title: Get Conversation System Events
---

# Get Conversation System Events

Retrieves a paginated timeline of conversation-scoped system events (delivery receipts, membership changes, moderation events) used for offline client synchronization.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/system-events/:conversationId`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- User must be a participant in the conversation or the intended event target.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| conversationId | string | Yes | Unique 24-character hex MongoDB ObjectId of the target conversation. |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| limit | integer | No | 10 | Maximum number of events to return per batch. |
| cursor | string | No | `null` | ISO 8601 date timestamp cursor from the previous page for forward pagination. |

### Example Request

```http
GET /api/v1/system-events/651a2b3c4d5e6f7a8b9c0d1e?limit=20 HTTP/1.1
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
    "events": [
      {
        "_id": "671e3ea08f1a2c3d4e5f6b22",
        "type": "MESSAGE_DELIVERED",
        "conversationId": "651a2b3c4d5e6f7a8b9c0d1e",
        "userId": "651a2b3c4d5e6f7a8b9c0d1e",
        "targetUserId": "651a2b3c4d5e6f7a8b9c0d99",
        "entityId": "671e3ea08f1a2c3d4e5f6b15",
        "entityType": "message",
        "version": 1,
        "payload": {
          "deliveredAt": "2026-10-28T00:43:00.000Z"
        },
        "isDelievered": true,
        "meta": {
          "source": "api",
          "deviceId": "dev_pixel9_abc123"
        },
        "createdAt": "2026-10-28T00:43:00.000Z",
        "updatedAt": "2026-10-28T00:43:00.000Z"
      }
    ],
    "hasMore": false,
    "nextCursor": null
  },
  "timestamp": "2026-10-28T00:43:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful retrieval. |
| message | string | No | Response descriptor. |
| data.events | array | No | Array of system event documents. |
| data.events[]._id | string | No | Unique event record identifier. |
| data.events[].type | string | No | Event type identifier (e.g. `MESSAGE_DELIVERED`, `MEMBER_JOINED`). |
| data.events[].conversationId | string | Yes | Associated conversation ObjectId. |
| data.events[].userId | string | Yes | Actor user ID who triggered or owns the event. |
| data.events[].targetUserId | string | Yes | Target user ID for direct messages or peer events. |
| data.events[].entityId | string | Yes | Associated entity ID (e.g. messageId, chatId). |
| data.events[].entityType | string | Yes | Target entity category (`message`, `chat`, etc.). |
| data.events[].version | integer | No | Event schema version number. |
| data.events[].payload | object | Yes | Arbitrary event-specific payload payload. |
| data.events[].isDelievered | boolean | No | Event delivery status acknowledgment. |
| data.events[].meta | object | Yes | Tracing metadata (source, deviceId, userAgent, ip). |
| data.events[].createdAt | string | No | Timestamp of event occurrence. |
| data.hasMore | boolean | No | Whether additional historical events exist. |
| data.nextCursor | string | Yes | Timestamp of the oldest event returned, passed as `cursor` for subsequent batches. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid conversation ID | Verify ID parameter. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 403 | Forbidden | User does not have access to conversation events. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "conversationId must be a mongodb id",
  "code": 400,
  "cause": "Bad Request",
  "timestamp": "2026-10-28T00:43:00.180Z"
}
```

## Frontend Notes

- Loading state: Run quietly in background sync service or web worker.
- Empty state: Normal state when all events are up-to-date (`events: []`).
- Retry behavior: Safe to poll periodically or retry with exponential backoff on network drop.
- Cache invalidation: Local SQLite / indexedDB client stores should append new events and mark offline queues as synced.
- Side effects: None (read query).
- Related realtime events: WebSockets/Push notifications notify the client to trigger this endpoint when re-establishing connection.

## Related Endpoints

- [Get Messages](../messages/get-messages.md)
- [Get Synced Contacts](../user-contacts/get-synced-contacts.md)
