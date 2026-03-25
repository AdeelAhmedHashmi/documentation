---
id: thread-message-guide
title: Thread Messages Logical Structure
---

This guide explains how to model and serve nested replies in a thread system, from first principles.

## 1) Mental Model

A thread is a tree:

- A top-level comment is a root node.
- A reply points to a parent node.
- Replies can themselves have replies, creating depth.

Think of each message as a node with:

- Identity (`id`)
- Parent reference (`parentId`, nullable)
- Position metadata (`depth`, `path`, `pathIndex`)
- Counters (`directReplyCount`, `childrenCount`)
- Moderation/status flags (`isDeleted`, `isHidden`, `isEdited`)
- Ranking/time fields (`score`, `createdAt`)

## 2) Visual Tree Shape

```text

Message A
depth: 0
path: /A
pathIndex: 0001
childrenCount: 4
directReplyCount: 2
|
├─ Reply B
|  depth: 1
|  path: /A/B
|  pathIndex: 0001.0001
|  childrenCount: 2
|  directReplyCount: 2
|  |
|  └─ Reply C
|  |  depth: 2
|  |  path: /A/B/C
|  |  pathIndex: 0001.0001.0001
|  |  childrenCount: 0
|  |  directReplyCount: 0
|  |
|  └─ Reply D
|     depth: 2
|     path: /A/B/C
|     pathIndex: 0001.0001.0002
|     childrenCount: 0
|     directReplyCount: 0
|
└─ Reply E
   depth: 1
   path: /A/D
   pathIndex: 0001.0002
   childrenCount: 0
   directReplyCount: 0

```

## 3) Core Data Structure (Conceptual)

```json
{
  "id": "m_9001",
  "threadId": "t_100",
  "parentId": "m_9000",
  "depth": 2,
  "path": "/m_1000/m_9000/m_9001",
  "pathIndex": "0001.0003.0001",
  "content": "Nested reply example",
  "directReplyCount": 0,
  "childrenCount": 0,
  "score": 12,
  "isDeleted": false,
  "isHidden": false,
  "createdAt": "2026-03-25T10:30:00.000Z"
}
```

Why keep both `parentId` and path-like fields:

- `parentId` is perfect for fetching direct children.
- `path` is useful for grabbing an entire subtree quickly.
- `pathIndex` gives deterministic sibling ordering and bounded-depth logic.

## 4) Create Flow

### A) Create Root Message

```text
Client        API                 Database
  |            |                      |
  | Create message (no parentId)      |
  |----------->|                      |
  |            | Set depth = 0        |
  |            | Generate pathIndex   |
  |            | Insert root node     |
  |            |--------------------->|
  |            |      Created node    |
  |            |<---------------------|
  | Return created root               |
  |<-----------|                      |
```

### B) Create Reply Message

```text
Client        API                         Database
  |            |                              |
  | Create message (with parentId)            |
  |----------->|                              |
  |            | Load parent                  |
  |            |----------------------------->|
  |            | parent found                 |
  |            |<-----------------------------|
  |            | depth = parent.depth + 1     |
  |            | pathIndex = parent + segment |
  |            | Increment parent counters    |
  |            |----------------------------->|
  |            | Insert child node            |
  |            |----------------------------->|
  |            | Created node                 |
  |            |<-----------------------------|
  | Return created reply                      |
  |<-----------|                              |
```

## 5) Read Flow

### A) Initial Thread View

Return:

- Page of root messages
- Small preview of replies per root
- `nextCursor` for next root page

```text
[Request roots page]
        |
        v
[Query roots by threadId + depth=0]
        |
        v
[Sort + fetch limit+1]
        |
        v
[Compute hasMore + nextCursor]
        |
        v
[Batch query reply previews for returned roots]
        |
        v
[Return roots + repliesMap + nextCursor]
```

### B) Expand a Single Branch

When user clicks "load more replies" for one parent:

- Query children by `parentId`
- Apply cursor pagination
- Return `replies`, `nextCursor`, `hasMore`

## 6) Cursor Pagination Concept

Offset pagination can skip or duplicate rows when data changes. Cursor pagination is safer for active conversations.

Cursor usually stores:

- Last item id
- Last item sort value (`score` or `createdAt`)

Next page rule:

- For descending sort: fetch records strictly "after" last seen tuple.
- For ascending sort: invert comparison accordingly.

## 7) Sorting Modes (Common Pattern)

- `top`: by score, then id tiebreaker
- `new`: newest first
- `old`: oldest first

Always include a stable tiebreaker (`id`) to avoid inconsistent ordering.

## 8) Tree Reconstruction on Client

Two common options:

- Server returns flat rows; client builds tree with `parentId`.
- Server returns roots + lightweight reply previews per root; client expands lazily.

Recommended for large threads:

- Load roots first
- Show preview replies
- Expand on demand
- Deep-load subtree only when user requests it

## 9) Important Invariants

- Root messages have `parentId = null` and `depth = 0`.
- Child depth is always `parent.depth + 1`.
- Every non-root node belongs to exactly one parent.
- Soft-deleted/hidden messages should be consistently filtered from normal reads.
- Counters should remain eventually consistent with create/delete operations.

## 10) Practical Tradeoffs

- Storing path metadata increases write complexity but makes subtree reads fast.
- Preview-based loading improves UX and reduces initial payload size.
- Cursor pagination is more reliable than page offsets for active, mutable threads.

## 11) Common Pitfalls

- Missing stable sort tiebreaker causes duplicate/missing rows across pages.
- Unbounded subtree fetch can become expensive; cap depth or record count.
- Updating parent counters without transaction safety can drift under concurrency.
- Deletion strategy (soft vs hard) must be consistent with counters and moderation.
