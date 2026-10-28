---
slug: suffa-api-docs-v2-breaking-changes
title: "Suffa API Docs 2.0: Breaking Changes and Migration Guide"
description: Route, request-contract, and documentation-structure changes in the Suffa API documentation 2.0 release.
authors:
  - adeel
tags:
  - suffa
  - api
  - documentation
  - breaking-change
  - release
date: 2026-10-28
---

# Suffa API Docs 2.0: Breaking Changes and Migration Guide

Documentation version **2.0** is now the default release. It replaces the old `EndPoints` layout with a domain-based structure and updates the reference to the current backend contract.

Several routes and request bodies changed between the 1.0 docs and 2.0 docs. If your client was built against the 1.0 reference, review the changes below before upgrading.

{/* truncate */}

> **Breaking change**
> The 2.0 docs are not a drop-in replacement for the 1.0 reference. Some routes were renamed, some request fields are now required, and old documentation URLs have moved.

## What changed at a glance

| Area | 1.0 docs | 2.0 docs |
|---|---|---|
| API prefix | `/v1` in examples | `/api/v1` everywhere |
| Self profile | `GET /user/profile` | `GET /api/v1/user/profile/me` |
| Public profile | `GET /user/profile/:userId` | `GET /api/v1/user/profile/:id` |
| Education CRUD | `/user/profile/settings/education` | `/api/v1/user/profile/info/education` |
| Join requests | `POST /group/request/:reqType` | `POST /api/v1/group/request` |
| Group blocklist | `GET /group/:groupId/blacklist` | `GET /api/v1/group/:groupId/blocks` |
| Conversation message body | `content`, `type`, attachments | also requires `conversationType` |
| Documentation paths | `/docs/EndPoints/...` | `/docs/...` |

## 1. The API prefix is now `/api/v1`

Every endpoint in 2.0 uses the global `/api/v1` prefix:

```http
GET /api/v1/user/profile/me
Authorization: Bearer <access_token>
```

The 1.0 docs mixed `/v1`, unprefixed routes, and `{{baseUrl}}` examples. Update any stored base URL or hard-coded path before migrating.

## 2. Profile routes were split and renamed

The single 1.0 profile endpoint handled both the authenticated user and public profiles. In 2.0 these are separate routes:

| Purpose | 1.0 | 2.0 |
|---|---|---|
| Current user's profile | `GET /user/profile` | `GET /api/v1/user/profile/me` |
| Another user's profile | `GET /user/profile/:userId` | `GET /api/v1/user/profile/:id` |

Update the self-profile call first. It is the most common route used by clients after login.

## 3. Education routes moved

Education endpoints no longer live under `/user/profile/settings/education`. They now use the same `info` namespace as experience:

| Action | 1.0 | 2.0 |
|---|---|---|
| Create | `POST /user/profile/settings/education` | `POST /api/v1/user/profile/info/education` |
| Read own | `GET /user/profile/settings/education` | `GET /api/v1/user/profile/info/education` |
| Update | `PATCH /user/profile/settings/education/:educationId` | `PATCH /api/v1/user/profile/info/education/:educationId` |
| Delete | `DELETE /user/profile/settings/education/:educationId` | `DELETE /api/v1/user/profile/info/education/:educationId` |
| Read another user | `GET /user/profile/info/education/:userId/get` | `GET /api/v1/user/profile/info/education/:userId/get` |

Experience routes keep their existing shape, but still need the `/api/v1` prefix.

## 4. Group join requests changed shape

The 1.0 docs described a route with a `:reqType` path segment (with examples such as `/group/add/request` and `/group/remove/request`) to create or cancel a request:

```http
POST /group/request/:reqType?invitationCode=<code>
```

In 2.0 there is a single toggle endpoint:

```http
POST /api/v1/group/request?invitationCode=<code>
```

Calling the endpoint again cancels the pending request. Remove the `add` or `remove` segment from existing integrations.

