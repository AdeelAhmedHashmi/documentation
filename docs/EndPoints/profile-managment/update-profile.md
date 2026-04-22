---
id: update-user-profile
title: Update User Profile
---

# Update User Profile

These endpoints allow an authenticated user to update their profile information, including **basic details**

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
  "location": {
    "longitude": "number",
    "latitude": "number"
  },
  "gender": "male",
  "status": "hi i am using suffa",
  "dateOfBirth": "2000-07-03",
  "bio": "i am a software engineer and open for work related to software engineering."
}
```

**Fields:**

| Field       | Type   | Required | Description                                   |
| ----------- | ------ | -------- | --------------------------------------------- |
| username    | string | No       | Display name of the user                      |
| firstName   | string | No       | Display firstname of the user                 |
| lastName    | string | No       | Display lastname of the user                  |
| location    | object | No       | User's location                               |
| gender      | string | No       | User gender (`male`, `female`, `not specify`) |
| status      | string | No       | Status message                                |
| dateOfBirth | string | No       | Date of birth (ISO format or `DD MMM YYYY`)   |
| bio         | string | No       | Short bio of the user                         |

**Note**
_For More Updateable Fields See UserSchema_
