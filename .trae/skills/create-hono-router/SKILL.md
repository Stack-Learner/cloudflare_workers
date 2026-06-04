---
name: create-hono-router
description: Trigger to generate Hono router with Cloudflare Workers and D1 database integration, including Zod validation and error handling.
---

## 📋 Overview

Generates:
- Hono router with full CRUD operations
- Zod schema validation for input validation
- Database schema and migrations
- TypeScript types and interfaces
- Configuration files for development/production
- Proper binding setup for Cloudflare Workers
- CORS middleware with dynamic origin support

## 🚀 Usage

```bash
# Basic usage with interactive prompts
npx trae create-hono-router

# Quick creation with default values
npx trae create-hono-router --name users --fields email,username,age

# Advanced with all options
npx trae create-hono-router \
  --name products \
  --fields name,description,price,stock \
  --api-path /api/products \
  --binding-name PRODUCT_DATABASE
```

## ⚙️ Parameters

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `--name` | Resource name (e.g., users, products) | None | Yes |
| `--fields` | Comma-separated field definitions | id,name,created_at | No |
| `--api-path` | Base API path | `/api/{name}` | No |
| `--binding-name` | D1 database binding name | `{NAME}_DATABASE` | No |
| `--force` | Overwrite existing files | false | No |

## �️ CORS Handler Guide

The generated CORS middleware provides a secure way to manage cross-origin requests using environment variables.

### How it works:
1. **Environment Driven**: It reads `ALLOWED_ORIGINS` from your Cloudflare environment.
2. **Dynamic Validation**: 
   - If `ALLOWED_ORIGINS` is `*`, it allows all origins.
   - If it contains a comma-separated list (e.g., `https://example.com, https://dev.example.com`), it validates the `Origin` header against this list.
3. **Security**: It supports credentials, common HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), and essential headers.

### Configuration:
Add your origins to `.dev.vars` for local development:
```env
ALLOWED_ORIGINS=http://localhost:3000, http://localhost:5173
```
For production, set the variable in the Cloudflare Dashboard or via `wrangler secret`.

## 🏗️ Generated Files Structure

```
src/
├── routes/
│   └── {name}-routes.ts          # Hono router with CRUD (Named Export)
├── middlewares/
│   └── cors-middleware.ts       # Dynamic CORS configuration
migrations/
├── 0001_create_{name}_table.sql # Database schema
wrangler.jsonc                   # Development config
wrangler.prod.jsonc              # Production config
package.json                     # Updated with scripts & dependencies
```

## 📄 Generated Code Templates

### 1. Route File (`src/routes/{name}-routes.ts`)

```typescript
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

type Bindings = {
  {BINDING_NAME}: D1Database;
  ENVIRONMENT: string;
};

const {ResourceName}Schema = z.object({
  {zod_schema_fields}
});

const Update{ResourceName}Schema = {ResourceName}Schema.partial();

const {resourceName}Routes = new Hono<{ Bindings: Bindings }>();

// GET / - List all {resources}
{resourceName}Routes.get("/", async (c) => {
  try {
    const { results } = await c.env.{BINDING_NAME}.prepare(
      "SELECT * FROM {table_name} ORDER BY created_at DESC"
    ).all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: "Failed to fetch {resources}" }, 500);
  }
});

// GET /:id - Get {resource} by ID
{resourceName}Routes.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const data = await c.env.{BINDING_NAME}.prepare(
      "SELECT * FROM {table_name} WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!data) {
      return c.json({ error: "{ResourceName} not found" }, 404);
    }
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch {resource}" }, 500);
  }
});

// POST / - Create new {resource}
{resourceName}Routes.post("/", zValidator("json", {ResourceName}Schema), async (c) => {
  const payload = c.req.valid("json");
  const now = Math.floor(Date.now() / 1000);

  try {
    const result = await c.env.{BINDING_NAME}.prepare(
      "INSERT INTO {table_name} ({fields_list}, created_at) VALUES ({placeholders}, ?)"
    )
      .bind(...Object.values(payload), now)
      .run();

    if (result.success) {
      return c.json({ message: "{ResourceName} created", id: result.meta.last_row_id }, 201);
    }
    return c.json({ error: "Failed to create {resource}" }, 500);
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Conflict: Unique constraint failed" }, 400);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

// PUT /:id - Update {resource}
{resourceName}Routes.put("/:id", zValidator("json", Update{ResourceName}Schema), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const now = Math.floor(Date.now() / 1000);

  if (Object.keys(payload).length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  try {
    const fields = Object.keys(payload).map(key => `${key} = ?`).concat("updated_at = ?");
    const values = [...Object.values(payload), now, id];
    
    const query = `UPDATE {table_name} SET ${fields.join(", ")} WHERE id = ?`;
    const result = await c.env.{BINDING_NAME}.prepare(query).bind(...values).run();

    if (result.success && result.meta.changes > 0) {
      return c.json({ message: "{ResourceName} updated" });
    }
    return c.json({ error: "{ResourceName} not found or no changes" }, 404);
  } catch (error: any) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// DELETE /:id - Delete {resource}
{resourceName}Routes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const result = await c.env.{BINDING_NAME}.prepare(
      "DELETE FROM {table_name} WHERE id = ?"
    )
      .bind(id)
      .run();

    if (result.success && result.meta.changes > 0) {
      return c.json({ message: "{ResourceName} deleted" });
    }
    return c.json({ error: "{ResourceName} not found" }, 404);
  } catch (error) {
    return c.json({ error: "Failed to delete {resource}" }, 500);
  }
});

export { {resourceName}Routes };
```

