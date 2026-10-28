---
id: update-profile
title: Update Profile
---

# Update Profile

Updates personal details, biography, location coordinates, gender, birth date, and visibility settings for the authenticated user's profile.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/user/profile`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Users can only update their own profile.

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

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| firstName | string | No | 1–50 chars | User's first name |
| lastName | string | No | 1–50 chars | User's last name |
| username | string | No | Unique handle | User handle |
| status | string | No | 1–100 chars | Status message |
| dateOfBirth | string | No | ISO Date string | Date of birth |
| bio | string | No | Max 500 chars | Biography summary |
| location.longitude | number | No | Valid longitude | Geographic longitude |
| location.latitude | number | No | Valid latitude | Geographic latitude |
| gender | string | No | `male`, `female`, `other`, `not specify` | Gender identity |
| visibility | boolean | No | `true` or `false` | Global public profile visibility |
| socialLinks | array | No | Array of objects | Initial or updated social links |

### Example Request

```json
{
  "firstName": "Muhammad",
  "lastName": "Hussain",
  "username": "muhammad_hussain",
  "status": "Available for collaboration",
  "bio": "Software Engineer specialized in distributed Node.js backends.",
  "dateOfBirth": "2000-07-02T00:00:00.000Z",
  "gender": "male",
  "visibility": true,
  "location": {
    "longitude": 73.0479,
    "latitude": 33.6844
  }
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "69831b4bc58eff75b4210b8e",
    "phone": "+923012345678",
    "firstName": "Muhammad",
    "lastName": "Hussain",
    "username": "muhammad_hussain",
    "status": "Available for collaboration",
    "bio": "Software Engineer specialized in distributed Node.js backends.",
    "dateOfBirth": "2000-07-02T00:00:00.000Z",
    "gender": "male",
    "visibility": true,
    "avatar": null,
    "coverImage": null,
    "location": {
      "longitude": 73.0479,
      "latitude": 33.6844
    },
    "accountStatus": "active",
    "createdAt": "2026-02-04T10:11:23.281Z",
    "updatedAt": "2026-02-03T18:05:41.974Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | User ID |
| data.firstName | string | Yes | First name |
| data.lastName | string | Yes | Last name |
| data.username | string | Yes | Updated username |
| data.status | string | Yes | Status text |
| data.bio | string | Yes | Bio text |
| data.dateOfBirth | string | Yes | Date of birth ISO string |
| data.gender | string | Yes | Gender |
| data.visibility | boolean | No | Profile visibility |
| data.location | object | Yes | Geo coordinates object |
| data.updatedAt | string | No | Last update timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload or username taken | Show field-level validation errors |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show save failure message |

```json
{
  "message": [
    "gender must be one of the following values: male, female, other, not specify"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Disable "Save Profile" button, display saving indicator.
- Empty state: Pre-populate form with existing values from `GET /api/v1/user/profile/me`.
- Retry behavior: Allow user to retry immediately.
- Cache invalidation: Update profile cache in client state store immediately upon success.
- Side effects: Modifies user document in MongoDB.
- Related realtime events: `user.profile_updated`.

## Related Endpoints

- [Get My Profile](./get-my-profile.md)
- [Check Username Availability](./check-username-availability.md)
- [Update Avatar](./update-avatar.md)
- [Update Cover Image](./update-cover-image.md)
