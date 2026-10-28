---
id: analytics
title: Server Analytics Telemetry
---

# Server Analytics Telemetry

Returns comprehensive Node.js process runtime metrics including heap allocation, resident set size (RSS), CPU usage deltas, and resource utilization counters.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/v1/analytics`
- **Authentication:** None (Public)
- **Content-Type:** `application/json`
- **Success status:** `201 Created`

## Authentication & Permissions

- Public endpoint. No authentication required.
- Designed for system dashboards, monitoring daemons, and administrative observability.

## Request

### Headers

| Header | Type | Required | Description |
|---|---|---|---|
| Content-Type | string | No | `application/json` |

### Request Body

No request body is required.

### Example Request

```http
POST /api/v1/analytics HTTP/1.1
Host: api.suffa.app
```

## Response

### Success: `201 Created`

```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "timestamp": "2026-10-28T00:45:00.000Z",
    "memoryUsage": {
      "rss": 134217728,
      "heapTotal": 67108864,
      "heapUsed": 45123456,
      "external": 12582912,
      "arrayBuffers": 4194304
    },
    "cpuUsage": {
      "user": 1250000,
      "system": 420000
    },
    "resourceUsage": {
      "userCPUTime": 1250000,
      "systemCPUTime": 420000,
      "maxRSS": 131072,
      "sharedMemorySize": 0,
      "unsharedDataSize": 0,
      "unsharedStackSize": 0,
      "minorPageFault": 3200,
      "majorPageFault": 4,
      "swappedOut": 0,
      "fsRead": 120,
      "fsWrite": 85,
      "ipcSent": 0,
      "ipcReceived": 0,
      "signalsCount": 0,
      "voluntaryContextSwitches": 1500,
      "involuntaryContextSwitches": 250
    },
    "threadCpuUsage": {
      "user": 1100000,
      "system": 380000
    }
  },
  "timestamp": "2026-10-28T00:45:00.120Z"
}
```

### Response Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| success | boolean | No | Always `true` on successful execution. |
| message | string | No | Response descriptor. |
| data.timestamp | string | No | ISO 8601 timestamp when sample was gathered. |
| data.memoryUsage | object | No | Node.js process memory metrics in bytes. |
| data.memoryUsage.rss | integer | No | Resident Set Size (total memory allocated for the process execution). |
| data.memoryUsage.heapTotal | integer | No | Total size of the allocated V8 heap. |
| data.memoryUsage.heapUsed | integer | No | Actual memory currently in use by V8 JavaScript objects. |
| data.memoryUsage.external | integer | No | Memory used by C++ bindings and buffers bound to V8 objects. |
| data.memoryUsage.arrayBuffers | integer | No | Memory allocated for ArrayBuffers and SharedArrayBuffers. |
| data.cpuUsage | object | No | Microseconds spent in user and system CPU modes. |
| data.cpuUsage.user | integer | No | Microseconds in user code. |
| data.cpuUsage.system | integer | No | Microseconds in system/kernel code. |
| data.resourceUsage | object | No | Low-level OS resource usage statistics. |
| data.threadCpuUsage | object | No | CPU usage counters specific to the current executing thread. |
| timestamp | string | No | Response envelope timestamp. |

## Error Responses

| Status | Meaning | Frontend action |
|---|---|---|
| 500 | Server error | Retry request after backoff interval. |

## Frontend Notes

- Loading state: Display metric chart refresh spinner.
- Empty state: N/A.
- Retry behavior: Safe to poll periodically (e.g., every 15–30 seconds) on administrative monitoring pages.
- Cache invalidation: Do not cache realtime metric responses.
- Side effects: None.
- Related realtime events: None.

## Related Endpoints

- [Server Liveness Ping](./ping.md)
