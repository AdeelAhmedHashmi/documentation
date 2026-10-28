---
id: get-group-by-id
title: Get Group By ID
---

# Get Group By ID

Retrieves metadata, active settings, owner details, and last activity preview for a specific group channel.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/group/:id`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. The requesting user must be an active, non-blocked member of the group.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | The MongoDB ObjectID of the group |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
GET /api/v1/group/6a4e2d25c11e524921cb6fcd HTTP/1.1
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
    "id": "6a4e2d25c11e524921cb6fcd",
    "name": "Suffa Developers Community",
    "description": "Official community for developers building on the Suffa ecosystem.",
    "type": "general",
    "scope": "public",
    "image": {
      "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/group.webp",
      "publicId": "suffa/group_6a4e2d25c11e524921cb6fcd/image"
    },
    "owner": {
      "id": "69831b4bc58eff75b4210b8e",
      "firstName": "Adeel",
      "lastName": "Ahmed"
    },
    "invitationCode": "013131b9-dd2a-48b9-b4f9-54bf4b5d1046",
    "infoCode": "364585",
    "unreadCount": 0,
    "lastMessage": {
      "id": "6a4e54bb1725ec10e4314539",
      "content": "Welcome to the group!",
      "createdAt": "2026-02-04T13:05:00.000Z"
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
| data.id | string | No | Group identifier |
| data.name | string | No | Group name |
| data.description | string | Yes | Description |
| data.type | string | Yes | Group type |
| data.scope | string | Yes | Group scope |
| data.image | object | Yes | Avatar media object |
| data.owner | object | No | Group owner details |
| data.invitationCode | string | No | Invite token |
| data.infoCode | string | No | Numeric short code |
| data.unreadCount | number | No | Unread message counter |
| data.lastMessage | object | Yes | Last message preview |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden / User is blocked or not in group | Show access restricted message |
| 404 | Group not found | Return to group catalog |
| 500 | Server error | Show standard error alert |

```json
{
  "message": "group not found",
  "code": 404,
  "data": {
    "message": "group not found",
    "error": "Not Found",
    "statusCode": 404
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display header skeleton in group details page.
- Empty state: Not applicable.
- Retry behavior: Re-query on navigation.
- Cache invalidation: Cache in state store until group info or image update is confirmed.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Get All Groups](./get-all-groups.md)
- [Update Group Info](./update-group-info.md)
- [Get Active Members](./get-active-members.md)