### 2. Migration File (`migrations/0001_create_{name}_table.sql`)

```sql
-- Drop table if exists
DROP TABLE IF EXISTS {table_name};

-- Create {resource} table
CREATE TABLE IF NOT EXISTS {table_name} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  {sql_field_definitions},
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- Create indexes for performance
{sql_index_definitions}

-- Optimize database
PRAGMA optimize;
```

### 3. CORS Middleware (`src/middlewares/cors-middleware.ts`)

```typescript
import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono";

type Bindings = {
  ENVIRONMENT: string;
  ALLOWED_ORIGINS: string;
  LOG_LEVEL: string;
  CACHE_TTL: string;
};

export const corsMiddleware = (): MiddlewareHandler<{
  Bindings: Bindings;
}> => {
  return async (c, next) => {
    const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || ['*'];
    const corsMiddlewareHandler = cors({
      origin: allowedOrigins.length === 1 && allowedOrigins[0] === '*' 
        ? '*' 
        : (origin: string) => allowedOrigins.includes(origin) ? origin : undefined,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400,
    });
    return corsMiddlewareHandler(c, next);
  };
};
```

### 4. Configuration Files

**wrangler.jsonc:**
```jsonc
{
	"$schema": "node_modules/wrangler/config-schema.json",
	"name": "{project_name}-dev",
	"main": "src/index.ts",
	"compatibility_date": "2026-05-16",
	"assets": {
		"binding": "ASSETS",
		"directory": "./public"
	},
	"observability": {
		"enabled": true
	},
	"upload_source_maps": true,
	"compatibility_flags": [
		"nodejs_compat"
	],
	"d1_databases": [
		{
			"binding": "{BINDING_NAME}",
			"database_name": "test-db",
			"database_id": "local-db"
		}
	]
}
```

### 5. Updated Package.json Scripts

```json
{
  "scripts": {
    "dev": "wrangler dev --config wrangler.jsonc",
    "deploy": "wrangler deploy --config wrangler.prod.jsonc --minify",
    "cf-typegen": "wrangler types --env-interface CloudflareBindings",
    "create_migration": "wrangler d1 migrations create test-db --config wrangler.jsonc",
    "apply_migration:dev": "wrangler d1 migrations apply test-db --local --config wrangler.jsonc",
    "d1_execute:dev": "wrangler d1 execute test-db --local --config wrangler.jsonc --command"
  }
}
```

### 6. Main App Integration (`src/index.ts`)

```typescript
import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors-middleware";
import { {resourceName}Routes } from "./routes/{name}-routes";

const app = new Hono<{ Bindings: CloudflareBindings; }>();

app.use('*', corsMiddleware());

app.get("/health", (c) => {
  return c.json({ status: "healthy" });
});

app.route("/{name}", {resourceName}Routes);

export default app;
```

## 🎯 Example Usage

### Creating a Users Router
```bash
npx trae create-hono-router \
  --name users \
  --fields email:text:required:unique,username:text:required \
  --binding-name USER_DATABASE
```

## 🔄 Post-Generation Steps

### 1. Environment Setup
Add your configuration to `.dev.vars`:
```env
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

### 2. Apply Migrations
```bash
pnpm apply_migration:dev
```

### 3. Generate Types
```bash
pnpm cf-typegen
```

### 4. Start Development Server
```bash
pnpm dev
```

## 🏁 Generated API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{name}` | List all {resources} |
| GET | `/{name}/:id` | Get single {resource} |
| POST | `/{name}` | Create new {resource} |
| PUT | `/{name}/:id` | Update existing {resource} |
| DELETE | `/{name}/:id` | Delete {resource} |