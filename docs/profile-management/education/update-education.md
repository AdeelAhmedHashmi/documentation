---
id: update-education
title: Update Education
---

# Update Education

Modifies an existing academic education record on the authenticated user's profile.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/user/profile/info/education/:educationId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Users can only modify education records belonging to their own account.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| educationId | string | Yes | The MongoDB ObjectID of the education entry to modify |

### Query Parameters

None.

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| title | string | No | Non-empty string | Updated degree title |
| institution.name | string | No | String | Updated institution name |
| institution.location | string | No | String | Updated institution location |
| degreeType | string | No | Valid `DegreeType` | Updated degree type |
| fieldOfStudy | string | No | String | Updated field of study |
| startDate | string | No | ISO Date string | Updated start date |
| endDate | string | No | ISO Date string | Updated graduation date |
| isCurrent | boolean | No | `true` or `false` | Current enrollment status |
| grade | string | No | String | Updated grade or GPA |
| description | string | No | String | Updated description |

### Example Request

```json
{
  "grade": "3.92 CGPA",
  "description": "Graduated Summa Cum Laude with First Class Honors."
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "697dc679f4536661050bdb01",
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
    "grade": "3.92 CGPA",
    "description": "Graduated Summa Cum Laude with First Class Honors.",
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
| data._id | string | No | Education entry ID |
| data.title | string | No | Degree title |
| data.institution | object | No | Institution details |
| data.grade | string | Yes | Updated grade |
| data.description | string | Yes | Updated description |
| data.updatedAt | string | No | Update timestamp |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid education ID or payload validation error | Highlight field error |
| 401 | Unauthenticated | Redirect to login |
| 404 | Education entry not found | Show record not found notification |
| 500 | Server error | Show update error alert |

```json
{
  "message": "education record not found",
  "code": 404,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Disable "Save Changes" button, display saving spinner.
- Empty state: Pre-fill input form with current education values.
- Retry behavior: Allow user to retry if network failed.
- Cache invalidation: Update the local education list state item immediately.
- Side effects: Modifies education document in MongoDB.
- Related realtime events: None.

## Related Endpoints

- [Create Education](./create-education.md)
- [Get My Educations](./get-my-educations.md)
- [Delete Education](./delete-education.md)
