---
id: user-education
title: User Education
---

# User Education Endpoints

These endpoints allow frontend developers to **manage a user's education records**.  
Operations include **add**, **update**, **get**, and **delete** education entries.

All requests require a **Bearer token** in the `Authorization` header.

---

## 1. Add Education

**POST** `{{baseUrl}}/user/profile/settings/education`

**Headers**

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Request Body**

```json
{
  "title": "ICS",
  "institution": {
    "name": "Intermediate College Sukkur",
    "location": "Sukkur, Pakistan"
  },
  "startDate": "2015-08-01",
  "endDate": "2017-05-31",
  "description": "Studied Intermediate in Computer Science (ICS) with a focus on programming, database management, and web development.",
  "degreeType": "intermediate",
  "fieldOfStudy": "Computer Science",
  "grade": "A+"
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "697dc679f4536661050bdb01",
    "userId": "6974c63b9de8b4da9b4b401b",
    "title": "ICS",
    "institution": {
      "name": "Intermediate College Sukkur",
      "location": "Sukkur, Pakistan",
      "website": ""
    },
    "degreeType": "intermediate",
    "fieldOfStudy": "Computer Science",
    "startDate": "2015-08-01T00:00:00.000Z",
    "endDate": "2017-05-31T00:00:00.000Z",
    "grade": "A+",
    "description": "Studied Intermediate in Computer Science (ICS) with a focus on programming, database management, and web development."
  },
  "timestamp": "2026-01-31T09:08:09.788Z"
}
```

**cURL Example**

```bash
curl -X POST {{baseUrl}}/user/profile/settings/education \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "title": "ICS",
    "institution": {
      "name": "Intermediate College Sukkur",
      "location": "Sukkur, Pakistan"
    },
    "startDate": "2015-08-01",
    "endDate": "2017-05-31",
    "description": "Studied Intermediate in Computer Science (ICS) with a focus on programming, database management, and web development.",
    "degreeType": "intermediate",
    "fieldOfStudy": "Computer Science",
    "grade": "A+"
  }'
```

---

## 2. Update Education

**PATCH** `{{baseUrl}}/user/profile/settings/education/{{educationId}}`

**Headers**

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Request Body**

```json
{
  "title": "E-commerce Specialist",
  "fieldOfStudy": "E-commerce",
  "startDate": "2018-09-01",
  "endDate": "2022-06-30",
  "grade": "A+",
  "description": "Updated description of the education experience"
}
```

**Success Response (200 OK)**

```json
{
  "_id": "697dc60acc36a62f32a1d78c",
  "userId": "64a7f0e2f2d3c4b5a6b7c8d9",
  "title": "E-commerce Specialist",
  "institution": {
    "name": "Tech University",
    "location": "New York, USA"
  },
  "degreeType": "Bachelor's",
  "fieldOfStudy": "E-commerce",
  "startDate": "2018-09-01T00:00:00.000Z",
  "endDate": "2022-06-30T00:00:00.000Z",
  "grade": "A+",
  "description": "Updated description of the education experience",
  "createdAt": "2023-07-10T12:34:56.789Z",
  "updatedAt": "2024-06-15T10:20:30.456Z"
}
```

**cURL Example**

```bash
curl -X PATCH {{baseUrl}}/user/profile/settings/education/{{educationId}} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "title": "E-commerce Specialist",
    "fieldOfStudy": "E-commerce",
    "startDate": "2018-09-01",
    "endDate": "2022-06-30",
    "grade": "A+",
    "description": "Updated description of the education experience"
  }'
```

---

## 3. Get User Educations (Self)

**GET** `{{baseUrl}}/user/profile/settings/education?page={{page}}&limit={{limit}}`

**Headers**

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "educations": [
      {
        "_id": "697dc5fbcc36a62f32a1d788",
        "userId": "64f0c8e2b4d1c2a5f6e8d9c3",
        "institution": "University of Example",
        "degree": "Bachelor of Science in Computer Science",
        "fieldOfStudy": "Computer Science",
        "startDate": "2018-09-01T00:00:00.000Z",
        "endDate": "2022-06-30T00:00:00.000Z",
        "grade": "3.8",
        "description": "Studied various computer science topics including algorithms, data structures, and software engineering.",
        "createdAt": "2024-01-15T10:20:30.456Z",
        "updatedAt": "2024-06-20T14:35:50.789Z"
      }
    ],
    "meta": {
      "totalItems": 3,
      "currentPage": 1,
      "itemsPerPage": 1,
      "totalPages": 3,
      "hasMore": true
    }
  },
  "timestamp": "2026-01-31T09:10:15.123Z"
}
```

**cURL Example**

```bash
curl -X GET "{{baseUrl}}/user/profile/settings/education?page=1&limit=1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}"
```

---

## 4. Get User Educations (By User ID)

**GET** `{{baseUrl}}/user/profile/info/education/{{userId}}/get?page={{page}}&limit={{limit}}`

**Headers**

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**cURL Example**

```bash
curl -X GET "{{baseUrl}}/user/profile/info/education/{{userId}}/get?page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}"
```

---

## 5. Delete Education

**DELETE** `{{baseUrl}}/user/profile/settings/education/{{educationId}}`

**Headers**

```
Authorization: Bearer {{token}}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "acknowledged": true,
    "deletedCount": 1
  },
  "timestamp": "2026-01-31T09:10:15.123Z"
}
```

**cURL Example**

```bash
curl -X DELETE {{baseUrl}}/user/profile/settings/education/{{educationId}} \
  -H "Authorization: Bearer {{token}}"
```

---

## Notes for Frontend Integration

- Always include the JWT (`Bearer {{token}}`) in all requests.
- Use the returned `_id` of education records for update and delete operations.
- Pagination is supported on `GET` endpoints via `page` and `limit` query parameters.
- Only send fields you want to update in `PATCH` requests.

```

```
