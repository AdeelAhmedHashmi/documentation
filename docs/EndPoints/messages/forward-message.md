---
id: forward-message
title: Forward Message
---

# Forward Message

Forward an existing message to one or more conversations. This endpoint queues the forward operation and returns immediately.

---

## Endpoint

`POST /message/forward/:messageId`

**Headers**:

- `Authorization: Bearer {{token}}`

**Path Parameters**:

- `messageId` string

**Body**:

```json
{
  "conversations": [
    {
      "id": "string",
      "type": "chat"
    }
  ]
}
```

**Field Rules**:

- `conversations` must be an array with 1 to 10 items.
- Each item:
  - `id` must be a valid MongoDB ObjectId string.
  - `type` must be a string; supported values are `chat` or `group`.

---

## Example cURL Request

```bash
curl -X POST "{{baseUrl}}/message/forward/67d0f84f0a4f4f49f2a4c111" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "conversations": [
      { "id": "67d0f84f0a4f4f49f2a4c222", "type": "chat" },
      { "id": "67d0f84f0a4f4f49f2a4c333", "type": "group" }
    ]
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "ok"
  },
  "timestamp": "2026-03-15T10:31:10.000Z"
}
```

---

## Notes

- This endpoint is asynchronous: it queues the forward operation and returns `result: "ok"` immediately.
- The response does not include the forwarded message objects.
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).

---

## Error Cases

- `400 Bad Request`
  - Missing or invalid `messageId`
  - `conversations` missing or empty
  - `conversations` length > 10
  - Invalid `id` or `type` in any conversation entry
- `401 Unauthorized`
  - Missing or malformed `Authorization` header
  - Invalid/expired token
  - Suspended, inactive, or untrusted device (see `AuthGuard` checks)
- `409 Conflict`
  - Message not found
- `500 Internal Server Error`
  - Unexpected server-side failure during queueing
