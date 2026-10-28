---
id: update-settings
title: Update User Settings
---

# Update User Settings

Modifies account privacy options and profile element visibility rules for the authenticated user.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/user/settings`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Callers can only modify settings for their own account.

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
| privacy | object | Yes | Valid privacy object | Privacy controls block |
| privacy.profilePictureVisibility | string | No | `everyone` or `nobody` | Who can see avatar |
| privacy.bioVisibility | string | No | `everyone` or `nobody` | Who can see biography |
| privacy.dateOfBirthVisibility | string | No | `everyone` or `nobody` | Who can see birth date |
| privacy.locationVisibility | string | No | `everyone` or `nobody` | Who can see location |
| privacy.genderVisibility | string | No | `everyone` or `nobody` | Who can see gender |

### Example Request

```json
{
  "privacy": {
    "profilePictureVisibility": "everyone",
    "bioVisibility": "everyone",
    "dateOfBirthVisibility": "nobody",
    "locationVisibility": "nobody",
    "genderVisibility": "nobody"
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
    "userId": "69831b4bc58eff75b4210b8e",
    "privacy": {
      "profilePictureVisibility": "everyone",
      "bioVisibility": "everyone",
      "dateOfBirthVisibility": "nobody",
      "locationVisibility": "nobody",
      "genderVisibility": "nobody"
    },
    "updatedAt": "2026-02-04T12:00:00.000Z"
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
| data.privacy | object | No | Updated privacy preferences |
| data.updatedAt | string | No | ISO 8601 update timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid enum value | Highlight invalid preference value |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show update error alert |

```json
{
  "message": [
    "privacy.dateOfBirthVisibility must be one of the following values: everyone, nobody"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Keep toggle UI responsive with optimistic local switch state.
- Empty state: Not applicable.
- Retry behavior: Revert toggle UI switch if request fails and toast error message.
- Cache invalidation: Update local user settings cache.
- Side effects: Affects data masking on `GET /api/v1/user/profile/:id` when viewed by other users.
- Related realtime events: None.

## Related Endpoints

- [Get User Settings](./get-settings.md)
- [Get My Profile](../profile-management/get-my-profile.md)
