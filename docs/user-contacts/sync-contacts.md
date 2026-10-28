---
id: sync-contacts
title: Sync Contacts
---

# Sync Contacts

Submits an array of client device address book contacts for asynchronous background matching against registered Suffa accounts.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/user/contacts/sync`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token and a trusted device session. The sync job is linked to the authenticated user and device ID.

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
| contacts | array | Yes | Array of strings | List of phone numbers from the client address book (normalized via `ContactsNormalizedPipe`) |

### Example Request

```json
{
  "contacts": [
    "+923125790759",
    "+923161873215",
    "+923109355053"
  ]
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "job": {
      "jobId": "3d06b174-e9e9-4a44-9764-3214ac7a7cc6"
    }
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates whether background job was enqueued |
| message | string | No | Response message |
| data.job.jobId | string | No | Unique UUID identifier for the background sync job |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Contacts array malformed or empty | Ensure phone numbers are formatted strings |
| 401 | Unauthenticated | Redirect to login |
| 500 | Server error | Show sync failure toast |

```json
{
  "message": [
    "each value in contacts must be a string"
  ],
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Display non-blocking sync status badge in address book view.
- Empty state: Not applicable.
- Retry behavior: Re-dispatch contacts sync if job fails or times out.
- Cache invalidation: Poll the job result via `GET /api/v1/user/contacts/:jobId`.
- Side effects: Enqueues a contact matching job in BullMQ / Redis to find matched users without locking HTTP worker threads.
- Related realtime events: `contacts.sync_completed`.

## Related Endpoints

- [Get Synced Contacts](./get-synced-contacts.md)
