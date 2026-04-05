---
id: message-on-conversation
title: Message On Conversation
---

# Conversation Messaging

Send a message to a conversation. This endpoint validates the sender, ensures user is a member of conversation. optionally attaches media, and returns the newly created message.

---

## Endpoint

`PATCH /message/send/:conversationId`

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
  "attachment": [
    {
      "publicId": "temp/user_123/abc",
      "fileType": "video",
      "blurhash": "ioerhiehihruiwrhihweirhaskjdoii",
      "thumbnail": "temp/user_123/def"
    }
  ]
}
```

- `content` Required. Text content of the message.
- `type` Required. Message type. Allowed values: `text`, `image`, `video`, `file`.
- `mediaGroupId`: Optional. Same group id for message media grouping.
- `sequenceIndex`: Required(In case of mediaGroupId). User to trach Sequence of Media in a message group.
- `attachment`
  - `publicId`: asset public id.
  - `fileType`: message media types: `image`, `audio`, `video`, `file`.
  - `blurhash`: initial preview of media
  - `thumbnail`: preview of media,
  - `peaks`: string[] audio waves [0.12, 1.2, 2.1, 0.0, 0.6]

> ### To see possible values of fileType in attachment see `Media Schema`

---

## Example cURL Request

```bash
curl -X PATCH "{{baseUrl}}/message/send/{{conversationId}}" \
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
    "conversationId": "<conversationId>",
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
      "thumbnail": "https://res.cloudinary.com/demo/image/upload/v1/message_media/abc123.jpg",
      "blurhash": "jskiowernweorjwoerlwofjewr",
      "peaks": [1.23, 0.34, 2.32],
      "fileType": "video",
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
- `conversationId` must be a valid MongoId.
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
