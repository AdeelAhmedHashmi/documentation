---
id: get-synced-contacts
title: Get Synced Contacts
---

# Get Synced Contacts

Retrieves the paginated results of a completed contact synchronization job by its job ID.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/user/contacts/:jobId`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Callers can only retrieve sync results for jobs dispatched by their own account.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| jobId | string | Yes | The UUID returned by the `POST /api/v1/user/contacts/sync` endpoint |

### Query Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| page | string | No | `"1"` | Results page index |
| limit | string | No | `"10"` | Maximum matched contacts per page |

### Request Body

None.

### Example Request

```http
GET /api/v1/user/contacts/3d06b174-e9e9-4a44-9764-3214ac7a7cc6?page=1&limit=20 HTTP/1.1
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
    "contacts": [
      "+923125790759",
      "+923161873215"
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 2,
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
| data.contacts | array | No | List of matched registered contact numbers |
| data.meta | object | No | Pagination metadata |
| data.meta.currentPage | number | No | Current page index |
| data.meta.totalPages | number | No | Total pages |
| data.meta.totalRecords | number | No | Total matched contacts |
| data.meta.hasNextPage | boolean | No | `true` if subsequent page exists |
| data.meta.hasPreviousPage | boolean | No | `true` if prior page exists |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Invalid jobId | Check job UUID format |
| 401 | Unauthenticated | Redirect to login |
| 404 | Job not found or still processing | Poll after short delay (e.g., 2 seconds) |
| 500 | Server error | Show sync error toast |

```json
{
  "message": "jobId must be a valid string",
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display progress spinner while polling or loading contacts.
- Empty state: Show "No contacts found on Suffa. Invite your friends!".
- Retry behavior: Poll with exponential backoff (1s, 2s, 4s) up to 5 attempts until job finishes.
- Cache invalidation: Cache matched contact list in local database (SQLite/Room).
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Sync Contacts](./sync-contacts.md)
