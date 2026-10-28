---
id: update-circle
title: Update Circle Information
---

# Update Circle Information

Updates the name or description of an existing community circle, restricted to circle administrators.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/circle/:slug`
- **Authentication:** Required (Bearer JWT)
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

- Requires a valid Bearer access token.
- The user must be listed in the circle's `admins` array.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Authorization | string | Yes | Bearer access token (`Bearer <token>`) |
| Content-Type | string | Yes | `application/json` |

### Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| slug | string | Yes | Unique URL-friendly slug of the circle. |

### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| name | string | No | Optional non-empty string | New display name for the circle. |
| description | string | No | Optional string | Updated bio or purpose description. |

### Example Request

```json
{
  "name": "Suffa Engineering & Developer Guild",
  "description": "Global hub for software engineers and contributors collaborating on Suffa open source services."
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  },
  "timestamp": "2026-10-28T00:40:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.acknowledged | boolean | No | MongoDB acknowledgment of write operation. |
| data.modifiedCount | integer | No | Count of documents updated (`1` on success). |
| data.matchedCount | integer | No | Count of matching documents found. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | Circle not found | Display message that circle does not exist. |
| 401 | Unauthorized | User is not an admin of this circle. |
| 500 | Server error | Show retry prompt. |

```json
{
  "message": "unauthorized",
  "code": 401,
  "cause": "Unauthorized",
  "timestamp": "2026-10-28T00:40:00.180Z"
}
```

## Frontend Notes

- Loading state: Disable edit form inputs and display saving indicator.
- Empty state: Disable save button when form values are identical to current state.
- Retry behavior: Safe to retry.
- Cache invalidation: Invalidate `GET /api/v1/circle/:slug` cache and update community profile UI.
- Side effects: Note that updating the name may trigger automatic slug regeneration in the database.
- Related realtime events: `circle.updated`.

## Related Endpoints

- [Get Circle by Slug](./get-circle.md)
- [Update Circle Profile Image](./update-circle-image.md)
