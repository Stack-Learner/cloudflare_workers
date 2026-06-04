import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const UserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string(),
});

const UpdateUserSchema = UserSchema.partial();

const userRoutes = new Hono<{ Bindings: CloudflareBindings }>();

userRoutes.get("/", async (c) => {
  try {
    const { results } = await c.env.USER_DATABASE.prepare(
      "SELECT * FROM users ORDER BY created_at DESC"
    ).all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

userRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const data = await c.env.USER_DATABASE.prepare(
      "SELECT * FROM users WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!data) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

userRoutes.post("/", zValidator("json", UserSchema), async (c) => {
  const payload = c.req.valid("json");
  const now = Math.floor(Date.now() / 1000);

  try {
    const result = await c.env.USER_DATABASE.prepare(
      "INSERT INTO users (username, email, created_at, updated_at) VALUES (?, ?, ?, ?)"
    )
      .bind(payload.username, payload.email, now, now)
      .run();

    if (result.success) {
      return c.json({ message: "User created", id: result.meta.last_row_id }, 201);
    }
    return c.json({ error: "Failed to create user" }, 500);
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Conflict: Username or email already exists" }, 400);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

userRoutes.put("/:id", zValidator("json", UpdateUserSchema), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const now = Math.floor(Date.now() / 1000);

  if (Object.keys(payload).length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  try {
    const fields = Object.keys(payload).map(key => `${key} = ?`).concat("updated_at = ?");
    const values = [...Object.values(payload), now, id];
    
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    const result = await c.env.USER_DATABASE.prepare(query).bind(...values).run();

    if (result.success && result.meta.changes > 0) {
      return c.json({ message: "User updated" });
    }
    return c.json({ error: "User not found or no changes" }, 404);
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Conflict: Username or email already exists" }, 400);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

userRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const result = await c.env.USER_DATABASE.prepare(
      "DELETE FROM users WHERE id = ?"
    )
      .bind(id)
      .run();

    if (result.success && result.meta.changes > 0) {
      return c.json({ message: "User deleted" });
    }
    return c.json({ error: "User not found" }, 404);
  } catch (error) {
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

export { userRoutes };