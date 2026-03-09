---
id: media-schema
title: Media Schema
---

# Media Schema

This document defines a **Media object**, which represents a stored/uploaded media asset and its metadata.

Think of it as:

> **One media = storage identity + ownership + provider + file metadata**

---

## Media Object (High-Level)

```ts
Media {
  id: string
  storageKey: string
  url: string
  type: FileType
  ownerType: MediaOwners
  provider: StorageProviders
  providerMeta?: Record<string, any>
  thumbnail?: string
  blurHash?: string
  width?: number
  height?: number
  duration?: number
  size: number
  createdAt: string
  updatedAt: string
}
```

---

## Core Concept (Mental Model)

A **Media = Identity + Storage Provider + Technical Metadata**

It answers:

- _Where is this file stored?_ (`storageKey`, `provider`, `providerMeta`)
- _How can clients access it?_ (`url`, optional `thumbnail`)
- _What kind of file is it?_ (`type`, `size`, dimensions/duration)
- _Who owns/uses this media?_ (`ownerType`)

---

## Enums

### FileType

Represents the logical media/file classification.

```ts
FileType =
  | "image"
  | "vector"
  | "file"
  | "video"
  | "audio"
  | "word"
  | "excel"
  | "ppt"
  | "pdf"
  | "txt"
  | "markdown"
  | "csv"
  | "epub"
  | "mobi"
  | "zip"
  | "rar"
  | "7z"
  | "tar"
  | "gz"
```

---

### MediaOwners

Represents which domain entity owns this media.

```ts
MediaOwners =
  | "message"
  | "profile"
  | "post"
```

---

### StorageProviders

Represents which storage backend is used.

```ts
StorageProviders =
  | "CLOUDINARY"
  | "S3"
```

---

## Field-by-Field Breakdown

### 1. Identity & Storage

#### `id: string`

Unique identifier of the media document.

---

#### `storageKey: string`

Provider-side storage key/public identifier for this file.

Used for:

- retrieval and lifecycle operations in storage provider
- delete/replace workflows

Notes:

- required in schema
- indexed

---

#### `url: string`

Resolved URL/path used to access the media file.

Used for:

- client rendering and playback
- sharing/downloading

Notes:

- indexed

---

### 2. Classification & Ownership

#### `type: FileType`

Logical file/media category.

Notes:

- validated against `FileType` enum
- indexed

---

#### `ownerType: MediaOwners`

Declares which entity type this media belongs to.

Notes:

- required in schema
- validated against `MediaOwners` enum
- indexed

---

### 3. Provider Details

#### `provider: StorageProviders`

Storage backend used for this media.

Notes:

- defaults to `process.env.STORAGE_PROVIDER` if set, otherwise `"CLOUDINARY"`
- validated against `StorageProviders`

---

#### `providerMeta?: Record<string, any>`

Provider-specific metadata blob (public ID, version, transformation data, etc.).

---

### 4. Render Metadata

#### `thumbnail?: string`

Optional URL/path for preview thumbnail.

---

#### `blurHash?: string`

Optional compact placeholder hash for progressive image loading.

---

#### `width?: number`

Optional media width in pixels.

---

#### `height?: number`

Optional media height in pixels.

---

#### `duration?: number`

Optional duration (typically in seconds) for audio/video assets.

---

#### `size: number`

File size in bytes.

Notes:

- required in schema

---

### 5. Timestamps

#### `createdAt: string`

Creation timestamp in ISO format (auto-managed by Mongoose timestamps).

---

#### `updatedAt: string`

Last update timestamp in ISO format (auto-managed by Mongoose timestamps).

---

## Rules and Constraints

These are practical rules implied by the schema:

1. **Storage identity is mandatory**
   - `storageKey` and `size` must exist for every media record.

2. **Ownership is explicit**
   - `ownerType` is required and restricted to known owner categories.

3. **File type is controlled**
   - `type` must be one of the allowed `FileType` enum values.

4. **Provider fallback exists**
   - `provider` defaults to env-defined storage provider, else `CLOUDINARY`.

5. **Metadata is flexible**
   - optional technical fields (`thumbnail`, `blurHash`, `width`, `height`, `duration`, `providerMeta`) support multiple media types.

---

## Indexing and Performance Notes

Defined indexes:

- `storageKey` index for provider-side lookups
- `url` index for URL-based lookups
- `type` index for type filtering
- `ownerType` index for ownership-based queries

---

## Common Operations (Workflow Mapping)

Common actions and touched fields:

- **Create media record after upload** -> `storageKey`, `url`, `type`, `ownerType`, `provider`, `size`
- **Attach media to message/profile/post** -> `ownerType`, relation kept by consuming domain model
- **Generate previews/placeholders** -> update `thumbnail`, `blurHash`
- **Store dimensions/duration** -> update `width`, `height`, `duration`
- **Provider-specific reconciliation** -> update/read `providerMeta`

---

## Full Example Media Object

```json
{
  "id": "67d0f84f0a4f4f49f2a4c333",
  "storageKey": "message_media/abc123",
  "url": "https://res.cloudinary.com/demo/image/upload/v1/message_media/abc123.jpg",
  "type": "image",
  "ownerType": "message",
  "provider": "CLOUDINARY",
  "providerMeta": {
    "public_id": "message_media/abc123",
    "version": 1741516200
  },
  "thumbnail": "https://res.cloudinary.com/demo/image/upload/c_thumb,w_300/message_media/abc123.jpg",
  "blurHash": "LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
  "width": 1920,
  "height": 1080,
  "duration": null,
  "size": 348120,
  "createdAt": "2026-03-09T10:30:00.000Z",
  "updatedAt": "2026-03-09T10:30:00.000Z"
}
```
