---
title: Sync Contacts
sidebar_position: 2
---

# Sync Contacts

This endpoint starts a **contact sync job** for the authenticated user.
It accepts a list of contact identifiers, queues background processing, and returns a `jobId` you can use to fetch matched contacts later.

---

## Endpoint

```http
POST {{baseUrl}}/user/contacts/sync
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## Body / Query Parameters

This endpoint uses only a request body.

| Parameter  | Type       | Required | Description                                                  |
| ---------- | ---------- | -------- | ------------------------------------------------------------ |
| `contacts` | `string[]` | Yes      | Array of contact values to sync. Each item must be a string. |

> Example request body:

```json
{
  "contacts": [
    "$2b$10$DfrVcEEAHEyuR0QkTwJZteWx.5dKhmvayGUngl/woGQjztYhtW5eK",
    "$2b$10$faSb1D3hlcPbBuksgK59BOcVEZ5Njbjji3qWF3F7tnpmvUyY8qOz2"
  ]
}
```

---

## Response

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "jobId": "fa245f24-225f-4ec1-94d5-46561aa723ba"
  },
  "timestamp": "2026-02-12T16:00:00.000Z"
}
```

---

## How It Works (Implementation Behavior)

1. User must be authenticated with a valid bearer token.
2. Guard resolves both user and device from JWT payload.
3. Device must be trusted, otherwise request is rejected.
4. Request body is validated:
   - `contacts` must be an array
   - every item in `contacts` must be a string
5. Server generates a unique tracking id (`jobId`).
6. A `contact.sync` app event is emitted.
7. Event listener pushes a job into the contact queue.
8. Background worker processes the array and stores matched contacts in cache with key:
   - `sync_contact:${jobId}`
   - TTL: 20 minutes
9. API returns immediately with `{ jobId }`.

---

## Notes for Frontend Developers

1. **Authorization is required**: Always send `Authorization: Bearer {{token}}`.
2. **Async endpoint**: This route does not return matched contacts directly. It only returns a `jobId`.
3. **Follow-up endpoint**: Use `GET /user/contacts/:jobId` to read synced contacts.
4. **Expected contact format**: The server matches against hashed phone values, so send the same hashed format used by your sync pipeline.
5. **Expiry window**: Synced results are cached for about **20 minutes**; after expiry, retrieval by `jobId` returns not found.
6. **Socket signal**: A `contact:sync` websocket event is emitted to the user-device room with the same tracking id.

---

## Example cURL Request

```bash
curl -X POST "{{baseUrl}}/user/contacts/sync" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {{token}}" \
-d '{
  "contacts": [
    "$2b$10$DfrVcEEAHEyuR0QkTwJZteWx.5dKhmvayGUngl/woGQjztYhtW5eK",
    "$2b$10$faSb1D3hlcPbBuksgK59BOcVEZ5Njbjji3qWF3F7tnpmvUyY8qOz2",
    ...
  ]
}'
```

---

## Error Cases

### 400 Bad Request

Validation failures, for example:

- `contacts` missing
- `contacts` is not an array
- one or more `contacts` items are not strings

### 401 Unauthorized

Authentication/authorization failures, for example:

- missing or invalid token
- expired token
- user not found
- user suspended/inactive
- device is not trusted

### 500 Internal Server Error

Unexpected background/event infrastructure failure while registering the sync job.
