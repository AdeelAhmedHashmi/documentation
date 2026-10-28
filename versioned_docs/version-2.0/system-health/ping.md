---
id: ping
title: Server Liveness Ping
---

# Server Liveness Ping

Performs an unauthenticated health check probe returning server connectivity confirmation along with the client's public IP address and echoed request headers.

## Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/ping`
- **Authentication:** None (Public)
- **Content-Type:** None
- **Success status:** `200 OK`

## Authentication & Permissions

- Public endpoint. No authentication token or API key required.
- Suitable for Kubernetes liveness/readiness probes, uptime monitors, and load balancer health checks.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| User-Agent | string | No | Client application identifier. |

### Example Request

```http
GET /api/v1/ping HTTP/1.1
Host: api.suffa.app
```

## Response

### Success: `200 OK`

```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    "message": "PONG",
    "method": "GET",
    "ip": "203.0.113.195",
    "headers": {
      "host": "api.suffa.app",
      "user-agent": "SuffaMobile/1.0.0 (Android)",
      "x-forwarded-for": "203.0.113.195",
      "accept": "*/*"
    }
  },
  "timestamp": "2026-10-28T00:44:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful health check response. |
| message | string | No | Response descriptor. |
| data.message | string | No | Fixed liveness confirmation text (`"PONG"`). |
| data.method | string | No | HTTP request method detected by the server. |
| data.ip | string | No | Client IP address parsed from the request connection or reverse proxy headers. |
| data.headers | object | No | Echoed request headers received by the server. |
| timestamp | string | No | Server response ISO 8601 timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 502 / 503 | Server down or unreachable | Server or gateway unavailable; show offline/maintenance banner. |

## Frontend Notes

- Loading state: Light heartbeat indicator.
- Empty state: N/A.
- Retry behavior: Ideal for periodic liveness polling with exponential backoff on failure.
- Cache invalidation: Never cache responses to this endpoint (`Cache-Control: no-cache, no-store`).
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Server Analytics Telemetry](./analytics.md)
