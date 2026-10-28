---
id: get-all-chats
title: Get All Chats
---

# Get All Chats

Retrieves a paginated list of private 1-on-1 conversations for the authenticated user, including participant info, unread counts, and last message previews.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/chat`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token and trusted device session. Users only receive conversations in which they are a verified participant.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| page | integer | No | `0` | Zero-indexed page number |
| limit | integer | No | `40` | Maximum number of conversations to retrieve |

### Request Body

None.

### Example Request

```http
GET /api/v1/chat?page=0&limit=40 HTTP/1.1
Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "chats": [
      {
        "id": "69ba7f6e50cd343ab59f1c30",
        "unreadCount": 2,
        "participants": [
          {
            "id": "69831b4bc58eff75b4210b8e",
            "firstName": "Adeel",
            "lastName": "Ahmed",
            "avatar": {
              "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/avatar.webp"
            }
          },
          {
            "id": "69a026700812dd821414f341",
            "firstName": "Muhammad",
            "lastName": "Hussain",
            "avatar": null
          }
        ],
        "lastMessage": {
          "id": "69ba7f6e50cd343ab59f1c33",
          "content": "Sounds good, talk soon!",
          "type": "text",
          "senderId": "69a026700812dd821414f341",
          "createdAt": "2026-02-04T12:30:00.000Z"
        }
      }
    ],
    "meta": {
      "currentPage": 0,
      "totalPages": 1,
      "totalRecords": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.chats | array | No | List of conversation objects |
| data.chats[].id | string | No | Conversation ID |
| data.chats[].unreadCount | number | No | Number of unread incoming messages |
| data.chats[].participants | array | No | Array of participating user profiles |
| data.chats[].lastMessage | object | Yes | Latest message preview object |
| data.meta | object | No | Pagination metadata |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show chat list loading error |

```json
{
  "message": "unauthorized request",
  "code": 401,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display conversation list skeleton view with avatar circles and text bars.
- Empty state: Render "No conversations yet. Start a chat with your contacts!".
- Retry behavior: Re-fetch on network recovery or pull-to-refresh.
- Cache invalidation: Update conversation preview when a new incoming message event arrives over WebSocket.
- Side effects: None.
- Related realtime events: `chat.message_received`, `chat.conversation_created`.

## Related Endpoints

- [Get Chat By ID](./get-chat-by-id.md)
- [Send Direct Message](../messages/send-direct-message.md)
- [Get Messages](../messages/get-messages.md)
