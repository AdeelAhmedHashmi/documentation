---
id: unblock-member
title: Unblock Member
---

# Unblock Member

Lifts a ban on a previously blocked user, permitting them to re-join or request access to the group.

## Endpoint

- **Method:** `PATCH`
- **URL:** `/api/v1/group/member/unblock`
- **Authentication:** Required
- **Content-Type:** `application/json`
- **Success status:** `200 OK`

## Authentication & Permissions

Requires a valid Bearer access token. Only group **admins** or the **owner** can unblock members.

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
| groupId | string | Yes | MongoDB ObjectID | The group identifier |
| userId | string | Yes | MongoDB ObjectID | The blocked user to unblock |

### Example Request

```json
{
  "groupId": "69b8295e4eb53689e88e4fed",
  "userId": "69b824284eb53689e88e4fcc"
}
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "request processed successfully",
  "data": {
    "unblocked": true,
    "userId": "69b824284eb53689e88e4fcc"
  },
  "timestamp": "2026-10-27T18:37:29.000Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Indicates success |
| message | string | No | Response message |
| data.unblocked | boolean | No | Unblock confirmation flag |
| data.userId | string | No | Unblocked user ID |
| timestamp | string | No | ISO 8601 timestamp |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 400 | User is not currently blocked | Inform admin user is not on blocklist |
| 401 | Unauthenticated | Redirect to login |
| 403 | Forbidden (caller is not an admin) | Show permission denied alert |
| 404 | User or group not found | Refresh blocklist |
| 500 | Server error | Show unblock error alert |

```json
{
  "message": "user is not blocked in this group",
  "code": 400,
  "cause": null,
  "timestamp": "2026-10-27T18:37:36.000Z"
}
```

## Frontend Notes

- Loading state: Dim "Unblock" button in group blocklist and display spinner.
- Empty state: Not applicable.
- Retry behavior: Allow re-trying action.
- Cache invalidation: Remove user from the group's blocklist view.
- Side effects: Removes user from `blocked` members array in MongoDB.
- Related realtime events: None.

## Related Endpoints

- [Block Member](./block-member.md)
- [Get Blocked Members](./get-blocked-members.md)
- [Add Members](./add-members.md)
