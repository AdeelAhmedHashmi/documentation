---
title: Check Username Availability
sidebar_position: 3
---

# Check Username Availability

This endpoint checks whether a username is already taken or still available.
It normalizes the username by trimming whitespace and converting it to lowercase before checking.

---

## Endpoint

```http
GET {{baseUrl}}/user/availability-check/:username
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## Path Parameters

| Parameter  | Type   | Description                         |
| ---------- | ------ | ----------------------------------- |
| `username` | string | Username to check for availability. |

> Example request:

```http
GET {{baseUrl}}/user/availability-check/john_doe
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## Response

### Available username

```json
{
  "available": true
}
```

### Taken username

```json
{
  "available": false
}
```

---

## Notes for Frontend Developers

1. **Authorization**: Include a valid JWT in the `Authorization` header unless your app setup explicitly makes this route public.
2. **Username normalization**: The backend trims spaces and converts the username to lowercase before checking.
3. **No request body**: This route uses only the path parameter `:username`.
4. **Boolean response**: `available: true` means the username can be used, and `available: false` means it already exists.
5. **Use before submit**: This is useful for live username validation during signup or profile updates.

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/user/availability-check/john_doe" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}"
```
