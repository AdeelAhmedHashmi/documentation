---
id: get-user-educations
title: Get User Educations
---

# Get User Educations

Retrieves the public academic education history of any user specified by their user ID.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/profile/info/education/:userId/get`
- **Authentication:** Public
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

This is a public endpoint accessible without authentication headers. Anyone can view public education records.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| userId | string | Yes | Valid MongoDB ObjectID of target user |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| page | string | No | `"1"` | Page number index |
| limit | string | No | `"10"` | Maximum items per page |

### Request Body

None.

### Example Request

```http
GET /api/v1/user/profile/info/education/69831b4bc58eff75b4210b8e/get?page=1&limit=10 HTTP/1.1
Host: localhost:4000
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
| data.educations | array | No | List of education entries |
| data.educations[].id | string | No | Education ID |
| data.educations[].userId | string | No | Target user ID |
| data.educations[].title | string | No | Degree title |
| data.educations[].institution | object | No | Institution details |
| data.educations[].degreeType | string | No | Degree category |
| data.educations[].fieldOfStudy | string | Yes | Major subject |
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
| 400 | Invalid user ID format | Show "Invalid user identifier" |
| 404 | User not found | Show profile not found placeholder |
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

- Loading state: Render skeleton cards in visitor's profile view.
- Empty state: Show "No education history shared" text.
- Retry behavior: Re-query on pull-to-refresh.
- Cache invalidation: Cache with a 5-minute TTL.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Get My Educations](./get-my-educations.md)
- [Get Profile By ID](../get-profile-by-id.md)
