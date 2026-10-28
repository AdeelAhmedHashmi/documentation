---
id: get-profile-by-id
title: Get Profile By ID
---

# Get Profile By ID

Retrieves public profile details for any user specified by their unique identifier.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/profile/:id`
- **Authentication:** Public
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

This is a public endpoint. Anyone can view public user profiles. Note that sensitive contact and personal data may be masked according to the user's privacy visibility settings.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | The target user's MongoDB ObjectID |

### Query Parameters

None.

### Request Body

None.

### Example Request

```http
GET /api/v1/user/profile/69831b4bc58eff75b4210b8e HTTP/1.1
Host: localhost:4000
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
    "lastSeen": "offline"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.id | string | No | User identifier |
| data.username | string | Yes | Username handle |
| data.firstName | string | Yes | First name |
| data.lastName | string | Yes | Last name |
| data.avatar | object | Yes | User avatar object |
| data.coverImage | object | Yes | User cover banner object |
| data.phone | string | No | Phone number |
| data.socialLinks | array | No | Social profile URLs |
| data.status | string | Yes | Custom status message |
| data.bio | string | Yes | Profile bio |
| data.dateOfBirth | string | Yes | Date of birth |
| data.lastSeen | string | Yes | Online / last seen timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid User ID format | Show "Invalid profile identifier" |
| 404 | User not found | Render "User does not exist" placeholder screen |
| 500 | Server error | Show retry alert |

```json
{
  "message": "user not found",
  "code": 404,
  "data": {
    "message": "user not found",
    "error": "Not Found",
    "statusCode": 404
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display profile skeleton placeholder.
- Empty state: If user bio or avatar is missing, render default silhouette.
- Retry behavior: Retry on network disconnect.
- Cache invalidation: Cache with a 5-minute TTL.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Get My Profile](./get-my-profile.md)
- [Check Username Availability](./check-username-availability.md)
