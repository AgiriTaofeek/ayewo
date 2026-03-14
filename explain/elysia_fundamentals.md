# Elysia Fundamentals: Mastering the Modern Monolith

Elysia doesn't really have "middleware" in the way Express does. Instead, it uses **Hooks**, **Plugins**, and **Derivations**. Here is the absolute baseline you need to know to work with this codebase.

---

## 1. The Core Methods
- `.get()`, `.post()`, `.put()`, `.delete()`: Your standard HTTP verbs.
- `.all()`: Matches any HTTP method for a specific path.
- `.use()`: Attaches a **Plugin**. This is how you "install" features like CORS, Swagger, or even your own custom logic.

## 2. Shared Data: State vs. Derive
How do you pass data from one place to another?

### `.state()` (Global Data)
Used for constants or variables that don't change per request (like a database connection).
```typescript
app.state('version', '1.0.0')
   .get('/', ({ store }) => store.version) 
```

### `.derive()` (Per-Request Data)
This is where the magic happens. It calculates data **locally for each request**.
```typescript
app.derive(({ request, headers }) => {
    return {
        userIP: headers['x-real-ip'] || 'unknown'
    }
})
.get('/whoami', ({ userIP }) => `Your IP is ${userIP}`)
```
*Note: In the `/whoami` handler, `userIP` is now available directly in the context!*

---

## 3. Middleware = Hooks
In Express, middleware is a function that calls `next()`. In Elysia, you use **Hooks** to "tap into" the Lifecycle stations we discussed.

### Route-Level Hooks
You can add logic to a single route by passing an object as the third argument:
```typescript
app.get('/admin', () => "Welcome", {
    beforeHandle: ({ headers, set }) => {
        if (headers['admin-secret'] !== '123') {
            set.status = 401
            return "Unauthorized"
        }
    }
})
```

### Global Hooks (Guards)
Instead of repeating code, you can `.guard()` a whole group of routes:
```typescript
app.guard({
    beforeHandle: () => console.log("Checking permissions...")
}, (app) => app
    .get('/dashboard', () => "Dash")
    .get('/profile', () => "Profile")
)
```

---

## 4. Validation (Strict Typing)
Elysia uses `t` (from the `elysia` package) to define schemas. It validates data **before** your handler runs.

```typescript
import { t } from 'elysia'

app.post('/register', ({ body }) => body, {
    body: t.Object({
        username: t.String(),
        age: t.Number()
    })
})
```
If someone sends `age: "25"` (a string), Elysia will automatically reject the request at Station 4 (BeforeHandle) and send back a `400 Bad Request`.

---

## 5. Grouping Routes
Keep your `app.ts` clean by grouping related features:

```typescript
// users.ts
export const userRoutes = new Elysia({ prefix: '/user' })
    .get('/:id', () => "Found user")

// app.ts
app.use(userRoutes) // Resulting path: http://localhost:4000/user/1
```

---

## 6. The "Golden" Example
Here is a snippet that uses everything we've learned:

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .state('db', new Database()) // 1. Global State
    .derive(({ headers }) => {    // 2. Request derivation
        return { isMobile: headers['user-agent']?.includes('Mobi') }
    })
    .group('/api', (app) => app   // 3. Grouping
        .get('/data', ({ isMobile, store }) => {
            return { 
                platform: isMobile ? 'Mobile' : 'Desktop',
                version: store.db.getVersion() 
            }
        }, {
            // 4. Validation
            query: t.Object({
                limit: t.Optional(t.Numeric())
            })
        })
    )
    .listen(4000)
```

### Summary Check
- **Context**: The object `{ request, body, set, store, ... }` passed to your handler.
- **Hooks**: Specific lifecycle points (`beforeHandle`, `onParse`, etc.) where you add logic.
- **Plugins**: Reusable bundles of routes and hooks added via `.use()`.
- **Eden**: The reason you do all this typing—so your frontend is 100% synced with your backend.
