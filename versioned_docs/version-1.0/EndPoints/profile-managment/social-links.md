---
title: Social Links
sidebar_position: 5
---

# Social Links

Social links allow users to attach their external profiles (GitHub, TikTok, LinkedIn, etc.) to their account.

This module provides APIs to:

- Add or update social links
- Delete an existing social link

All endpoints require authentication.

---

## Base Endpoint

```http
/user/profile/social-links
```

---

## Authentication

All requests must include a valid JWT token:

```http
Authorization: Bearer {{token}}
```

---

# 1. Add / Update Social Links

Adds new social links or replaces existing ones for the user.

### Endpoint

```http
PATCH /user/profile/social-links
```

### Request Body

```json
{
  "socialLinks": [
    {
      "platform": "github",
      "link": "https://github.com/suffa"
    },
    {
      "platform": "tiktok",
      "link": "https://t.me.com/suffa"
    }
  ]
}
```

### Field Description

| Field      | Type   | Description                                  |
| ---------- | ------ | -------------------------------------------- |
| `platform` | string | Social platform name (github, linkedin, etc) |
| `link`     | string | Full URL of the profile                      |

### Response

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": [
    {
      "platform": "github",
      "link": "https://github.com/suffa"
    },
    {
      "platform": "tiktok",
      "link": "https://t.me.com/suffa"
    }
  ],
  "timestamp": "2026-02-03T17:45:12.000Z"
}
```

### Notes

- This endpoint **upserts** links:
  - If platform already exists → it updates.
  - If new platform → it inserts.

- Sending a new array **replaces the previous list**.

---

# 2. Delete a Social Link

Deletes a specific social link using its URL.

### Endpoint

```http
DELETE /user/profile/social-links?link={{link}}
```

### Example

```http
DELETE /user/profile/social-links?link=https://github.com/suffa
```

### Response

```json
{
  "success": true,
  "message": "Social links deleted successfully",
  "data": null,
  "timestamp": "2026-02-03T17:50:15.123Z"
}
```

---

## Frontend Implementation Flow (Recommended)

Typical UI flow:

1. Fetch profile
2. Show social links in editable list
3. User adds/removes links
4. Call:
   - `PATCH` → when saving list
   - `DELETE` → when removing a single link

---

## Best Practices for Frontend

- Always validate URL before sending.
- Normalize platforms (`github`, `linkedin`, `twitter`).
- Prevent duplicate platforms on UI.
- Keep links absolute (must start with `https://`).

---

## Example cURL

### Add / Update

```bash
curl -X PATCH "{{baseUrl}}/user/profile/social-links" \
-H "Authorization: Bearer {{token}}" \
-H "Content-Type: application/json" \
-d '{
  "socialLinks": [
    { "platform": "github", "link": "https://github.com/suffa" }
  ]
}'
```

### Delete

```bash
curl -X DELETE "{{baseUrl}}/user/profile/social-links?link=https://github.com/suffa" \
-H "Authorization: Bearer {{token}}"
```

---

## Mental Model (For Devs)

Think of social links as:

```ts
type SocialLink = {
  platform: string;
  link: string;
};

socialLinks: SocialLink[]
```

You're always managing a **simple array of objects** tied to the user profile.
