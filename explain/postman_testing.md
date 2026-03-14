# Postman Testing Guide: Email & Password Auth

Since the API is running at `http://localhost:4000` and Better Auth is mounted at `/api/auth/*`, here are the requests you can use to test the flow.

## 1. Sign Up (Create User)
**Method:** `POST`  
**URL:** `http://localhost:4000/api/auth/sign-up/email`  
**Body (JSON):**
```json
{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
}
```
**Expected Response:** `200 OK` with user data and a session cookie.

---

## 2. Sign In
**Method:** `POST`  
**URL:** `http://localhost:4000/api/auth/sign-in/email`  
**Body (JSON):**
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```
**Expected Response:** `200 OK` with user data and a session cookie.

---

## 3. Check Session (Get Current User)
**Method:** `GET`  
**URL:** `http://localhost:4000/api/auth/get-session`  
**Headers:** None (Postman will automatically include the cookie if you just signed in/up).

**Expected Response:**
- `200 OK` with session/user object if logged in.
- `200 OK` with `null` if not logged in.

---

## 4. Sign Out
**Method:** `POST`  
**URL:** `http://localhost:4000/api/auth/sign-out`  

**Expected Response:** `200 OK`.

---

### 💡 Postman Tips:
1. **Headers**: Ensure `Content-Type: application/json` is set for all POST requests.
2. **CSRF Protection (CRITICAL)**: Better Auth requires an `Origin` header for security. In Postman, go to the **Headers** tab and manually add:
   - `Origin`: `http://localhost:4000` (or `http://localhost:3000`)
3. **Cookies**: Postman manages cookies automatically. After a successful Sign Up or Sign In, call `get-session` to verify the cookie is working.
4. **Logs**: Check your terminal running `bun dev` to see if there are any Prisma or validation errors during the process.
