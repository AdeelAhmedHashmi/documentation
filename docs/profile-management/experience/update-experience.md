---
id: update-experience
title: Update Experience
---

# Update Experience

Modifies an existing work experience record on the authenticated user's profile.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/user/profile/info/experience/:experienceId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. Users can only update their own experience entries.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| experienceId | string | Yes | The unique MongoDB ObjectID of the experience entry |

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| title | string | No | Non-empty string | Updated job title |
| company.name | string | No | String | Updated company name |
| company.location | string | No | String | Updated company location |
| company.website | string | No | Valid URL | Updated website |
| jobType | string | No | Valid `JobType` | Updated employment type |
| startDate | string | No | ISO Date string | Updated start date |
| endDate | string | No | ISO Date string | Updated end date |
| isCurrent | boolean | No | `true` or `false` | Whether role is ongoing |
| description | string | No | String | Updated description |

### Example Request

```json
{
  "title": "Principal Architect",
  "isCurrent": true,
  "description": "Leading distributed cloud infrastructure and messaging protocols."
}
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "697dc679f4536661050bdb01",
    "userId": "69831b4bc58eff75b4210b8e",
    "title": "Principal Architect",
    "company": {
      "name": "Suffa Technologies Inc.",
      "location": "San Francisco, CA",
      "website": "https://suffa.example.com"
    },
    "jobType": "full-time",
    "startDate": "2023-01-15T00:00:00.000Z",
    "endDate": null,
    "isCurrent": true,
    "description": "Leading distributed cloud infrastructure and messaging protocols.",
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
| data._id | string | No | Experience record ID |
| data.title | string | No | Updated job title |
| data.company | object | No | Company details |
| data.isCurrent | boolean | No | Active role status |
| data.description | string | Yes | Updated responsibilities |
| data.updatedAt | string | No | Update timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid experience ID or payload validation failed | Display validation feedback |
| 401 | Unauthenticated | Redirect to login |
| 404 | Experience entry not found | Show "Record not found" alert |
| 500 | Server error | Show update error alert |

```json
{
  "message": "experience not found",
  "code": 404,
  "data": {
    "message": "experience not found",
    "error": "Not Found",
    "statusCode": 404
  },
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Disable "Save Changes" button, display saving progress spinner.
- Empty state: Pre-fill input form with current experience details.
- Retry behavior: Allow user to retry if network failed.
- Cache invalidation: Update the local experience cache item immediately.
- Side effects: Modifies experience document in MongoDB.
- Related realtime events: None.

## Related Endpoints

- [Create Experience](./create-experience.md)
- [Get My Experiences](./get-my-experiences.md)
- [Delete Experience](./delete-experience.md)
