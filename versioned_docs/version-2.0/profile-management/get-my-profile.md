---
id: get-my-profile
title: Get My Profile
---

# Get My Profile

Retrieves the complete profile data and settings for the currently authenticated user.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/profile/me`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token belonging to an active user session and trusted device.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
GET /api/v1/user/profile/me HTTP/1.1
Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "id": "69831b4bc58eff75b4210b8e",
    "username": "adeelahmed",
    "firstName": "Adeel",
    "lastName": "Ahmed",
    "avatar": {
      "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/v1769774604/suffa/user_69831b4bc58eff75b4210b8e/profile/avatar.webp",
      "publicId": "suffa/user_69831b4bc58eff75b4210b8e/profile/avatar"
    },
    "coverImage": {
      "url": "https://res.cloudinary.com/adeelsorgnization/image/upload/v1769775484/suffa/user_69831b4bc58eff75b4210b8e/cover/cover.webp",
      "publicId": "suffa/user_69831b4bc58eff75b4210b8e/cover/cover"
    },
    "phone": "+923012345678",
    "socialLinks": [
      {
        "platform": "github",
        "link": "https://github.com/suffa"
      }
    ],
    "status": "Busy coding",
    "bio": "Software Engineer passionate about high performance systems.",
    "dateOfBirth": "2000-07-02T19:00:00.000Z",
    "lastSeen": "online"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates request success |
| message | string | No | Response message |
| data.id | string | No | User's unique identifier |
| data.username | string | Yes | Unique handle |
| data.firstName | string | Yes | First name |
| data.lastName | string | Yes | Last name |
| data.avatar | object | Yes | User's avatar object (URL and Cloudinary public ID) |
| data.coverImage | object | Yes | User's cover banner object |
| data.phone | string | No | Normalized phone number |
| data.socialLinks | array | No | List of social links |
| data.status | string | Yes | User's brief status text |
| data.bio | string | Yes | User's bio / biography |
| data.dateOfBirth | string | Yes | Date of birth ISO string |
| data.lastSeen | string | Yes | Presence / last active status |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated / Invalid token | Redirect to login |
| 404 | User account not found | Clear session state |
| 500 | Server error | Show profile loading failure message |

```json
{
  "message": "user not found",
  "code": 401,
  "data": {
    "message": "user not found",
    "error": "Unauthorized",
    "statusCode": 401
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display skeleton loader across the profile header, bio, and social badges.
- Empty state: Show empty placeholders / prompt user to "Complete your profile".
- Retry behavior: Re-try once on transient network failure.
- Cache invalidation: Cache in state manager (e.g. Redux / Zustand); invalidate upon calling update profile or upload avatar endpoints.
- Side effects: None.
- Related realtime events: `user.presence` updates.

## Related Endpoints

- [Update Profile](./update-profile.md)
- [Update Avatar](./update-avatar.md)
- [Get Profile By ID](./get-profile-by-id.md)
