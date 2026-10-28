---
id: create-experience
title: Create Experience
---

# Create Experience

Adds a professional work experience entry to the authenticated user's profile.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/user/profile/info/experience`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. Experience entries are created for the caller's account.

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
| title | string | Yes | Non-empty string | Job title / designation |
| company.name | string | Yes | Non-empty string | Name of employer / organization |
| company.location | string | No | String | City, state, or country of company |
| company.website | string | No | Valid URL | Company homepage URL |
| jobType | string | Yes | `full-time`, `part-time`, `internship`, `contract`, `freelance`, `volunteer`, `other` | Employment category |
| startDate | string | Yes | ISO Date string | Start date |
| endDate | string | No | ISO Date string | End date (omit if current position) |
| isCurrent | boolean | No | `true` or `false` | Whether user is currently working here |
| description | string | No | String | Role responsibilities and key achievements |

### Example Request

```json
{
  "title": "Lead Backend Engineer",
  "company": {
    "name": "Suffa Technologies Inc.",
    "location": "San Francisco, CA",
    "website": "https://suffa.example.com"
  },
  "jobType": "full-time",
  "startDate": "2023-01-15T00:00:00.000Z",
  "isCurrent": true,
  "description": "Architected low-latency microservices with NestJS, Redis, and MongoDB."
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
    "title": "Lead Backend Engineer",
    "company": {
      "name": "Suffa Technologies Inc.",
      "location": "San Francisco, CA",
      "website": "https://suffa.example.com"
    },
    "jobType": "full-time",
    "startDate": "2023-01-15T00:00:00.000Z",
    "endDate": null,
    "isCurrent": true,
    "description": "Architected low-latency microservices with NestJS, Redis, and MongoDB.",
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
| data._id | string | No | Unique experience record ID |
| data.userId | string | No | Associated user ID |
| data.title | string | No | Job title |
| data.company | object | No | Company details object |
| data.jobType | string | No | Job type |
| data.startDate | string | No | Start date ISO string |
| data.endDate | string | Yes | End date ISO string |
| data.isCurrent | boolean | No | Active role flag |
| data.description | string | Yes | Job description |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload or invalid date format | Show validation error next to invalid field |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show creation error message |

```json
{
  "message": [
    "jobType must be one of the following values: full-time, part-time, internship, contract, freelance, volunteer, other"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Disable submit button and show saving spinner inside the experience form.
- Empty state: Not applicable.
- Retry behavior: Allow user to correct validation errors and re-submit.
- Cache invalidation: Invalidate user's experience list cache.
- Side effects: Inserts new document into `experiences` collection in MongoDB.
- Related realtime events: None.

## Related Endpoints

- [Get My Experiences](./get-my-experiences.md)
- [Update Experience](./update-experience.md)
- [Delete Experience](./delete-experience.md)
