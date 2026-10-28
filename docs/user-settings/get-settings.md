---
id: get-settings
title: Get User Settings
---

# Get User Settings

Retrieves account configuration and privacy visibility preferences for the authenticated user.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/settings`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Returns configuration settings belonging exclusively to the caller.

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
GET /api/v1/user/settings HTTP/1.1
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
    "_id": "69831b4bc58eff75b4210b8e",
    "userId": "69831b4bc58eff75b4210b8e",
    "privacy": {
      "profilePictureVisibility": "everyone",
      "bioVisibility": "everyone",
      "dateOfBirthVisibility": "everyone",
      "locationVisibility": "everyone",
      "genderVisibility": "everyone"
    },
    "createdAt": "2026-02-04T10:11:23.281Z",
    "updatedAt": "2026-02-04T10:11:23.281Z"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data._id | string | No | Settings record ID |
| data.userId | string | No | Associated user ID |
| data.privacy.profilePictureVisibility | string | No | `everyone` or `nobody` |
| data.privacy.bioVisibility | string | No | `everyone` or `nobody` |
| data.privacy.dateOfBirthVisibility | string | No | `everyone` or `nobody` |
| data.privacy.locationVisibility | string | No | `everyone` or `nobody` |
| data.privacy.genderVisibility | string | No | `everyone` or `nobody` |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show settings load failure |

```json
{
  "message": "unauthorized request",
  "code": 401,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display skeleton switches/toggles on settings screen.
- Empty state: Automatically initializes with defaults (`everyone`) if not yet provisioned.
- Retry behavior: Re-try query on network reconnect.
- Cache invalidation: Invalidate on updating settings.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Update User Settings](./update-settings.md)
- [Get My Profile](../profile-management/get-my-profile.md)
