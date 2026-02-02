---
title: Get User Profile
sidebar_position: 2
---

# Get User Profile

This endpoint retrieves **profile information** for the authenticated user. Optionally, you can provide a `:userId` in the path to get a **public profile** of another user.

---

## Endpoint

```http
GET {{baseUrl}}/user/profile
# Optional for public profile: /user/profile/:userId
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## Body / Query Parameters

You can **filter what fields** you want returned using the following options.
All fields are optional. **Use `1` to include a field and `0` to exclude it**, but you **cannot select and deselect in the same request**.

| Parameter       | Type | Description                               |
| --------------- | ---- | ----------------------------------------- |
| `username`      | 0/1  | Include username in response.             |
| `phone`         | 0/1  | Include phone number.                     |
| `email`         | 0/1  | Include email address.                    |
| `userState`     | 0/1  | Include online/offline status.            |
| `avatar`        | 0/1  | Include avatar image.                     |
| `coverImage`    | 0/1  | Include cover image.                      |
| `status`        | 0/1  | Include user's status message.            |
| `dateOfBirth`   | 0/1  | Include date of birth.                    |
| `bio`           | 0/1  | Include user biography.                   |
| `location`      | 0/1  | Include location.                         |
| `gender`        | 0/1  | Include gender.                           |
| `socialLinks`   | 0/1  | Include social media links.               |
| `blocked`       | 0/1  | Include blocked users list.               |
| `visibility`    | 0/1  | Include account visibility.               |
| `accountStatus` | 0/1  | Include account status (active/inactive). |

> Example request to include **phone** and **socialLinks** only:

```json
{
  "socialLinks": 1,
  "phone": 1
}
```

---

## Response

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "phone": "+923999999999",
    "socialLinks": [
      {
        "platform": "tiktok",
        "link": "https://t.me/en/suffa"
      },
      {
        "platform": "linkdin",
        "link": "https://l.me/in/suffa"
      }
    ]
  },
  "timestamp": "2026-02-02T07:47:43.471Z"
}
```

> Example request to exclude **phone** and **socialLinks**:

```json
{
  "socialLinks": 0,
  "phone": 0
}
```

---

## Response

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {},
  "timestamp": "2026-02-02T07:47:43.471Z"
}
```

---

## Notes for Frontend Developers

1. **Authorization**: Always include a valid JWT in the `Authorization` header.
2. **Public Profiles**: Provide a `:userId` in the endpoint to fetch another user's profile. Otherwise, it defaults to the authenticated user's profile.
3. **Field Filtering**: Use `0` to hide a field, `1` to include it. **Do not mix 0 and 1 for the same request.**
4. **Date format**: Dates are returned in **ISO 8601 format** (`YYYY-MM-DDTHH:MM:SS.sssZ`).
5. **Social Links**: If `socialLinks` is included, it returns an array of `{ platform, link }`.

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/user/profile" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {{token}}" \
-d '{"socialLinks":1,"phone":1}'
```

---

## Example Public Profile Request

```http
GET /user/profile/696cefc0af1b92d1ea75286e
Content-Type: application/json
Authorization: Bearer {{token}}
```

> This will return the **public view** of the user profile for the specified `userId`.
