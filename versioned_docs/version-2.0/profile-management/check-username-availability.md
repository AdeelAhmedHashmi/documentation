---
id: check-username-availability
title: Check Username Availability
---

# Check Username Availability

Checks whether a requested username handle is available for registration or already claimed by another user.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/availability-check/:username`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The endpoint compares the requested username against the authenticated user's current handle to indicate if the user already owns it.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| username | string | Yes | The username candidate to verify (alphanumeric, lowercase, underscores) |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
GET /api/v1/user/availability-check/adeel_ahmed HTTP/1.1
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
    "username": {
      "isAvailable": true,
      "isOwnByCurrentUser": false
    }
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates whether check completed |
| message | string | No | Response message |
| data.username.isAvailable | boolean | No | `true` if the username is free to be registered |
| data.username.isOwnByCurrentUser | boolean | No | `true` if the username is already registered to the current requesting user |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid username format | Highlight field in red with validation message |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show check failure warning |

```json
{
  "message": [
    "username should not be empty"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Debounce input by 300–500ms before making request; display an inline check spinner.
- Empty state: Show info text "Choose a unique username".
- Retry behavior: Re-query on user keystroke after debounce.
- Cache invalidation: Cache results in a client map during the active form session to prevent duplicate queries.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Update Profile](./update-profile.md)
- [Get My Profile](./get-my-profile.md)
