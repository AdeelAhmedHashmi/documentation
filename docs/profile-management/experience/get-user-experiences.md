---
id: get-user-experiences
title: Get User Experiences
---

# Get User Experiences

Retrieves the work experience history of a specified user profile by their user ID.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/profile/info/experience/:userId/get`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Any authenticated user can view the public work experience of another user.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| userId | string | Yes | Valid MongoDB ObjectID of the target user |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| page | string | No | `"1"` | Current page index |
| limit | string | No | `"10"` | Maximum records per page |

### Request Body

None.

### Example Request

```http
GET /api/v1/user/profile/info/experience/69831b4bc58eff75b4210b8e/get?page=1&limit=10 HTTP/1.1
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
    "experiences": [
      {
        "id": "697dc679f4536661050bdb01",
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
        "description": "Architected low-latency microservices with NestJS, Redis, and MongoDB."
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.experiences | array | No | List of experiences |
| data.experiences[].id | string | No | Experience identifier |
| data.experiences[].userId | string | No | Target user ID |
| data.experiences[].title | string | No | Job title |
| data.experiences[].company | object | No | Company details |
| data.experiences[].jobType | string | No | Employment type |
| data.experiences[].startDate | string | No | Start date ISO string |
| data.experiences[].endDate | string | Yes | End date ISO string |
| data.experiences[].isCurrent | boolean | No | Active job status flag |
| data.experiences[].description | string | Yes | Job description |
| data.meta | object | No | Pagination metadata |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid User ID format | Show "Invalid user identifier" |
| 401 | Unauthenticated | Redirect to login |
| 404 | User not found | Show profile unavailable placeholder |
| 500 | Server error | Show retry alert |

```json
{
  "message": [
    "userId must be a mongodb id"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render skeleton cards in user profile view.
- Empty state: Show "No work experience listed" text.
- Retry behavior: Re-query on pull-to-refresh.
- Cache invalidation: Cache with 5-minute TTL.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Get My Experiences](./get-my-experiences.md)
- [Get Profile By ID](../get-profile-by-id.md)
