---
id: create-education
title: Create Education
---

# Create Education

Adds an academic education entry to the authenticated user's profile.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/user/profile/info/education`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

Requires a valid Bearer access token. Records are created for the caller's account.

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
| title | string | Yes | Non-empty string | Name of degree / certification (e.g. `"ICS"`, `"BSCS"`) |
| institution.name | string | Yes | Non-empty string | University, college, or school name |
| institution.location | string | No | String | City, state, or country of institution |
| degreeType | string | Yes | `high_school`, `intermediate`, `associate`, `bachelor`, `master`, `doctorate`, `diploma`, `certificate`, `other` | Standard academic degree level |
| fieldOfStudy | string | No | String | Major / academic field (e.g. `"Computer Science"`) |
| startDate | string | Yes | ISO Date string | Program start date |
| endDate | string | No | ISO Date string | Graduation date (omit if ongoing) |
| isCurrent | boolean | No | `true` or `false` | Whether user is currently enrolled |
| grade | string | No | String | GPA, grade percentage, or honors designation |
| description | string | No | String | Notable projects, thesis, or coursework |

### Example Request

```json
{
  "title": "BS Computer Science",
  "institution": {
    "name": "National University of Sciences and Technology",
    "location": "Islamabad, Pakistan"
  },
  "degreeType": "bachelor",
  "fieldOfStudy": "Software Engineering & Distributed Systems",
  "startDate": "2018-09-01T00:00:00.000Z",
  "endDate": "2022-06-30T00:00:00.000Z",
  "isCurrent": false,
  "grade": "3.85 CGPA",
  "description": "Graduated with Dean's Honors. Final Year Project focused on decentralized messaging protocols."
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
    "title": "BS Computer Science",
    "institution": {
      "name": "National University of Sciences and Technology",
      "location": "Islamabad, Pakistan"
    },
    "degreeType": "bachelor",
    "fieldOfStudy": "Software Engineering & Distributed Systems",
    "startDate": "2018-09-01T00:00:00.000Z",
    "endDate": "2022-06-30T00:00:00.000Z",
    "isCurrent": false,
    "grade": "3.85 CGPA",
    "description": "Graduated with Dean's Honors. Final Year Project focused on decentralized messaging protocols.",
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
| data._id | string | No | Created education record ID |
| data.userId | string | No | Owner's user ID |
| data.title | string | No | Degree title |
| data.institution | object | No | Institution details |
| data.degreeType | string | No | Degree category |
| data.fieldOfStudy | string | Yes | Major or specialization |
| data.startDate | string | No | Start date ISO string |
| data.endDate | string | Yes | End date ISO string |
| data.isCurrent | boolean | No | Enrolled status |
| data.grade | string | Yes | Final grade |
| data.description | string | Yes | Extra details |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid payload or unsupported degreeType | Highlight field error in education modal |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show creation error message |

```json
{
  "message": [
    "degreeType must be one of the following values: high_school, intermediate, associate, bachelor, master, doctorate, diploma, certificate, other"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Render saving spinner on modal save action.
- Empty state: Not applicable.
- Retry behavior: Allow user to review inputs and resubmit.
- Cache invalidation: Invalidate cached education history in local state.
- Side effects: Stores new document in `educations` collection in MongoDB.
- Related realtime events: None.

## Related Endpoints

- [Get My Educations](./get-my-educations.md)
- [Update Education](./update-education.md)
- [Delete Education](./delete-education.md)
