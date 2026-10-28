---
id: get-upload-signature
title: Get Direct Upload Signatures
---

# Get Direct Upload Signatures

Generates pre-signed cryptographic upload signatures and Cloudinary storage credentials, enabling clients to securely upload media files directly to cloud storage without burdening the application server.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/media/media-intent`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- Accessible by all authenticated users to prepare temporary asset uploads.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |
| Content-Type | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| mediaTypes | array of strings | Yes | Array of valid `FileType` values | Types of media files to be uploaded. Supported values: `IMAGE`, `VIDEO`, `AUDIO`, `FILE`, `DOCUMENT`. |

### Example Request

```json
{
  "mediaTypes": [
    "IMAGE",
    "VIDEO"
  ]
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    "credentials": {
      "cloudinaryCloudName": "suffa-cloud",
      "cloudinaryApiKey": "987654321098765"
    },
    "signatures": [
      {
        "folder": "suffa/temp/user_651a2b3c4d5e6f7a8b9c0d1e/image",
        "timestamp": 1729000000,
        "signature": "3a7b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b",
        "mediaType": "IMAGE"
      },
      {
        "folder": "suffa/temp/user_651a2b3c4d5e6f7a8b9c0d1e/video",
        "timestamp": 1729000000,
        "signature": "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e",
        "mediaType": "VIDEO"
      }
    ]
  },
  "timestamp": "2026-10-28T00:42:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.credentials | object | No | Cloudinary credentials object required by upload SDK. |
| data.credentials.cloudinaryCloudName | string | No | Cloudinary cloud account name. |
| data.credentials.cloudinaryApiKey | string | No | Public Cloudinary API key. |
| data.signatures | array | No | Array of signature descriptor objects matched to requested `mediaTypes`. |
| data.signatures[].folder | string | No | Isolated user temporary destination folder. |
| data.signatures[].timestamp | integer | No | Unix epoch timestamp of signature generation. |
| data.signatures[].signature | string | No | SHA-1 HMAC cryptographic signature computed with server secret. |
| data.signatures[].mediaType | string | No | Associated `FileType` (`IMAGE`, `VIDEO`, etc.). |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid media types | Ensure `mediaTypes` is an array of enum strings (`IMAGE`, `VIDEO`, etc.). |
| 401 | Unauthenticated | Redirect user to sign in. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": [
    "each value in mediaTypes must be one of the following values: IMAGE, VIDEO, AUDIO, FILE, DOCUMENT"
  ],
  "code": 400,
  "cause": "Bad Request",
  "timestamp": "2026-10-28T00:42:00.180Z"
}
```

## Frontend Notes

- Loading state: Display preparation loader before starting file upload progress bars.
- Empty state: N/A.
- Retry behavior: If signatures expire before upload starts (Cloudinary signatures typically valid for 1 hour), request fresh signatures.
- Cache invalidation: Do not cache upload signatures across long sessions.
- Direct Upload Flow:
  1. Call `POST /api/v1/media/media-intent` with requested file types.
  2. Use returned `apiKey`, `timestamp`, `signature`, and `folder` to `POST` directly to `https://api.cloudinary.com/v1_1/<cloudinaryCloudName>/auto/upload`.
  3. Cloudinary responds with `public_id`, `secure_url`, and dimension metadata.
  4. Pass the returned `public_id` to Suffa backend endpoints (e.g., avatar, cover, attachment, group image, circle image).
- Side effects: None on backend until asset is promoted.
- Related realtime events: None.

## Related Endpoints

- [Update Profile Avatar](../profile-management/update-avatar.md)
- [Update Cover Image](../profile-management/update-cover-image.md)
- [Update Group Profile Image](../group-chat/update-group-image.md)
- [Update Circle Profile Image](../circles/update-circle-image.md)
- [Create Discussion Thread](../threads/thread-management/create-thread.md)
