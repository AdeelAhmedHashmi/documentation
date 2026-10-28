---
id: update-cover-image
title: Update Cover Image
---

# Update Cover Image

Promotes an uploaded image asset into the user's permanent profile background cover photo.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/user/profile/cover-image`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Moves the temporary asset to the caller's permanent cover folder on Cloudinary.

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
    "coverImage": {
      "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/v1769775484/suffa/user_69831b4bc58eff75b4210b8e/cover/cover.webp",
      "publicId": "suffa/user_69831b4bc58eff75b4210b8e/cover/cover"
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
| data.coverImage.url | string | No | Public CDN URL of the cover image |
| data.coverImage.publicId | string | No | Permanent Cloudinary asset identifier |
| data.updatedAt | string | No | ISO 8601 update timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid publicId or asset expired in temp storage | Prompt user to choose and re-upload cover |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show upload failure alert |

```json
{
  "message": "invalid publicId",
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display cover photo skeleton/shimmer loader during upload and promotion.
- Empty state: Show default banner background graphic or gradient.
- Retry behavior: Re-try promotion on network failure.
- Cache invalidation: Force cache refresh of cover image URL on profile screen.
- Side effects: Deletes old cover image asset from Cloudinary to free storage and stores the new cover record in MongoDB.
- Related realtime events: `user.cover_updated`.

## Related Endpoints

- [Get Upload Signature](../media-handling/get-upload-signature.md)
- [Update Avatar](./update-avatar.md)
- [Get My Profile](./get-my-profile.md)
