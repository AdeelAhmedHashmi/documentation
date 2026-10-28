---
id: get-circle
title: Get Circle by Slug
---

# Get Circle by Slug

Fetches community circle details, member administration list, bio, and media references using the circle's unique URL slug.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/circle/:slug`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- Accessible by all authenticated users.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| slug | string | Yes | URL-friendly unique identifier of the circle (e.g. `suffa-developers-community`). |

### Example Request

```http
GET /api/v1/circle/suffa-developers-community HTTP/1.1
Host: api.suffa.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    "_id": "671e3e5b8f1a2c3d4e5f6b01",
    "name": "Suffa Developers Community",
    "slug": "suffa-developers-community",
    "description": "Official community hub for developers building applications on Suffa platform.",
    "owner": "651a2b3c4d5e6f7a8b9c0d1e",
    "admins": [
      "651a2b3c4d5e6f7a8b9c0d1e"
    ],
    "isActive": true,
    "image": "671e3d5a8f1a2c3d4e5f6a70",
    "coverImage": "671e3d5a8f1a2c3d4e5f6a71",
    "createdAt": "2026-10-28T00:38:00.000Z",
    "updatedAt": "2026-10-28T00:38:00.000Z"
  },
  "timestamp": "2026-10-28T00:39:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful retrieval. |
| message | string | No | Response descriptor. |
| data._id | string | No | Unique MongoDB ObjectId of the circle. |
| data.name | string | No | Display name of the circle. |
| data.slug | string | No | Unique URL-friendly slug. |
| data.description | string | Yes | Bio / description text. |
| data.owner | string | No | Creator user ID. |
| data.admins | array | No | Array of administrator user IDs. |
| data.isActive | boolean | No | Circle status flag. |
| data.image | string | Yes | Circle avatar media ID. |
| data.coverImage | string | Yes | Circle banner media ID. |
| data.createdAt | string | No | Creation date. |
| data.updatedAt | string | No | Last update date. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect user to sign in. |
| 404 | Circle not found | Display circle not found state or 404 page. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "Circle not found",
  "code": 404,
  "cause": "Not Found",
  "timestamp": "2026-10-28T00:39:00.180Z"
}
```

## Frontend Notes

- Loading state: Display header hero banner skeleton and community overview placeholders.
- Empty state: Show empty hub placeholder if no groups or feeds are attached to the circle.
- Retry behavior: Safe to retry.
- Cache invalidation: Invalidate when the circle info or media is updated.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Create Community Circle](./create-circle.md)
- [Update Circle Info](./update-circle.md)
- [Update Circle Profile Image](./update-circle-image.md)
