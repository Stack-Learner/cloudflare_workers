import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

import { corsMiddleware } from "./middlewares/cors.middleware";

app.use("*", corsMiddleware());

app.get("/message", (c) => {
  
  return c.text("Hello Hono!");
});

export default app;
