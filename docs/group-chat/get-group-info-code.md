---
id: get-group-info-code
title: Get Group Info Code
---

# Get Group Info Code

Resolves an invitation UUID into a short, human-friendly numeric info code.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/group/getinfocode/:invitationCode`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| invitationCode | string | Yes | The secret invitation UUID code |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
GET /api/v1/group/getinfocode/013131b9-dd2a-48b9-b4f9-54bf4b5d1046 HTTP/1.1
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
    "infoCode": "364585"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.infoCode | string | No | The 6-digit numeric short code for the group |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 404 | Invitation code not found | Show invalid invite notification |
| 500 | Server error | Show lookup error alert |

```json
{
  "message": "invalid invitation code",
  "code": 404,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Inline spinner inside code share dialog.
- Empty state: Not applicable.
- Retry behavior: Re-query on modal open.
- Cache invalidation: Cache until user resets the invitation code.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Get Group Preview](./get-group-preview.md)
- [Reset Invitation Code](./reset-invitation-code.md)
