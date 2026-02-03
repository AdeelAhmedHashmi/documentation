---
id: get-user-profile
title: Get User Profile
---

# Get User Profile

This endpoint fetches the authenticated user's profile information.  
You can optionally include additional data (like `experience`) via query parameters.

---

## Endpoint

**GET**

```
/user/profile?experience=true
```

## Query

```
experience=true
education=true
```

- `experience / education` query add extra user bio in response if exist

---

## Headers

```
Content-Type: application/json
Authorization: Bearer {{access-token}}
```

- `access-token` → JWT obtained after login or OTP verification

---

## Query Parameters

| Parameter  | Type    | Description                                                |
| ---------- | ------- | ---------------------------------------------------------- |
| experience | boolean | Optional. Set to `true` to include user experience details |
| education  | boolean | Optional. Set to `true` to include user education details  |

---

## Success Response

**Status:** `200 OK`

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
    "status": "hi i am available",
    "bio": null,
    "location": null,
    "gender": "not specify",
    "visibility": true,
    "accountStatus": "active",
    "username": "user_7439a2ec-cfe0-4830-9a47-d2602ec921b2",
    "dateOfBirth": "2026-02-04T10:11:23.273Z",
    "createdAt": "2026-02-04T10:11:23.281Z",
    "updatedAt": "2026-02-04T10:11:23.281Z",
    "__v": 0
  },
  "timestamp": "2026-02-03T18:04:30.632Z"
}
```

### Response Fields

| Field         | Type    | Description                    |
| ------------- | ------- | ------------------------------ |
| \_id          | string  | User unique ID                 |
| phone         | string  | User’s phone number            |
| userState     | string  | Current state (online/offline) |
| avatar        | string  | URL to avatar image            |
| coverImage    | string  | URL to cover image             |
| status        | string  | User status message            |
| bio           | string  | Short biography                |
| location      | string  | User location                  |
| gender        | string  | Gender value                   |
| visibility    | boolean | Profile visibility             |
| accountStatus | string  | Account status                 |
| username      | string  | Unique username                |
| dateOfBirth   | string  | ISO date of birth              |
| createdAt     | string  | ISO account creation timestamp |
| updatedAt     | string  | ISO last update timestamp      |

---

## Error Responses

### Unauthorized

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Access token missing or invalid"
}
```

---

## Example (cURL)

```bash
curl -X GET "{{baseUrl}}/user/profile?experience=true" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{access-token}}"
```

---

## Notes for Frontend Integration

- Always include the JWT in the `Authorization` header.
- Handle `401 Unauthorized` by refreshing the token or redirecting to login.
- Use query params like `experience=true` to fetch extended data when needed.
