---
id: create-circle
title: Create Community Circle
---

# Create Community Circle

Creates a new community circle (hub) with an automated announcement channel, assigning the authenticated user as owner and primary administrator.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/circle`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

- Requires a valid Bearer access token.
- The authenticated user becomes the circle `owner` and first entry in `admins`.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |
| Content-Type | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| name | string | Yes | Non-empty string | The title or display name of the community circle. |
| description | string | No | Optional string | A short bio or description outlining the circle's purpose. |

### Example Request

```json
{
  "name": "Suffa Developers Community",
  "description": "Official community hub for developers building applications on Suffa platform."
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "Resource created successfully",
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
    "image": null,
    "coverImage": null,
    "createdAt": "2026-10-28T00:38:00.000Z",
    "updatedAt": "2026-10-28T00:38:00.000Z"
  },
  "timestamp": "2026-10-28T00:38:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data._id | string | No | Unique MongoDB ObjectId of the created circle. |
| data.name | string | No | Circle display name. |
| data.slug | string | No | URL-friendly unique identifier automatically derived from name. |
| data.description | string | Yes | Description text. |
| data.owner | string | No | User ID of the circle founder/owner. |
| data.admins | array | No | Array of user IDs with administrative control over the circle. |
| data.isActive | boolean | No | Circle status flag. |
| data.image | string | Yes | Avatar media ID reference. |
| data.coverImage | string | Yes | Header banner media ID reference. |
| data.createdAt | string | No | ISO 8601 creation timestamp. |
| data.updatedAt | string | No | ISO 8601 update timestamp. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload | Validate name field before submitting. |
| 401 | Unauthenticated | Redirect user to sign in. |
| 500 | Transaction or circle creation error | Display failure notice; prompt user to retry. |

```json
{
  "message": "error while creating circle!",
  "code": 500,
  "cause": "Internal Server Error",
  "timestamp": "2026-10-28T00:38:00.200Z"
}
```

## Frontend Notes

- Loading state: Disable submit button and display circle creation loader.
- Empty state: Validate `name` input is non-empty before submission.
- Retry behavior: If failure occurs during database transaction, the session rolls back; safe to retry.
- Cache invalidation: Invalidate user's managed circles list cache.
- Side effects: Automatically creates a default "announcement" group channel scoped to this circle.
- Related realtime events: Circle creation event.

## Related Endpoints

- [Get Circle by Slug](./get-circle.md)
- [Update Circle Info](./update-circle.md)
- [Update Circle Profile Image](./update-circle-image.md)
