---
id: update-profile-media
title: Update Profile Media
---

# Update Profile Media

Update the authenticated user’s **profile media assets**, such as avatar and cover image.

This endpoint is used after a successful upload via the **Media Intent / Direct Upload flow**.

---

## Endpoints

### Update Avatar

**PATCH**

```
/user/profile/avatar
```

### Update Cover Image

**PATCH**

```
/user/profile/cover-image
```

---

## Headers

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## Request Body

```json
{
  "publicId": "suffa/temp/user_69831b4bc58eff75b4210b8e/images/1770147195"
}
```

### Fields

| Field    | Type   | Required | Description                                 |
| -------- | ------ | -------- | ------------------------------------------- |
| publicId | string | Yes      | Cloudinary `publicId` of the uploaded image |

---

## Example cURL

### Update Avatar

```bash
curl -X PATCH "{{baseUrl}}/user/profile/avatar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "publicId": "suffa/temp/user_69831b4bc58eff75b4210b8e/images/1770147195"
  }'
```

### Update Cover Image

```bash
curl -X PATCH "{{baseUrl}}/user/profile/cover-image" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "publicId": "suffa/temp/user_69831b4bc58eff75b4210b8e/images/1770147195"
  }'
```

---

## Success Response (200 OK)

```json
{
  "avatar": {
    "url": "https://res.cloudinary.com/.../profile.webp",
    "publicId": "suffa/user_.../profile"
  },
  "coverImage": {
    "url": "https://res.cloudinary.com/.../cover.webp",
    "publicId": "suffa/user_.../cover"
  },
  "updatedAt": "2026-01-30T14:57:36.365Z"
}
```

> Only the relevant field is updated depending on the endpoint called.

---

## Error Responses

### Unauthorized

**401**

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Invalid Media Reference

**400**

```json
{
  "success": false,
  "message": "Invalid publicId"
}
```

---

## Typical Frontend Flow

1. Request **Media Intent** from backend
2. Upload file directly to Cloudinary
3. Receive `publicId` from Cloudinary
4. Call one of these endpoints to attach media

---

## Important Notes

- Existing avatar/cover is **replaced**.
- The `publicId` must belong to the authenticated user.
- These endpoints **do not handle file uploads**.
- They only **bind already-uploaded media** to the user profile.

---

## Architectural Insight

This design follows the **Direct-to-Cloud pattern**:

> Client uploads → Cloud handles storage → Backend stores reference.

This gives you:

- Zero server bandwidth usage
- Infinite scalability
- CDN-level performance
- No file security liability
