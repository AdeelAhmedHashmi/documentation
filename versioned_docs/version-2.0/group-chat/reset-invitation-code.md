---
id: reset-invitation-code
title: Reset Invitation Code
---

# Reset Invitation Code

Revokes the previous group invitation links and generates a fresh, secure invitation UUID and short code.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/:groupId/invitation/reset`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The caller must be an **admin** or **owner** of the group.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| groupId | string | Yes | The MongoDB ObjectID of the group |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
PATCH /api/v1/group/6a4e2d25c11e524921cb6fcd/invitation/reset HTTP/1.1
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
    "invitationCode": "7f4c20b1-c841-4569-8092-2bb197dc3f80"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.invitationCode | string | No | Newly issued secret invitation UUID |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (non-admin member) | Show "Only admins can reset invite links" |
| 404 | Group not found | Return to group list |
| 500 | Server error | Show reset error alert |

```json
{
  "message": "unauthorized to reset invitation code",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display spinner inside the "Reset Link" button.
- Empty state: Not applicable.
- Retry behavior: Re-try action if network dropped.
- Cache invalidation: Update the copied invite link on the client share sheet immediately.
- Side effects: Invalidates all existing shared invitation URLs across the web immediately.
- Related realtime events: None.

## Related Endpoints

- [Get Group Preview](./get-group-preview.md)
- [Get Group Info Code](./get-group-info-code.md)
