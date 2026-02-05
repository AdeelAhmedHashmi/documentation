# Experience Schema

This document defines an **Experience object**, which represents one job or work experience entry in a user’s profile.

A user can have:

- multiple experiences (jobs, internships, freelance, etc.)

---

## Experience Object (High-Level)

```ts
Experience {
  id: string
  userId: string
  title: string
  company: Company
  jobType: JobType
  startDate: string (ISO Date)
  endDate?: string (ISO Date)
  isCurrent: boolean
  description?: string
  achievements?: string[]
}
```

---

## JobType (Enum)

Possible values:

```ts
JobType =
  | "full-time"
  | "part-time"
  | "internship"
  | "contract"
  | "freelance"
  | "volunteer"
  | "other"
```

Used for:

- badges
- filters
- icons
- analytics

Example:

```json
"jobType": "internship"
```

---

## Field-by-Field Breakdown

### 1. Core Identity

#### `id: string`

Unique ID of this experience record.

Used for:

- edit
- delete
- reorder
- drag & drop timelines

---

#### `userId: string`

ID of the owner.

Mostly irrelevant for normal frontend, except:

- admin dashboards
- multi-profile views

---

### 2. Role Details

#### `title: string`

Your role or position.

Examples:

- "Frontend Developer"
- "Software Engineer Intern"
- "UI/UX Designer"

Example:

```json
"title": "Full Stack Developer"
```

This is the **headline** of each experience card.

---

### 3. Company Object

#### `company: Company`

```ts
Company {
  name: string
  location?: string
  website?: string
}
```

---

#### `company.name`

Required.

Example:

```json
"name": "Google"
```

---

#### `company.location`

Optional.

Example:

```json
"location": "Remote"
```

---

#### `company.website`

Optional.

Example:

```json
"website": "https://google.com"
```

Frontend use:

- clickable logo
- verified company profile
- external link

---

### 4. Job Classification

#### `jobType: JobType`

Type of employment.

Examples:

```json
"jobType": "freelance"
"jobType": "full-time"
```

Perfect for:

- filters
- icons
- color tags

---

### 5. Time Period

#### `startDate: string`

When job started.

Example:

```json
"startDate": "2024-01-01"
```

---

#### `endDate?: string`

When job ended.

- Optional
- Missing if current job

Example:

```json
"endDate": "2025-01-01"
```

---

#### `isCurrent: boolean`

Indicates ongoing job.

Example:

```json
"isCurrent": true
```

Frontend logic:

```js
if (isCurrent) show("Present");
else show(endDate);
```

---

### 6. Description

#### `description?: string`

Short summary of the role.

Example:

```json
"description": "Worked on building scalable APIs and real-time systems."
```

Used in:

- profile bio
- resume exports
- job matching AI

---

### 7. Achievements

#### `achievements?: string[]`

List of accomplishments.

Example:

```json
"achievements": [
  "Built chat system used by 10k users",
  "Improved API performance by 40%",
  "Led a team of 3 developers"
]
```

Frontend UI:

- bullet list
- checklist
- collapsible section

---

## Full Example Object

```json
{
  "id": "exp_789",
  "userId": "user_456",
  "title": "Frontend Developer",
  "company": {
    "name": "Suffah Tech",
    "location": "Remote",
    "website": "https://suffah.dev"
  },
  "jobType": "full-time",
  "startDate": "2023-06-01",
  "endDate": null,
  "isCurrent": true,
  "description": "Building modern web apps with React and WebSockets.",
  "achievements": [
    "Designed real-time chat UI",
    "Reduced bundle size by 30%",
    "Implemented design system"
  ]
}
```

---

## Mental Model (Frontend Brain)

Think of Experience as:

```
Experience
 ├── Who?   → company
 ├── What?  → title, jobType
 ├── When?  → startDate, endDate, isCurrent
 └── Impact → description, achievements
```

---

## Perfect UI Use Cases

This schema supports:

### 1. LinkedIn-style Timeline

```
💼 Frontend Developer
   Suffah Tech — 2023 → Present
   - Designed real-time chat UI
   - Reduced bundle size by 30%
```

---

### 3. Career Analytics

- Total years of experience
- Most common jobType
- Career progression

---