## 5. The group blocklist route was renamed

The blocklist read endpoint changed from `blacklist` to `blocks`:

```http
GET /api/v1/group/:groupId/blocks?page=1&limit=20
```

The block and unblock actions remain `PATCH /api/v1/group/member/block` and `PATCH /api/v1/group/member/unblock`.

## 6. Conversation messages now require `conversationType`

The conversation message endpoint is still `PATCH /api/v1/message/send/:conversationId`, but the body now requires a `conversationType` field set to `chat` or `group`:

```json
{
  "content": "Automated integration testing helps catch regressions before deploying.",
  "type": "text",
  "conversationType": "group",
  "replyTo": "6a4e54bb1725ec10e4314538"
}
```

The allowed message `type` values also expanded to `text`, `image`, `video`, `audio`, `gif`, `emoji`, `file`, and `system`.

For direct messages, the path parameter is now named `receiverId` in the docs:

```http
POST /api/v1/message/send/:receiverId
```

## 7. Device approval no longer requires a bearer token

`GET /api/v1/devices/:decision/:token` is documented as a public endpoint in 2.0. It is opened through a magic link, and the decision must be `approve` or `reject`.

Remove any client-side assumption that this request needs an `Authorization` header.

## 8. New endpoint sections in 2.0

The following domains are new or newly documented:

- **Circles** — create and read community circles, update circle information, and update circle images.
- **Reactions** — toggle reactions, read reaction summaries, and list users who reacted.
- **System Events** — fetch conversation-scoped events for client synchronization.
- **System Health** — ping and runtime analytics endpoints.
- **User Settings** — read and update privacy and account settings.
- **Private chat by ID** — `GET /api/v1/chat/:chatId`.
- **Group discovery** — group preview and invitation-code lookup endpoints.
- **Message editing** — `PATCH /api/v1/message/edit/:conversationId/:messageId`.
- **Thread hard delete** — `DELETE /api/v1/thread/:threadId/delete/hard`.

## 9. Documentation URLs changed

The old `EndPoints` directory is gone from the current docs. Pages now map directly to their domain, and the 1.0 reference lives under the `/docs/1.0/` archive path:

| 1.0 archive path | 2.0 path |
|---|---|
| `/docs/1.0/EndPoints/group-chat/create-group` | `/docs/group-chat/create-group` |
| `/docs/1.0/EndPoints/profile-managment/update-profile` | `/docs/profile-management/update-profile` |
| `/docs/1.0/EndPoints/authentication/device-registeration/register-device` | `/docs/authentication/device-registration/register-device` |

Folder spelling was also corrected: `profile-managment` is now `profile-management`, and `device-registeration` / `user-registeration` are now `device-registration` / `user-registration`.

Any bookmarks or external links pointing at the old latest-version paths need to be updated. The 1.0 archive keeps the legacy layout.

## Migration checklist

1. Replace the base URL with `/api/v1`.
2. Change self-profile calls to `GET /api/v1/user/profile/me`.
3. Move education calls from `/user/profile/settings/education` to `/api/v1/user/profile/info/education`.
4. Replace `POST /group/request/add` and `/remove` with `POST /api/v1/group/request`.
5. Replace `GET /group/:groupId/blacklist` with `GET /api/v1/group/:groupId/blocks`.
6. Add `conversationType` to conversation message requests.
7. Stop sending a bearer token to the device approval magic link.
8. Update documentation links and bookmarks to the new page paths.
9. Re-test message sending, profile reads, education CRUD, and group join flows against the current backend.

## Compatibility

The 1.0 documentation remains available from the version dropdown for reference. It describes the older contract, so do not use it as the integration guide for a client that targets the current backend.

The 2.0 reference is the source of truth for the routes and payloads described above. The legacy `Guide` and `RealTime` pages remain in the 1.0 archive and are not part of the 2.0 navigation yet.

If you maintain a client against the Suffa API, migrate the routes in the checklist before shipping the next release.
