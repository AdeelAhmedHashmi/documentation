---
id: update-circle-image
title: Update Circle Profile Image
---

# Update Circle Profile Image

Sets or updates the primary profile avatar image for a community circle, accessible to circle administrators.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/circle/:slug/image`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- User must be listed in the circle's `admins` array.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| slug | string | Yes | URL-friendly unique slug of the target circle. |

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| publicId | string | Yes | Non-empty string | The Cloudinary temporary asset public ID obtained from `/media/media-intent`. |

### Example Request

```json
{
  "publicId": "suffa/temp/user_651a2b3c4d5e6f7a8b9c0d1e/image/guild_badge_avatar"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  },
  "timestamp": "2026-10-28T00:41:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.acknowledged | boolean | No | MongoDB acknowledgment of write operation. |
| data.modifiedCount | integer | No | Count of documents updated (`1` on success). |
| data.matchedCount | integer | No | Count of matching documents found. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Circle not found or missing publicId | Check parameter values. |
| 401 | Unauthorized | User lacks administrator permissions on this circle. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "unauthorized",
  "code": 401,
  "cause": "Unauthorized",
  "timestamp": "2026-10-28T00:41:00.180Z"
}
```

## Frontend Notes

- Loading state: Display image upload overlay and spinner on the circle profile photo.
- Empty state: N/A.
- Retry behavior: Safe to retry.
- Cache invalidation: Invalidate `GET /api/v1/circle/:slug` to refresh the circle avatar URL across the application.
- Side effects: Associates the uploaded media asset with the circle entity.
- Related realtime events: `circle.image.updated`.

## Related Endpoints

- [Get Upload Signature](../media-handling/get-upload-signature.md)
- [Get Circle by Slug](./get-circle.md)
- [Update Circle Information](./update-circle.md)
