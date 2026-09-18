---
id: media-intent
title: Media Intent
---

# Media Intent

Generate signed upload credentials for media files (images, videos, and other files) using Cloudinary. This endpoint provides the necessary **folders, timestamps, and signatures** for secure uploads.

---

## Endpoint

`POST /media/media-intent`

**Headers**:

- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Request Body**:

```json
{ "mediaTypes": ["image", "file", "video"] }
```

- `mediaTypes` – Array of media types to generate upload credentials for. Allowed values: `"image"`, `"video"`, `"file"`.

---

## Example cURL Request

```bash
curl -X POST "{{baseUrl}}/media/media-intent" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "mediaTypes": ["image", "file", "video"]
  }'
```

---

## Response 200 OK

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "credentials": {
      "cloudinaryCloudName": "adeelsorgnization",
      "cloudinaryApiKey": "452157884857866"
    },
    "signatures": [
      {
        "folder": "suffa/temp/user_69831b4bc58eff75b4210b8e/images/1770147195",
        "timestamp": 1770147195,
        "signature": "2cbf00800323eb729d03055bf4bfe0b244455058",
        "mediaType": "image"
      },
      {
        "folder": "suffa/temp/user_69831b4bc58eff75b4210b8e/files/1770147195",
        "timestamp": 1770147195,
        "signature": "7deec1909c3b86fe6f92913622fbbb21ca033ad9",
        "mediaType": "file"
      },
      {
        "folder": "suffa/temp/user_69831b4bc58eff75b4210b8e/videos/1770147195",
        "timestamp": 1770147195,
        "signature": "ea9a26838f6077a3c19dbd244cce7b14dc955e51",
        "mediaType": "video"
      }
    ]
  },
  "timestamp": "2026-02-03T19:33:15.197Z"
}
```

---

## Notes

- Use the returned `folder`, `timestamp`, and `signature` for **direct Cloudinary uploads**.
- Each `mediaType` has a separate signature for security.
- These credentials are temporary and must be used immediately for uploading files.

---
