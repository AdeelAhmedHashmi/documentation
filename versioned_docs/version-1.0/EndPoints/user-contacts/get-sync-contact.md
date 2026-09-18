---
title: Get Synced Contacts
sidebar_position: 3
---

# Get Synced Contacts

This endpoint returns the processed contact-sync result using the `jobId` returned by `POST /user/contacts/sync`.
It reads cached results and returns them with pagination metadata.

---

## Endpoint

```http
GET {{baseUrl}}/user/contacts/:jobId?page=1&limit=12
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## Body / Query Parameters

This endpoint uses a path parameter and query parameters.

| Parameter | Location | Type     | Required | Description                                                                                     |
| --------- | -------- | -------- | -------- | ----------------------------------------------------------------------------------------------- |
| `jobId`   | Path     | `string` | Yes      | Sync tracking id returned by `POST /user/contacts/sync`.                                        |
| `page`    | Query    | `string` | No       | Page number. Defaults to `1` if missing/invalid.                                                |
| `limit`   | Query    | `string` | No       | Items per page. Defaults to `50` at route-level if missing, then normalized by pagination util. |

> Example request:

```http
GET {{baseUrl}}/user/contacts/fa245f24-225f-4ec1-94d5-46561aa723ba?page=1&limit=12
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## Response

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "contacts": [
      {
        "_id": "<userId>",
        "phone": "+923001234567",
        "avatar": {
          "url": "https://...",
          "publicId": "..."
        }
      },
      {
        "_id": "<userId>",
        "phone": "+923001234567",
        "avatar": {
          "url": "https://...",
          "publicId": "..."
        }
      },
      ...
    ],
    "meta": {
      "totalItems": 42,
      "currentPage": 1,
      "itemsPerPage": 12,
      "totalPages": 4,
      "hasMore": true
    }
  },
  "timestamp": "2026-02-12T16:00:00.000Z"
}
```

---

## How It Works (Implementation Behavior)

1. Endpoint validates `jobId` as non-empty string.
2. Service reads cache key `sync_contact:${jobId}`.
3. If key is missing, request fails with not found.
4. Cached JSON is parsed into an array of matched contacts.
5. Pagination metadata is computed from `page`, `limit`, and total records.
6. Response returns sliced contacts for current page plus `meta`.

---

## Pagination Details

Pagination is offset-based:

- `skip = (currentPage - 1) * itemsPerPage`
- Page values `< 1` or invalid become `1`
- Limit values `< 1` or invalid become `10` inside the pagination utility
- Route-level defaults passed to service are `page='1'` and `limit='50'` when omitted

Meta fields:

- `totalItems`: total matched contacts in cache
- `currentPage`: normalized page number
- `itemsPerPage`: normalized per-page size
- `totalPages`: `ceil(totalItems / itemsPerPage)`
- `hasMore`: whether more pages exist

---

## Notes for Frontend Developers

1. **Call order matters**: Use this only after `POST /user/contacts/sync` and store the returned `jobId`.
2. **TTL window**: Results are cached for about **20 minutes**; fetch before expiry.
3. **Auth required**: Include bearer token on this endpoint too.
4. **Polling pattern**: If data is not ready yet, retry after short delay.
5. **Websocket assist**: You can listen for `contact:sync` event and then call this endpoint.

---

## Example cURL Request

```bash
curl -X GET "{{baseUrl}}/user/contacts/{{jobId}}?page=1&limit=12" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {{token}}"
```

---

## Error Cases

### 400 Bad Request

Validation failures, for example:

- missing `jobId`
- invalid param shape

### 401 Unauthorized

Authentication/authorization failures, for example:

- missing or invalid token
- expired token
- user suspended/inactive
- device is not trusted

### 404 Not Found

No cached sync result for the provided `jobId`, including cases where:

- `jobId` is unknown
- cached job result expired
- cached result is empty
