---
title: Media Schema
description: Comprehensive documentation for the Media schema used in file storage and management
sidebar_position: 2
tags: [schema, media, storage, cloudinary, file-management]
---

# Media Schema Documentation

## Overview

The Media schema is the central data structure for managing all file uploads, storage, and metadata across the Suffa platform. It integrates with multiple storage providers (Cloudinary, S3, etc.), tracks file metadata (dimensions, duration, size), and supports media optimization features like thumbnails and blur hashes.

## Schema Structure

### Primary Concepts

The Media schema is designed with the following principles:

- **Provider-agnostic**: Support for multiple storage providers with flexible metadata
- **Metadata-rich**: Comprehensive tracking of file properties and dimensions
- **Ownership model**: Clear tracking of media ownership and type
- **Optimization ready**: Built-in support for thumbnails and progressive loading
- **Performance focused**: Indexed queries for efficient media retrieval

## Core Fields

### Storage & Identification

| Field          | Purpose                             | Details                                         |
| -------------- | ----------------------------------- | ----------------------------------------------- |
| **storageKey** | Unique identifier in storage system | Provider-specific key; indexed for fast lookups |
| **url**        | Accessible URL for the media        | Direct link to file; indexed for retrieval      |
| **provider**   | Storage service provider            | Supports Cloudinary (default), S3, and others   |

### File Characteristics

| Field        | Purpose                        | Details                                                                     |
| ------------ | ------------------------------ | --------------------------------------------------------------------------- |
| **type**     | Classification of file content | Supports: IMAGE, VIDEO, AUDIO, DOCUMENT, PDF, etc. (see FileType constants) |
| **size**     | File size in bytes             | Required field; useful for bandwidth and storage calculations               |
| **width**    | Image/video width in pixels    | Optional; only relevant for visual media                                    |
| **height**   | Image/video height in pixels   | Optional; only relevant for visual media                                    |
| **duration** | Media duration in seconds      | Optional; for audio and video files                                         |

### Ownership & Access Control

| Field         | Purpose                 | Details                                             |
| ------------- | ----------------------- | --------------------------------------------------- |
| **ownerType** | Category of media owner | Indicates context: USER, PROFILE, CHAT, GROUP, etc. |

### Optimization & Display

| Field            | Purpose                         | Details                                                |
| ---------------- | ------------------------------- | ------------------------------------------------------ |
| **thumbnail**    | URL to thumbnail version        | Optimized preview for faster loading                   |
| **blurHash**     | Perceptual hash for placeholder | Enables blur effect while loading (blurhash algorithm) |
| **providerMeta** | Provider-specific metadata      | Flexible object for storing provider-unique data       |

### Automatic Timestamps

| Field         | Purpose                     | Details                 |
| ------------- | --------------------------- | ----------------------- |
| **createdAt** | File upload timestamp       | Auto-managed by MongoDB |
| **updatedAt** | Last modification timestamp | Auto-managed by MongoDB |

## Field Details by Data Type

### Storage Provider Types

The schema supports multiple storage providers with this field:

| Provider          | Use Case                               | Metadata Type                        |
| ----------------- | -------------------------------------- | ------------------------------------ |
| **Cloudinary**    | Primary media hosting, transformations | Rich metadata with optimization URLs |
| **AWS S3**        | High-volume storage, backups           | Standard S3 metadata                 |
| **Local Storage** | Development, fallback                  | File system metadata                 |

### File Type Categories

The Media schema tracks various file types for appropriate handling:

- **IMAGE**: Photos, illustrations, diagrams (JPEG, PNG, WebP, GIF)
- **VIDEO**: Motion pictures and recordings (MP4, WebM, MOV)
- **AUDIO**: Sound files and recordings (MP3, WAV, M4A, OGG)
- **DOCUMENT**: Text documents (DOC, DOCX, TXT)
- **PDF**: Portable document format files
- **ARCHIVE**: Compressed files (ZIP, RAR, 7Z)
- **OTHER**: Miscellaneous file types

### Owner Type Categories

Media ownership is tracked by context for proper access control:

- **USER**: Profile pictures and personal media
- **PROFILE**: Cover images and profile-related media
- **CHAT**: Messages and chat media
- **GROUP**: Group profile and shared media
- **STORY**: Story content (temporary media)
- **POST**: Timeline/feed posts

## Indexing Strategy

The schema employs strategic indexing for performance optimization:

