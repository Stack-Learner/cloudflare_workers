# User CRUD Operations

## Plan Overview
Complete a User CRUD Operations API with Hono and Cloudflare D1. Follow the task plan as written. Don't deviate from the plan.

## Implementation Tasks

### Phase 1: Database & Validation
- [x] Define SQLite table in [0001_create_users_table.sql](file:///Users/raselhossain/projects/cloudflare/hono/migrations/0001_create_user_table.sql).
- [] Define full SQLite user table in migration file:
  - Primary key auto-incrementing integer ID (id)
  - Unique non-null username with VARCHAR(50) constraint
  - Unique non-null email with VARCHAR(255) constraint
  - Non-null created_at timestamp defaulting to CURRENT_TIMESTAMP
  - Non-null updated_at timestamp that triggers automatic updates on record modification
- [x] Create database indexes for username, email, and createdAt columns to optimize query performance

### Phase 2: Middleware Implementation
- [x] Implement CORS middleware to handle cross-origin requests, utilizing the existing ALLOWED_ORIGIN environment variable.

### Phase 3: Route Structure & CRUD Implementation
- [x ] Refactor [index.ts](file:///Users/raselhossain/projects/cloudflare/hono/src/index.ts) to use modular route structure.
- [ x] Create health check route `/health` (GET) in [index.ts](file:///Users/raselhossain/projects/cloudflare/hono/src/index.ts).
- [ x] Create user routes module in [user-routes.ts](file:///Users/raselhossain/projects/cloudflare/hono/src/routes/user-routes.ts).
  - [ x] `GET /users` - List all users.
  - [ x] `GET /users/:id` - Get specific user.
  - [ x] `POST /users` - Create user with Zod validation.
  - [ x] `PUT /users/:id` - Update user with partial updates.
  - [ x] `DELETE /users/:id` - Delete user.

### Phase 4: Create HTTP Request example
 - [] Create user.http file to test the API endpoint using the REST Client VS code extension.