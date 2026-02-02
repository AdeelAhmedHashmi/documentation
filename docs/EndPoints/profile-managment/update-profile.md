---
id: update-user-profile
title: Update User Profile
---

# Update User Profile

These endpoints allow an authenticated user to update their profile information, including **basic details** and **social links**.

Use this after the user has logged in and obtained a valid Bearer token.

---

## Endpoints

### 1. Update Basic Profile

**PATCH**

```
/user/profile
```

### 2. Update Social Links

**PATCH**

```
/user/profile/social-links
```

---

## Headers

```

Content-Type: application/json
Authorization: Bearer {{token}}

```

---

## Request Body

### 1. Update Basic Profile

```json
{
  "username": "Muhamman Hussain",
  "location": "Islamabad, Pakistan",
  "gender": "male",
  "status": "hi i am using suffa",
  "dateOfBirth": "2000-07-03",
  "bio": "i am a software engineer and open for work related to software engineering."
}
```

**Fields:**

| Field       | Type      | Required | Description                                    |
| ----------- | --------- | -------- | ---------------------------------------------- |
| username    | string    | No       | Display name of the user                       |
| location    | string    | No       | User's location                                |
| gender      | string    | No       | User gender (`male`, `female`, `not specify`)  |
| status      | string    | No       | Status message                                 |
| dateOfBirth | string    | No       | Date of birth (ISO format or `DD MMM YYYY`)    |
| bio         | string    | No       | Short bio of the user                          |
| ...         | fieldType | No       | Other user related fields available for update |

---

### 2. Update Social Links

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

**Fields:**

| Field       | Type   | Required | Description                                          |
| ----------- | ------ | -------- | ---------------------------------------------------- |
| socialLinks | array  | Yes      | Array of social accounts                             |
| platform    | string | Yes      | Platform name (e.g., `github`, `linkedin`, `tiktok`) |
| link        | string | Yes      | Full URL to the social account                       |

---

## Example cURL

### Update Basic Profile

```bash
curl -X PATCH "/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
        "username": "Muhamman Hussain",
        "location": "Islamabad, Pakistan",
        "gender": "male",
        "status": "hi i am using suffa",
        "dateOfBirth": "2000-07-03",
        "bio": "i am a software engineer and open for work related to software engineering."
      }'
```

### Update Social Links

```bash
curl -X PATCH "/user/profile/social-links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
        "socialLinks": [
          { "platform": "github", "link": "https://github.com/suffa" },
          { "platform": "tiktok", "link": "https://t.me.com/suffa" }
        ]
      }'
```

---

## Success Response (200 OK)

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "69831b4bc58eff75b4210b8e",
    "phone": "+923012345678",
    "userState": "offline",
    "avatar": null,
    "coverImage": null,
    "status": "hi i am using suffa",
    "bio": "i am a software engineer and open for work related to software engineering.",
    "location": "Islamabad, Pakistan",
    "gender": "male",
    "visibility": true,
    "accountStatus": "active",
    "username": "Muhamman Hussain",
    "dateOfBirth": "2000-07-02T19:00:00.000Z",
    "socialLinks": [
      { "platform": "github", "link": "https://github.com/suffa" },
      { "platform": "tiktok", "link": "https://t.me.com/suffa" }
    ],
    "createdAt": "2026-02-04T10:11:23.281Z",
    "updatedAt": "2026-02-03T18:05:41.974Z"
  },
  "timestamp": "2026-02-03T18:05:42.146Z"
}
```

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

### Validation Error

**400**

```json
{
  "success": false,
  "message": "Invalid input data"
}
```

---

## Notes for Frontend

1. Both endpoints require **Bearer token authentication**.
2. `socialLinks` array **replaces all existing social links**.
3. Use `PATCH` to update only specific fields; other profile fields remain unchanged.
4. Recommended to **validate URLs** on the client before sending.
5. These updates are **instant**, reflected in `GET /user/profile`.

---

## Architectural Insight

- This design separates **core profile data** from **linked social accounts** for flexibility.
- Frontend can update **partial data** without sending entire profile.
- Matches the **REST principle of resource patching**.