| Field          | Index Type        | Purpose                                    |
| -------------- | ----------------- | ------------------------------------------ |
| **storageKey** | Standard + Unique | Fast provider lookups, prevents duplicates |
| **url**        | Standard          | Quick resolution from URL references       |
| **type**       | Standard          | Efficient filtering by media type          |
| **ownerType**  | Standard          | Query media by ownership context           |
| **createdAt**  | Descending        | Chronological ordering without sorting     |

## Relationship Map

```
Media
├── storageKey → External Storage (Cloudinary/S3)
├── provider → Storage Configuration
├── providerMeta → Flexible Metadata Object
├── type → FileType Enumeration
├── ownerType → Owner Category
└── timestamps (createdAt, updatedAt)
```

## Key Behaviors & Patterns

### Media Lifecycle

1. **Upload**: File stored with provider, storageKey and URL generated
2. **Processing**: Thumbnails and blur hashes generated for optimization
3. **Metadata**: File dimensions, duration, and size calculated and stored
4. **Association**: Media linked to messages, profiles, or other documents
5. **Retrieval**: Quick access via optimized indexing and URL
6. **Deletion**: Provider and database cleanup (handled separately)

### Progressive Image Loading

The schema supports three-tier image loading strategy:

1. **Blur phase**: Display blurHash placeholder while loading
2. **Thumbnail phase**: Show low-quality thumbnail for preview
3. **Full quality**: Display complete, optimized image from URL

### Storage Provider Abstraction

The flexible `providerMeta` field stores provider-specific data:

**Cloudinary Example:**

- Transformation URLs for resizing
- Optimization parameters
- Secure signing tokens
- Delivery optimization settings

**S3 Example:**

- Bucket location
- Storage class
- Access permissions
- Versioning information

## Usage Scenarios

### User Profile Media

- Avatar images: ownerType = USER
- Cover photos: ownerType = PROFILE
- Optimized with thumbnails for gallery views

### Messaging Media

- Attachments in messages: ownerType = CHAT
- Individual or grouped media
- Full-quality with thumbnails for preview

### Group Media

- Group profile pictures: ownerType = GROUP
- Shared album content: ownerType = GROUP
- Quick retrieval for member displays

### Document Sharing

- PDFs and documents: type = PDF/DOCUMENT
- Metadata tracking for size and availability
- Provider-independent access

### Story/Temporary Content

- Short-lived media: ownerType = STORY
- Optional expiration through deletedAt pattern
- Fast thumbnail access for story preview strips

## Performance Considerations

- **Indexed queries**: Fast retrieval by type, owner, or provider
- **URL-based access**: Direct file serving without processing
- **Lazy loading**: Thumbnail strategy reduces initial bandwidth
- **Metadata caching**: Size and dimension data available without provider lookup
- **Provider abstraction**: Flexible providerMeta prevents schema changes per provider

## Content Delivery Optimization

### Responsive Media Sizes

The schema stores dimensions enabling responsive sizing:

- Original: Full resolution (url)
- Large: 800px breakpoint (thumbnail via provider)
- Medium: 400px breakpoint (thumbnail via provider)
- Small: 200px breakpoint (blurHash placeholder)

### Progressive Enhancement

1. **Network slow/offline**: Display blurHash placeholder
2. **Thumbnail ready**: Show low-quality preview (thumbnail)
3. **Full download**: Display high-quality image from URL
4. **User interaction**: Load full-resolution on demand

## Validation Rules

- **storageKey**: Required, non-empty string
- **type**: Must be valid FileType
- **ownerType**: Required, must be valid owner category
- **size**: Required, must be positive number
- **width/height/duration**: Optional but must be positive if provided
- **url**: Any valid string format

## Related Schemas

- [Message Schema](./message-schema.md) - Media attachment references
- [User Schema](./user-schema.md) - Profile media associations
- [Chat Schema](./chat-schema.md) - Chat media grouping

## Integration Points

### Message Integration

Messages reference Media via ObjectId for:

- Direct attachments
- Reply-quoted media
- Media grouping via mediaGroupId

### Profile Integration

User profiles reference Media for:

- Avatar images
- Cover photos
- Social proof images

### Storage Provider Integration

- Cloudinary: Transformations and CDN delivery
- AWS S3: Scalable object storage
- Local: Development and fallback storage

## Best Practices

1. **Always include metadata**: Populate width, height, duration for visual media
2. **Generate thumbnails**: Create thumbnail URLs for improved UX
3. **Use blur hashes**: Enable progressive image loading
4. **Validate file types**: Ensure file extensions match declared type
5. **Track size**: Maintain accurate byte counts for quota management
6. **Set owner type**: Always specify context for access control
7. **Store provider metadata**: Include provider-specific optimization data
