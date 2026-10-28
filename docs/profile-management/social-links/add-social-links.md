---
id: add-social-links
title: Add Social Links
---

# Add Social Links

Appends one or more social media platform links to the authenticated user's profile.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/user/profile/social-links`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. Links are added directly to the caller's user record.

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
| socialLinks | array | Yes | Min 1 item | List of social link items |
| socialLinks[].platform | string | Yes | Non-empty string | Platform name (e.g. `github`, `twitter`, `linkedin`, `tiktok`) |
| socialLinks[].link | string | Yes | Valid URL | Direct profile or channel URL |

### Example Request

```json
{
  "socialLinks": [
    {
      "platform": "github",
      "link": "https://github.com/suffa"
    },
    {
      "platform": "tiktok",
      "link": "https://tiktok.com/@suffa"
    }
  ]
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "socialLinks": [
      {
        "platform": "github",
        "link": "https://github.com/suffa"
      },
      {
        "platform": "tiktok",
        "link": "https://tiktok.com/@suffa"
      }
    ]
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.socialLinks | array | No | The full updated list of social links |
| data.socialLinks[].platform | string | No | Platform identifier |
| data.socialLinks[].link | string | No | Link URL |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid URL or missing platform | Show validation error under corresponding field |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show failure toast |

```json
{
  "message": [
    "socialLinks.0.link must be an URL address"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display spinner inside the "Add Link" modal/dialog.
- Empty state: Show "No social links added yet" placeholder.
- Retry behavior: Allow user to modify URL and re-submit.
- Cache invalidation: Update profile cache in client storage.
- Side effects: Appends items to `socialLinks` array in user's MongoDB document.
- Related realtime events: None.

## Related Endpoints

- [Delete Social Link](./delete-social-link.md)
- [Get My Profile](../get-my-profile.md)
