import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { userRoutes } from "./routes/user.routes";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", corsMiddleware());

app.get("/health", (c) => {
  return c.json({ status: "healthy" });
});

app.get("/message", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/users", userRoutes);

export default app;
