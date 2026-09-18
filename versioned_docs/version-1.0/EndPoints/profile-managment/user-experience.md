---
id: user-experience
title: User Experience
---

# User Experience Endpoints

These endpoints allow frontend developers to **manage a user's work/experience records**.  
Operations include **add**, **update**, **get**, and **delete** experience entries.

All requests require a **Bearer token** in the `Authorization` header.

---

## 1. Add Experience

**POST** `{{baseUrl}}/user/profile/info/experience`

**Headers**

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Request Body**

```json
{
  "title": "Product Manager",
  "company": {
    "name": "Tech Innovators Inc.",
    "website": "https://techinnovators.example.com"
  },
  "jobType": "full-time",
  "location": "San Francisco, CA",
  "startDate": "2020-05-01",
  "endDate": "2023-08-31",
  "description": "Led a team of developers to build scalable web applications."
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "Experience added successfully",
  "data": {
    "experienceId": "5f8d0d55b54764421b7156c3",
    "title": "Senior Software Engineer",
    "company": {
      "name": "Tech Innovators Inc.",
      "website": "https://techinnovators.example.com"
    },
    "jobType": "full-time",
    "location": "San Francisco, CA",
    "startDate": "2020-05-01",
    "endDate": "2023-08-31",
    "description": "Led a team of developers to build scalable web applications.",
    "createdAt": "2024-06-15T12:34:56.789Z",
    "updatedAt": "2024-06-15T12:34:56.789Z"
  },
  "timestamp": "2024-06-15T12:34:56.789Z"
}
```

**cURL Example**

```bash
curl -X POST {{baseUrl}}/user/profile/info/experience \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "title": "Product Manager",
    "company": {
      "name": "Tech Innovators Inc.",
      "website": "https://techinnovators.example.com"
    },
    "jobType": "full-time",
    "location": "San Francisco, CA",
    "startDate": "2020-05-01",
    "endDate": "2023-08-31",
    "description": "Led a team of developers to build scalable web applications."
  }'
```

---

## 2. Update Experience

**PATCH** `{{baseUrl}}/user/profile/info/experience/{{experienceId}}`

**Headers**

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Request Body**

```json
{
  "location": "Islamabad, Pakistan",
  "startDate": "2020-05-01",
  "endDate": "2023-08-31",
  "company": {
    "name": "Suffa Inc.",
    "website": "https://www.suffa.com"
  }
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "_id": "698240bc8fd0f5c622aa46af",
    "userId": "69831b4bc58eff75b4210b8e",
    "title": "Product Manager",
    "company": {
      "name": "Suffa Inc.",
      "location": "",
      "website": "https://www.suffa.com"
    },
    "jobType": "full-time",
    "startDate": "2020-05-01T00:00:00.000Z",
    "endDate": "2023-08-31T00:00:00.000Z",
    "isCurrent": false,
    "description": "Led a team of developers to build scalable web applications."
  },
  "timestamp": "2026-02-03T18:43:05.225Z"
}
```

**cURL Example**

```bash
curl -X PATCH {{baseUrl}}/user/profile/info/experience/{{experienceId}} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
    "location": "Islamabad, Pakistan",
    "startDate": "2020-05-01",
    "endDate": "2023-08-31",
    "company": {
      "name": "Suffa Inc.",
      "website": "https://www.suffa.com"
    }
  }'
```

---

## 3. Get Own Experiences

**GET** `{{baseUrl}}/user/profile/info/experience?page={{page}}&limit={{limit}}`

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
    "data": [
      {
        "_id": "6982407699342b3726cecb6a",
        "userId": "69831b4bc58eff75b4210b8e",
        "title": "Product Manager",
        "company": {
          "name": "Tech Innovators Inc.",
          "location": "",
          "website": "https://techinnovators.example.com"
        },
        "jobType": "full-time",
        "startDate": "2020-05-01T00:00:00.000Z",
        "endDate": "2023-08-31T00:00:00.000Z",
        "isCurrent": false,
        "description": "Led a team of developers to build scalable web applications."
      }
    ],
    "meta": {
      "totalItems": 2,
      "currentPage": 1,
      "itemsPerPage": 10,
      "totalPages": 1,
      "hasMore": false
    }
  },
  "timestamp": "2026-02-03T18:47:08.331Z"
}
```

**cURL Example**

```bash
curl -X GET "{{baseUrl}}/user/profile/info/experience?page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}"
```

---

## 4. Get Experiences by User ID

**GET** `{{baseUrl}}/user/profile/info/experience/{{userId}}/get?page={{page}}&limit={{limit}}`

**Headers**

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**cURL Example**

```bash
curl -X GET "{{baseUrl}}/user/profile/info/experience/{{userId}}/get?page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}"
```

---

## 5. Delete Experience

**DELETE** `{{baseUrl}}/user/profile/info/experience/{{experienceId}}`

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
    "acknowledged": true,
    "deletedCount": 1
  },
  "timestamp": "2026-01-31T09:10:15.123Z"
}
```

**cURL Example**

```bash
curl -X DELETE {{baseUrl}}/user/profile/info/experience/{{experienceId}} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}"
```

---

### Notes for Frontend Integration

- Always include the JWT (`Bearer {{token}}`) in all requests.
- Use the returned `_id` of experience records for update and delete operations.
- Pagination is supported on `GET` endpoints via `page` and `limit` query parameters.
- Only send fields you want to update in `PATCH` requests.

```

```
