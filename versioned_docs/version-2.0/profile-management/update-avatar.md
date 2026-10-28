---
id: update-avatar
title: Update Avatar
---

# Update Avatar

Promotes an uploaded temporary image asset into the user's permanent profile avatar.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/user/profile/avatar`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Promotes the asset to the user's own avatar path on Cloudinary.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| publicId | string | Yes | Valid temporary asset public ID | The Cloudinary publicId received after uploading via `/api/v1/media/media-intent` |

### Example Request

```json
{
  "publicId": "suffa/temp/user_69831b4bc58eff75b4210b8e/images/1770147195"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "69831b4bc58eff75b4210b8e",
    "avatar": {
      "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/v1769774604/suffa/user_69831b4bc58eff75b4210b8e/profile/avatar.webp",
      "publicId": "suffa/user_69831b4bc58eff75b4210b8e/profile/avatar"
    },
    "username": "adeelahmed",
    "updatedAt": "2026-02-03T18:05:41.974Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | User identifier |
| data.avatar.url | string | No | Public CDN URL for optimized avatar |
| data.avatar.publicId | string | No | Cloudinary asset public ID |
| data.updatedAt | string | No | ISO 8601 update timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid publicId or asset not found in temp folder | Prompt user to re-upload image |
| 401 | Unauthenticated | Redirect to login |
| 500 | Cloudinary promotion failure | Show upload error and retry |

```json
{
  "message": "invalid publicId or asset not found",
  "code": 400,
  "data": {
    "message": "invalid publicId or asset not found",
    "error": "Bad Request",
    "statusCode": 400
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render progress bar while uploading to Cloudinary, then spinner during this promotion call.
- Empty state: Show default user avatar placeholder.
- Retry behavior: If promotion fails, re-upload through `/api/v1/media/media-intent`.
- Cache invalidation: Invalidate cached avatar URL in image loaders (e.g., Glide, Coil, Next.js Image).
- Side effects: Moves asset from Cloudinary temporary bucket to permanent user storage.
- Related realtime events: `user.avatar_updated`.

## Related Endpoints

- [Get Upload Signature](../media-handling/get-upload-signature.md)
- [Update Cover Image](./update-cover-image.md)
- [Get My Profile](./get-my-profile.md)
