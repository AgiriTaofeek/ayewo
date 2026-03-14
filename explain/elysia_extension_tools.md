# Elysia Extension Tools: The Building Blocks of Plugins

To build scalable and maintainable applications in Elysia, you need to master these six core extension tools. They allow you to share logic, data, and behavior across your entire server.

---

## 1. `decorate`
**Purpose**: Adds functions or utility services to the request context.

- **Mental Model**: Like adding a "Global Service" to the framework.
- **Execution**: Runs **once** when the server starts.
- **Common Uses**: Database clients, Mailers, Loggers, Caches.

```typescript
new Elysia()
  .decorate('db', databaseClient)
  .decorate('getDate', () => new Date())
  .get('/users', ({ db, getDate }) => {
    console.log(getDate());
    return db.user.findMany();
  })
```

---

## 2. `state`
**Purpose**: Adds global shared data (stateful variables).

- **Mental Model**: A global data store shared across all requests.
- **Execution**: Runs **once** when the server starts.
- **Common Uses**: Config objects, feature flags, global counters, metrics.

```typescript
new Elysia()
  .state('counter', 0)
  .get('/', ({ store }) => {
    store.counter++; // Shared across ALL users
    return store.counter;
  })
```

---

## 3. `derive`
**Purpose**: Creates request-specific values based on the incoming request.

- **Mental Model**: A "Computed Property" that calculates data locally for every request.
- **Execution**: Runs **every request** before validation.
- **Common Uses**: Extracting tokens from headers, calculating "Search" objects from queries.

```typescript
new Elysia()
  .derive(({ headers }) => {
    const token = headers.authorization;
    return {
      user: token ? decode(token) : null
    }
  })
  .get('/profile', ({ user }) => user)
```

---

## 4. `resolve`
**Purpose**: Identical to `derive`, but runs **after** validation.

- **Mental Model**: A "Secure Derivation" that can trust the data has already been validated.
- **Execution**: Runs **every request** after the Validation stage.
- **Common Uses**: Securely resolving objects where you need to be sure the ID is a valid number.

| Tool | Runs | Use Case |
| :--- | :--- | :--- |
| **derive** | Before Validation | Quick extraction of raw data. |
| **resolve** | After Validation | Computing values from validated headers/params. |

---

## 5. `macro`
**Purpose**: Creates reusable, custom route options (behaviors).

- **Mental Model**: Custom "Keywords" you can add to route configurations to automate repetitive tasks.
- **Execution**: Processed at **Compile Time**.
- **Common Uses**: Adding `auth: true` to a route instead of repeating `beforeHandle` logic.

```typescript
app.macro({
  auth: (enabled: boolean) => ({
    beforeHandle: checkAuth // Automatically injected if auth: true
  })
})

// usage:
.get('/profile', handler, { auth: true })
```

---

## 6. `model`
**Purpose**: Defines reusable schemas (schemas as variables).

- **Mental Model**: A "Schema Registry" to avoid duplicating TypeBox or Zod definitions.
- **Execution**: Processed at **Compile Time**.

```typescript
app.model({
  User: t.Object({ id: t.Number(), name: t.String() })
})

// usage:
.get('/users', handler, { response: 'User' })
```

---

## Summary Table

| Feature | Runs | Primary Purpose |
| :--- | :--- | :--- |
| **decorate** | Server Start | Add shared services/functions |
| **state** | Server Start | Add global shared data |
| **derive** | Every Request | Compute values before validation |
| **resolve** | Every Request | Compute values after validation |
| **macro** | Compile Time | Reusable route behaviors (shortcuts) |
| **model** | Compile Time | Reusable data schemas |

---

## Mental Architecture

When designing a feature-rich Elysia system, use these tools to create a layered architecture:

1.  **Plugins**: Group related logic into standalone modules (like our `authPlugin`).
2.  **Decorate**: Inject the necessary services (DB, Auth).
3.  **State**: Manage shared configuration.
4.  **Derive/Resolve**: Map incoming requests to useful internal objects.
5.  **Macro/Model**: Simplify route definitions for your team.