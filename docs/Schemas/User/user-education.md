# Education Schema

This document describes an **Education object**, which represents one academic record of a user.

A user can have:

- multiple education entries (school, college, university, courses, etc.)

---

## Education Object (High-Level)

```ts
Education {
  id: string
  userId: string
  title: string
  institution: Institution
  degreeType: DegreeType
  fieldOfStudy?: string
  startDate: string (ISO Date)
  endDate?: string (ISO Date)
  isCurrent: boolean
  grade?: string
  description?: string
}
```

---

## DegreeType (Enum)

Possible values for `degreeType`:

```ts
DegreeType =
  | "high_school"
  | "intermediate"
  | "associate"
  | "bachelor"
  | "master"
  | "doctorate"
  | "diploma"
  | "certificate"
  | "other"
```

This is mainly for:

- filtering
- badges
- icons
- grouping education levels

---

## Field-by-Field Explanation

### 1. Core Identity

#### `id: string`

Unique ID of this education record.

Used for:

- edit
- delete
- reorder

---

#### `userId: string`

ID of the user this education belongs to.

Frontend usually **does not need to care**, unless:

- admin panel
- multi-user dashboards

---

### 2. Education Details

#### `title: string`

Main title of the education.

Think:

- "BS Computer Science"
- "Intermediate in Pre-Engineering"
- "Full Stack Web Development"

Example:

```json
"title": "Bachelor of Computer Science"
```

---

#### `degreeType: DegreeType`

Standardized category of education level.

Example:

```json
"degreeType": "bachelor"
```

Useful for:

- sorting timeline
- showing icons (🎓)
- filtering profiles

---

#### `fieldOfStudy?: string`

Specific domain.

Example:

```json
"fieldOfStudy": "Artificial Intelligence"
```

Optional.

---

### 3. Institution Object

#### `institution: Institution`

```ts
Institution {
  name: string
  location?: string
  website?: string
}
```

This represents the school/college/university.

---

#### `institution.name`

Required.

Example:

```json
"name": "FAST NUCES"
```

---

#### `institution.location`

Optional.

Example:

```json
"location": "Karachi, Pakistan"
```

---

#### `institution.website`

Optional.

Example:

```json
"website": "https://nu.edu.pk"
```

Frontend use cases:

- clickable link
- map previews
- verified badges

---

### 4. Time Period

#### `startDate: string`

When education started.

Example:

```json
"startDate": "2022-09-01"
```

---

#### `endDate?: string`

When education ended.

- Can be `null`
- Missing if still studying

Example:

```json
"endDate": "2026-06-01"
```

---

#### `isCurrent: boolean`

Indicates ongoing education.

- `true` → still studying
- `false` → completed

Example:

```json
"isCurrent": true
```

UI logic:

```js
if (isCurrent) show("Present");
else show(endDate);
```

---

### 5. Performance & Description

#### `grade?: string`

Any grading format.

Examples:

- `"3.8 GPA"`
- `"A+"`
- `"85%"`

---

#### `description?: string`

Free text.

Used for:

- achievements
- honors
- projects
- thesis

Example:

```json
"description": "Focused on AI, ML, and distributed systems."
```

---

## Example Full Object

```json
{
  "id": "edu_123",
  "userId": "user_456",
  "title": "Bachelor of Computer Science",
  "degreeType": "bachelor",
  "fieldOfStudy": "Artificial Intelligence",
  "institution": {
    "name": "FAST NUCES",
    "location": "Karachi, Pakistan",
    "website": "https://nu.edu.pk"
  },
  "startDate": "2022-09-01",
  "endDate": "2026-06-01",
  "isCurrent": false,
  "grade": "3.7 GPA",
  "description": "Focused on ML, data science, and system design."
}
```

---

## Mental Model

Think of Education as:

```
Education
 ├── What?      → title, degreeType, fieldOfStudy
 ├── Where?     → institution
 ├── When?      → startDate, endDate, isCurrent
 └── How well?  → grade, description
```
