# Schema Design — Personal Productivity Hub

---

## 1. Collections Overview

- **users** — Stores registered users with hashed passwords. Each user owns projects and notes.
- **projects** — Represents a project owned by a user. Tasks and notes reference projects by ObjectId.
- **tasks** — Represents a task inside a project. Embeds subtasks and tags directly since they are owned by the task and always read together.
- **notes** — Standalone or project-linked notes owned by a user. Contains an optional projectId reference.

---

## 2. Document Shapes

### users
{
_id: ObjectId,
email: string (required, unique),
passwordHash: string (required),
name: string (required),
createdAt: Date (required)
}

### projects
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
name: string (required),
description: string (optional),
archived: boolean (required, default: false),
createdAt: Date (required)
}

### tasks
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
projectId: ObjectId (required, ref: projects),
title: string (required),
status: string (required, enum: "todo"|"in-progress"|"done"),
priority: number (required, default: 1),
tags: string[] (optional, default: []),
subtasks: [{ title: string, done: boolean }] (optional, default: []),
createdAt: Date (required),
dueDate: Date (optional)
}

### notes
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
projectId: ObjectId (optional, ref: projects),
title: string (required),
content: string (required),
tags: string[] (required, default: []),
createdAt: Date (required)
}

---

## 3. Embed vs Reference — Decisions

| Relationship                  | Embed or Reference? | Why? |
|-------------------------------|---------------------|------|
| Subtasks inside a task        | Embed               | Subtasks are owned exclusively by their task, always read together, and never queried independently. |
| Tags on a task                | Embed               | Tags are simple strings scoped to one task; no separate collection needed. |
| Project → Task ownership      | Reference           | Tasks are queried independently (by status, priority), so they reference projectId as an ObjectId. |
| Note → optional Project link  | Reference           | A note can exist without a project, so projectId is an optional reference rather than a required embed. |

---

## 4. Schema Flexibility Example

The `dueDate` field exists on some task documents but not all. In MongoDB this is perfectly acceptable because documents in the same collection do not need identical fields. Tasks without a deadline simply omit the field entirely rather than storing a null, keeping documents clean and reflecting real-world variability.