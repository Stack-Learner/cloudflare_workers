import { MiddlewareHandler } from 'hono';


export const corsMiddleware = (): MiddlewareHandler<{ Bindings: CloudflareBindings }> => {
  return async (c, next) => {
    const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [];
    const requestOrigin = c.req.header('Origin');
    
    const isOriginAllowed = requestOrigin && allowedOrigins.includes(requestOrigin);
    
    if (isOriginAllowed) {
      c.header('Access-Control-Allow-Origin', requestOrigin);
    }
    
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    if (c.req.method === 'OPTIONS') {
      c.header('Access-Control-Max-Age', '86400');
      return new Response(null, { status: 204 });
    }
    
    await next();
  };
};