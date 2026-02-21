---
id: refresh-token
title: Refresh Token
---

# Refresh Token

This endpoint allows the client to obtain a **new tokens** using a valid **refresh token**.  
Use this when the access token has expired but the refresh token is still valid.

---

## Endpoint

**POST**

```
/auth/refresh
```

---

## Headers

Content-Type: application/json

## Request Body

```json
{
  "token": "your-refresh-token"
}
```

### Field

| Field | Type   | Description                                       |
| ----- | ------ | ------------------------------------------------- |
| token | string | The refresh token previously issued by the server |

---

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTgzMWI0YmM1OGVmZjc1YjQyMTBiOGUiLCJkZXZpY2VJZCI6ImFuZHJvaWQudW5pcXVlLmRldmljZS5pZCIsImlhdCI6MTc3MDIwNzg5MiwiZXhwIjoxNzcxMDcxODkyfQ.mZMpsmgx2giiR_TmEnaTbXGb7cKp1qyA3vF6QnSw96M",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VySWQiOiI2OTgzMWI0YmM1OGVmZjc1YjQyMTBiOGUiLCJkZXYmM1OGVmZjc1YjQyMTBiOGUiLCJkZXZpMpsmgx2giiR_TmEnaTbXGb7cK2VySWQiOiI2OTgzMWI0YmMZXhw"
    }
  },
  "timestamp": "2026-02-03T17:47:00.859Z"
}
```

- `data.tokens` → The new access and refresh tokens you should use in subsequent requests

---

## Error Responses

### Invalid or Expired Token

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Refresh token expired or invalid"
}
```

---

## Example (cURL)

```bash
curl -X POST {{baseUrl}}/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTgzMWI0YmM1OGVmZjc1YjQyMTBiOGUiLCJkZXZpY2VJZCI6ImFuZHJvaWQudW5pcXVlLmRldmljZS5pZCIsImlhdCI6MTc3MDIwNzg5MiwiZXhwIjoxNzcxMDcxODkyfQ.mZMpsmgx2giiR_TmEnaTbXGb7cKp1qyA3vF6QnSw96M"
  }'
```
