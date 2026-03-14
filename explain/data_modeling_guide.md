# The Developer's Guide to Data Modeling

Data modeling is the process of mapping real-world business requirements into a structured database schema. It is a mix of logic, foresight, and trade-offs.

---

## 1. The Developer's Mindset
When a developer looks at a feature, they don't see buttons or screens; they see **Entities** and **Interactions**.

### How to Spot an Entity: "The Noun Trick"
If you are reading a PRD or a user story, the **Nouns** are usually your entities.
- *User Story*: "A **Manager** wants to create a **Project** and add **Test Cases** to a **Folder**."
- *Entity Candidates*: Manager (User), Project, Test Case, Folder.

### The "ID Test"
If you have a noun, ask: **"Does it need its own ID?"**
- Does it matter *which* button you clicked? No, just that you clicked "a" button. (Not an entity).
- Does it matter *which* Test Case failed? Yes! (Entity).

### The Lifecycle Test
Does this thing exist independently?
- A **Comment** usually can't exist without a **Test Case**.
- A **User** can exist even if they haven't created any **Projects**.
- If a thing has its own "Life" (it can be created, edited, and deleted separately), it’s an Entity.

---

## 2. Step 2: Define, Connect, Refine

Once you have your entities, follow this 3-step workflow to turn them into a schema.

### 1. Define: "What is it made of?"
Add the properties (fields) that describe the thing.
- **Rule of Thumb**: Start with the ID, timestamps (`createdAt`, `updatedAt`), and the most obvious fields.
- **Prisma Syntax**:
    ```prisma
    model Project {
      id        String   @id @default(uuid())
      name      String
      createdAt DateTime @default(now())
    }
    ```

### 2. Connect: "The Relationship Framework"
This is where you ask the **4 Magic Questions** (see Section 3 below) to link your entities.
- Decide if it's 1:1, 1:N, or N:M.
- **Developer Move**: Always write the relationship on **both** models in Prisma. It makes it easier to query from either side.

### 3. Refine: "The Production Polish"
Add constraints to ensure data quality.
- **@unique**: Can two projects have the same name? (Maybe not in the same workspace).
- **Optional vs Required**: Can a project exist without a description? (`description String?`).
- **Indexes**: Will I search for projects by name often? (`@@index([name])`).

---

## 2. The Relationship Framework (The 4 Questions)

When you identify two entities, ask these four questions to determine the relationship type:

### Q1: "Can One [A] have many [B]?"
- *Example*: Can one **User** have many **Projects**? Yes.
- *Result*: This suggests at least a One-to-Many interaction.

### Q2: "Can One [B] have many [A]?"
- *Example*: Can one **Project** have many **Users**? Yes (if it's a team).
- *Result*: If the answer to both Q1 and Q2 is "Yes", it is a **Many-to-Many (N:M)** relationship.

### Q3: "What happens if [A] is deleted?"
- *Example*: If a **User** is deleted, what happens to their **Sessions**?
- *Logic*: If the session becomes useless, use `onDelete: Cascade`. If the data must stay (like an Invoice), set it to `Restrict` or `SetNull`.

### Q4: "Do I need to store data *about* the connection?"
- *Example*: I have Users and Organizations. I need to know if the user is an "Admin" or a "Tester".
- *Logic*: The "Role" doesn't belong to the User (they might have different roles in different companies) and it doesn't belong to the Organization. It belongs to the **Association**.
- *Result*: Create a **Join Table** (e.g., `Member`).

---

## 3. Relationship Cheat Sheet

| Relationship | Logic | Prisma Pattern | Real-World Example |
| :--- | :--- | :--- | :--- |
| **One-to-One (1:1)** | Uniqueness on both sides. | `@unique` on the Foreign Key. | User <-> Profile |
| **One-to-Many (1:N)** | Parent owns children. | `@relation` on the "Many" side. | Project <-> Test Cases |
| **Many-to-Many (N:M)** | Group membership. | Join Table or Prisma Implicit. | Users <-> Teams |

---

## 4. The "Future-Proof" Checklist

Before you finalize any schema, run through these final sanity checks:

1. **Normalization**: Am I storing the same piece of data (like a name) in two different tables? If yes, can I move it to one central place?
2. **Access Patterns**: Which entity will I query the most? (e.g., "Give me all Tests for this Project"). Add an `@@index` to the foreign key for performance.
3. **Auditability**: Do I need to know *when* this was created or *who* changed it? (Add `createdAt` and `updatedAt`).
4. **Soft vs. Hard Delete**: Should the data disappear permanently, or should I just add a `deletedAt` timestamp?

---

## 5. Advanced Pro Tips

### Enums vs. Tables: "When to use which?"
- **ENUM**: Use for static, rarely changing values (e.g., `Priority: LOW, MEDIUM, HIGH` or `Status: PASS, FAIL`).
- **TABLE**: Use if you need to store *more* information about the value (e.g., a "Test Status" that needs a custom color, a description, and an 'order' field for the UI).
- **Rule**: If it's just a label, use an Enum. If it's a "thing" with its own properties, use a Table.

### The Hierarchy Pattern (Self-Relations)
In Ayewo, we have **Folders**. A Folder can contain other Folders.
- **Developer Move**: Use a **Self-Relation**.
- **Prisma Syntax**:
    ```prisma
    model Folder {
      id        String   @id @default(uuid())
      parentId  String?
      parent    Folder?  @relation("SubFolders", fields: [parentId], references: [id])
      children  Folder[] @relation("SubFolders")
    }
    ```

### Normalization Intuition: "Don't Repeat Yourself (DRY)"
Formal database theory (1NF, 2NF, 3NF) can be complex. Instead, follow this simple intuition:
- **The "Single Source of Truth" Rule**: Every piece of information should live in exactly **one** place. 
- If you change a User's name, you shouldn't have to update 100 "Test Case" records that also store the name. You store it in the `User` table and *link* to it.

---

## 6. The "World-Class" Summary
A world-class schema is:
1. **Readable**: Anyone can look at it and understand the business.
2. **Strict**: It uses `@unique` and `Required` fields to prevent "bad data".
3. **Performant**: It uses `@@index` on the fields used for searching.
4. **Flexible**: It uses Join Tables (`Member`) instead of hard-coded links to allow for future growth.
