---
title: Get Started
sidebar_position: 1
---

# Get Started

Welcome to the **Suffa API documentation**! This page will guide you through the basics to get started with API requests, docs style and sign conversions

---

## 1. Base Information

Here are the base URLs for accessing the API in different environments:

**Production Environment**  
 `https://<hostname>:port/suffa/api/`

**Development Environment**  
 `https://0.0.0.0:4000/suffa/api/`

> ⚠️ Replace `<hostname>` with your actual production domain.

---

## 2. Dynamic Values in API Requests

Some API endpoints require dynamic values such as tokens, IDs, or query parameters.  
We use `{{ }}` to indicate placeholders:

#### Example

```http
GET {{baseUrl}}/user/profile?experience=true
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

## 3. Request & Response Format

All API requests and responses follow the **JSON format**.

**Request Example**:

```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
    ...
}
```

**Success Response Example**:

```json
{
  "success": true,
  "message": "request proceed successfull",
  "data": {
    ...
  },
  "timestamp": "2026-02-05T14:00:00.000Z"
}
```

**Error Response Example**:

```json
{
  "message": "unauthorized",
  "code": 401,
  "data": {
    "message": "invalid or expired token",
    "error": "unauthorized",
    "statusCode": 401
  },
  "timestamp": "2026-02-02T06:15:22.645Z"
}
```

**Consistent Response Formate**

```typescript
{
    "message": string,
    "code": number,
    "data": {
        ...
    },
    "timestamp": Date
}
```

---

## 4. Authorization

Most endpoints require **Bearer token** authentication.
Include it in your request headers like this:

```http
Authorization: Bearer {{token}}
```

> Tokens expire periodically. For long-lived sessions, use the refresh token endpoint to obtain a new access token.

---

## 5. Best Practices

1. Always use the correct **environment base URL**.
2. Replace **all `{{ }}` placeholders** with actual values.
3. Keep your **tokens secret**; never commit them to public repositories.
4. Use proper **HTTP methods** (`GET`, `POST`, `PATCH`, `DELETE`) for each endpoint.

---

> Now that you have the basics, you’re ready to start using the API endpoints!
