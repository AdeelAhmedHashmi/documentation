---
id: update-user-profile
title: Update User Profile
position: 1
---

# Update User Profile

This endpoint allows the authenticated user to update their profile information.

---

## Endpoint

**PATCH**

```
/user/profile
```

---

## Headers

```
Content-Type: application/json
Authorization: Bearer {{access-token}}
```

- `access-token` → JWT obtained after login or OTP verification

---

## Request Body

```json
{
  "username": "Muhamman Hussain",
  "location": "Islamabad, Pakistan",
  "gender": "male",
  "status": "hi i am using suffa",
  "dateOfBirth": "3 july 2000",
  "bio": "i am a software engineer and open for work related to software engineering."
}
```

### Updatable Fields

| Field       | Type      | Description                                    |
| ----------- | --------- | ---------------------------------------------- |
| username    | string    | Full name or display name                      |
| location    | string    | City, country, or any location                 |
| gender      | string    | male / female / not specify                    |
| status      | string    | Short status message                           |
| dateOfBirth | string    | ISO date or human-readable date                |
| bio         | string    | Short biography or description                 |
| ...         | fieldtype | other updateable field present in user profile |

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
    "status": "hi i am using suffa",
    "bio": "i am a software engineer and open for work related to software engineering.",
    "location": "Islamabad, Pakistan",
    "gender": "male",
    "visibility": true,
    "accountStatus": "active",
    "username": "Muhamman Hussain",
    "dateOfBirth": "2000-07-02T19:00:00.000Z",
    "createdAt": "2026-02-04T10:11:23.281Z",
    "updatedAt": "2026-02-03T18:05:41.974Z",
    "__v": 0
  },
  "timestamp": "2026-02-03T18:05:42.146Z"
}
```

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

### Invalid Request

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid input data"
}
```

---

## Example (cURL)

```bash
curl -X PATCH {{baseUrl}}/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{access-token}}" \
  -d '{
    "username": "Muhamman Hussain",
    "location": "Islamabad, Pakistan",
    "gender": "male",
    "status": "hi i am using suffa",
    "dateOfBirth": "3 july 2000",
    "bio": "i am a software engineer and open for work related to software engineering."
  }'
```

---

## Frontend Integration Notes

- Always include the JWT in the `Authorization` header.
- Send only the fields you want to update; other fields will remain unchanged.
- Use the response data to immediately update your frontend UI after a successful update.
