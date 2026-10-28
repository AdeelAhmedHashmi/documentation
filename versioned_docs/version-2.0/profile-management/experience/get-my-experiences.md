---
id: get-my-experiences
title: Get My Experiences
---

# Get My Experiences

Retrieves a paginated list of work experience entries belonging to the authenticated user.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/profile/info/experience`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Returns only the caller's experience entries.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

None.

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| page | string | No | `"1"` | Current page index |
| limit | string | No | `"10"` | Maximum records per page |

### Request Body

None.

### Example Request

```http
GET /api/v1/user/profile/info/experience?page=1&limit=10 HTTP/1.1
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
| data.experiences | array | No | Array of experience items |
| data.experiences[].id | string | No | Experience identifier |
| data.experiences[].userId | string | No | Owning user ID |
| data.experiences[].title | string | No | Job title |
| data.experiences[].company | object | No | Company information |
| data.experiences[].jobType | string | No | Employment type enum |
| data.experiences[].startDate | string | No | Start date ISO string |
| data.experiences[].endDate | string | Yes | End date ISO string |
| data.experiences[].isCurrent | boolean | No | Current position flag |
| data.experiences[].description | string | Yes | Responsibilities |
| data.meta | object | No | Pagination metadata |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show experience list load failure alert |

```json
{
  "message": "unauthorized request",
  "code": 401,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render list skeleton cards in the Experience section.
- Empty state: Render "Add your work experience" empty state card with an "+ Add" button.
- Retry behavior: Re-fetch on pull-to-refresh or navigation return.
- Cache invalidation: Invalidate on create, update, or delete experience actions.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Create Experience](./create-experience.md)
- [Update Experience](./update-experience.md)
- [Delete Experience](./delete-experience.md)
- [Get User Experiences](./get-user-experiences.md)
