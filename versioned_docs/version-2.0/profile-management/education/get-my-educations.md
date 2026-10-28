---
id: get-my-educations
title: Get My Educations
---

# Get My Educations

Retrieves a paginated list of academic education records belonging to the authenticated user.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/profile/info/education`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Returns only education history belonging to the authenticated caller.

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
| page | string | No | `"1"` | Page number index |
| limit | string | No | `"10"` | Maximum items per page |

### Request Body

None.

### Example Request

```http
GET /api/v1/user/profile/info/education?page=1&limit=10 HTTP/1.1
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
    "educations": [
      {
        "id": "697dc679f4536661050bdb01",
        "userId": "69831b4bc58eff75b4210b8e",
        "title": "BS Computer Science",
        "institution": {
          "name": "National University of Sciences and Technology",
          "location": "Islamabad, Pakistan"
        },
        "degreeType": "bachelor",
        "fieldOfStudy": "Computer Science",
        "startDate": "2018-09-01T00:00:00.000Z",
        "endDate": "2022-06-30T00:00:00.000Z",
        "isCurrent": false,
        "grade": "3.85 CGPA",
        "description": "Graduated with Dean's Honors."
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
| data.educations | array | No | List of education records |
| data.educations[].id | string | No | Education identifier |
| data.educations[].userId | string | No | Associated user ID |
| data.educations[].title | string | No | Degree title |
| data.educations[].institution | object | No | Institution information |
| data.educations[].degreeType | string | No | Degree classification |
| data.educations[].fieldOfStudy | string | Yes | Academic field |
| data.educations[].startDate | string | No | Start date ISO string |
| data.educations[].endDate | string | Yes | End date ISO string |
| data.educations[].isCurrent | boolean | No | Enrollment state |
| data.educations[].grade | string | Yes | Final grade |
| data.educations[].description | string | Yes | Details |
| data.meta | object | No | Pagination metadata |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show education retrieval failure toast |

```json
{
  "message": "unauthorized request",
  "code": 401,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render card skeleton placeholders in Education section.
- Empty state: Show empty state graphic with "+ Add Education" prompt.
- Retry behavior: Allow pull-to-refresh to retry on error.
- Cache invalidation: Invalidate on create, update, or delete education actions.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Create Education](./create-education.md)
- [Update Education](./update-education.md)
- [Delete Education](./delete-education.md)
- [Get User Educations](./get-user-educations.md)
