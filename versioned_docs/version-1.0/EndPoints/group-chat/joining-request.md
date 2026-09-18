---
id: group-requests
title: Group Join Requests
---

# Group Join Requests

Create, accept, or reject join requests for a group.

---

## POST /group/request/:reqType

Create or cancel a join request using an invitation code.

**Headers**:

- `Authorization: Bearer {{token}}`

**Query Parameters**:

- `invitationCode` string (required)

**Query Parameters**:

- `reqType` add | remove (required)

**Example cURL Request**:

```bash
curl -X POST "{{baseUrl}}/group/add/request?invitationCode=K9J2VQ" \
  -H "Authorization: Bearer {{token}}"
```

**Response 200 OK**:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "request created!"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

```bash
curl -X POST "{{baseUrl}}/group/remove/request?invitationCode=K9J2VQ" \
  -H "Authorization: Bearer {{token}}"
```

**Response 200 OK**:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "request canceled!"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

**Notes**:

- If a request already exists, this endpoint cancels it and returns `request canceled!`.
- If the user is already a member or requested, the conflict error occur in reponse.
- If the user is blocked, the request fails.
- Unknown query fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

**Error Cases**:

- `400 Bad Request` — Missing/invalid `invitationCode` or group not found.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `409 Conflict` — User is blocked / already a member / request already existed / request not exist (in case of cancelling).
- `500 Internal Server Error` — Any unexpected server-side failure.

---

## PATCH /group/request/accept

Approve a pending join request. Only admins can approve.

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "groupId": "67d0f84f0a4f4f49f2a4c111",
  "requestId": "67d0f84f0a4f4f49f2a4c222"
}
```

note: `use userId in requestId field`

**Example cURL Request**:

```bash
curl -X PATCH "{{baseUrl}}/group/request/accept" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "67d0f84f0a4f4f49f2a4c111",
    "requestId": "67d0f84f0a4f4f49f2a4c222"
  }'
```

**Response 200 OK**:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "user approved!"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

**Notes**:

- The requester must be an admin of the group.
- A system message and group notification may be emitted after approval.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

**Error Cases**:

- `400 Bad Request` — Invalid `groupId` or `requestId`.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `409 Conflict` — Request not found or already processed.
- `500 Internal Server Error` — Any unexpected server-side failure.

---

## PATCH /group/request/reject

Reject a pending join request. Only admins can reject.

**Headers**:

- `Authorization: Bearer {{token}}`

**Body**:

```json
{
  "groupId": "67d0f84f0a4f4f49f2a4c111",
  "requestId": "67d0f84f0a4f4f49f2a4c222"
}
```

**Example cURL Request**:

```bash
curl -X PATCH "{{baseUrl}}/group/request/reject" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "67d0f84f0a4f4f49f2a4c111",
    "requestId": "67d0f84f0a4f4f49f2a4c222"
  }'
```

**Response 200 OK**:

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "result": "rejected"
  },
  "timestamp": "2026-03-17T10:31:10.000Z"
}
```

**Notes**:

- The requester must be an admin of the group.
- Unknown body fields are rejected by the global validation pipe (`ValidationPipe` with `forbidNonWhitelisted`).
- The global response interceptor wraps payloads as `success`, `message`, `data`, and `timestamp`.

**Error Cases**:

- `400 Bad Request` — Invalid `groupId` or `requestId`.
- `401 Unauthorized` — Missing or malformed `Authorization` header, invalid/expired token, or suspended/inactive/untrusted device.
- `409 Conflict` — Request not found or already processed.
- `500 Internal Server Error` — Any unexpected server-side failure.
