---
id: update-group-image
title: Update Group Image
---

# Update Group Image

Promotes an uploaded image asset to become the official group display photo.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/:groupId/image`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Caller must be an active **admin** or **owner** of the group.

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
    "_id": "6a4e2d25c11e524921cb6fcd",
    "name": "Suffa Developers Official",
    "image": {
      "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/v1769774604/suffa/group_6a4e2d25c11e524921cb6fcd/image.webp",
      "publicId": "suffa/group_6a4e2d25c11e524921cb6fcd/image"
    },
    "updatedAt": "2026-02-04T13:20:00.000Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | Group identifier |
| data.name | string | No | Group name |
| data.image.url | string | No | Permanent CDN image URL |
| data.image.publicId | string | No | Permanent Cloudinary asset ID |
| data.updatedAt | string | No | ISO 8601 update timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid publicId or asset not found | Prompt user to choose and re-upload photo |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (non-admin member) | Show "Only admins can change group picture" |
| 404 | Group not found | Return to group catalog |
| 500 | Server error | Show upload failure alert |

```json
{
  "message": "unauthorized to change group image",
  "code": 403,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display image placeholder with circular progress overlay during upload & promotion.
- Empty state: Show default group icon silhouette.
- Retry behavior: Re-try upload through `/api/v1/media/media-intent` if asset expired.
- Cache invalidation: Force cache refresh of group avatar across all member clients.
- Side effects: Moves asset to permanent group storage in Cloudinary and replaces old photo.
- Related realtime events: `group.image_updated`.

## Related Endpoints

- [Get Upload Signature](../media-handling/get-upload-signature.md)
- [Update Group Info](./update-group-info.md)
- [Get Group By ID](./get-group-by-id.md)
