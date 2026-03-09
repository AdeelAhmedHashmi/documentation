---
id: private-message
title: Send Message To User
---

# Private Message

Send a private (1:1) message to a specific user. This endpoint validates the sender, ensures both users are allowed to talk, optionally attaches media, and returns the newly created message.

---

## Endpoint

`POST /message/send/:userId`

**Headers**:

- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `userId` Receiver user id (MongoId).

**Request Body**:

```json
{
  "content": "Hello there",
  "type": "text",
  "mediaGroupId": "uuid",
  "sequenceIndex": 0,
  "attachment": [{ "publicId": "temp/user_123/abc" }]
}
```

- `content` Required. Text content of the message.
- `type` Required. Message type. Allowed values: `text`, `image`, `video`, `file`.
- `mediaGroupId`: Optional. Same group id for message media grouping.
- `sequenceIndex`: Required(In case of mediaGroupId). User to trach Sequence of Media in a message group.
- `attachment` requires `publicId` and `fileType`.

> ### To see possible values of fileType in attachment see `Media Schema`

---

## Example cURL Request

```bash
curl -X POST "{{baseUrl}}/message/send/{{userId}}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "content": "Hello there",
    "type": "text",
    "mediaGroupId": "uuid",
    "sequenceIndex": 0,
    "attachment": { "publicId": "temp/user_123/abc", fileType: "image" }
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "conversationId": "<chatId>",
    "senderId": "<senderId>",
    "type": "text",
    "content": "Hello there",
    "mediaGroupId": "uuid",
    "sequenceIndex": 0,
    "attachment": {
      "storageKey": "message_media/abc123",
      "url": "https://res.cloudinary.com/demo/image/upload/v1/message_media/abc123.jpg",
      "type": "image",
      "ownerType": "message",
      "provider": "CLOUDINARY",
      "width": 1920,
      "height": 1080,
      "size": 348120
    },
    "deliveredTo": [],
    "seenBy": [],
    "isDeleted": false,
    "_id": "<messageId>",
    "createdAt": "2026-02-06T12:37:51.523Z",
    "updatedAt": "2026-02-06T12:37:51.523Z"
  },
  "timestamp": "2026-02-06T12:37:51.549Z"
}
```

---

## Notes

- Authentication is required. Requests without a valid token are rejected.
- `userId` must be a valid MongoId.
- `content` and `type` are required even if `attachment` is included.
- If the receiver has blocked the sender, the request fails.
- If the sender has blocked the receiver, the request fails.
- The system ensures a private chat exists between the two users before sending.
- Any unknown fields in the body are rejected by validation.
- Media items are promoted from temporary storage; invalid attachment references will fail the request.

---

## Error Cases

- `400 Bad Request`
  - Invalid `userId` or invalid payload
  - Sender attempts to message self
  - Blocked relationship detected
  - Invalid `type` or missing required fields
- `401 Unauthorized`
  - Missing or invalid token
  - Suspended or inactive account
  - Untrusted device
- `500 Internal Server Error`
  - Media promotion failed when media was provided
