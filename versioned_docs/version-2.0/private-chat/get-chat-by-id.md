---
id: get-chat-by-id
title: Get Chat By ID
---

# Get Chat By ID

Retrieves details and participants of a specific private chat conversation by its conversation ID, verifying membership authorization.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/chat/:chatId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The authenticated user must be one of the participants in the chat, otherwise an authorization error is returned.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| chatId | string | Yes | The MongoDB ObjectID of the private chat |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
GET /api/v1/chat/69ba7f6e50cd343ab59f1c30 HTTP/1.1
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
    "id": "69ba7f6e50cd343ab59f1c30",
    "unreadCount": 0,
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
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.id | string | No | Conversation ID |
| data.unreadCount | number | No | Unread message count |
| data.participants | array | No | User profile objects of both participants |
| data.lastMessage | object | Yes | Last message preview |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden / Not a chat participant | Show access restricted alert |
| 404 | Chat not found | Show conversation unavailable screen |
| 500 | Server error | Show standard error toast |

```json
{
  "message": "unauthorized access to chat",
  "code": 403,
  "data": {
    "message": "unauthorized access to chat",
    "error": "Forbidden",
    "statusCode": 403
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render chat room top header skeleton.
- Empty state: Not applicable.
- Retry behavior: Re-query on connection re-establishment.
- Cache invalidation: Cache conversation participant state.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Get All Chats](./get-all-chats.md)
- [Get Messages](../messages/get-messages.md)
- [Send Conversation Message](../messages/send-conversation-message.md)
