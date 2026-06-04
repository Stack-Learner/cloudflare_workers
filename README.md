# Hono Cloudflare Workers - User CRUD API

A production-ready User CRUD API built with **Hono framework** and **Cloudflare Workers**, demonstrating modern serverless architecture with TypeScript, D1 database, and comprehensive validation.

## Why Learn Cloudflare Workers?

### Global Edge Network
- **Instant Global Deployment**: Deploy your code to 300+ data centers worldwide in seconds
- **Zero Latency**: Your application runs closest to your users, reducing response times dramatically
- **Automatic Scaling**: Handle millions of requests without manual intervention or configuration

### Cost-Effective & Efficient
- **Pay-As-You-Go**: Only pay for actual requests, not idle server time
- **No Server Management**: Focus on code, not infrastructure, OS patches, or server maintenance
- **Free Tier Available**: Get started with 100,000 free requests per day

### Performance & Reliability
- **Cold Start Optimization**: Sub-millisecond cold starts with V8 isolates
- **Built-in DDoS Protection**: Enterprise-grade security automatically included
- **99.99% Uptime SLA**: Industry-leading reliability and availability

### Developer Experience
- **TypeScript Native**: First-class TypeScript support with auto-completion
- **Local Development**: Test locally with Wrangler CLI before deployment
- **Rich Ecosystem**: Integrates with KV, R2, D1, Queues, and more

### Modern Architecture
- **Serverless**: No server management, automatic scaling
- **Edge Computing**: Run logic at the network edge for faster responses
- **Polyglot Support**: Use JavaScript, TypeScript, Rust, Python, or Go

---

## Features

- **Complete CRUD Operations**: Create, Read, Update, Delete user records
- **Database Integration**: Cloudflare D1 (SQLite-based edge database)
- **Input Validation**: Zod schema validation for all API requests
- **CORS Support**: Configurable cross-origin resource sharing
- **Type Safety**: Full TypeScript implementation with Cloudflare bindings
- **Error Handling**: Comprehensive error responses and status codes
- **Health Monitoring**: Built-in health check endpoint
- **Migration Support**: Database schema versioning and migrations
- **HTTP Test Suite**: Ready-to-use HTTP request examples

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Hono** | 4.12.23 | Fast, lightweight web framework for Cloudflare Workers |
| **TypeScript** | Latest | Type-safe development |
| **Zod** | 4.4.3 | Schema validation and runtime type checking |
| **Wrangler** | 4.98.0 | Cloudflare Workers CLI and development toolkit |
| **Cloudflare D1** | Latest | Serverless SQLite database at the edge |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **pnpm** package manager (preferred)
- **Cloudflare account** with Workers access
- **Wrangler CLI** installed globally

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hono-app

# Install dependencies
pnpm install
```

### Environment Setup

1. **Create `.dev.vars` file** for local development:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://localhost:8787
```

2. **Configure Cloudflare secrets** for production:
```bash
# Using Wrangler CLI
wrangler secret put ALLOWED_ORIGINS --env production
```

### Database Setup

```bash
# Apply migrations locally
pnpm apply_migration:dev

# Apply migrations to production
pnpm apply_migration:prod
```

---

## Project Structure

```
hono-app/
├── src/
│   ├── index.ts                 # Main application entry point
│   ├── middlewares/
│   │   └── cors.middleware.ts   # CORS configuration
│   └── routes/
│       └── user.routes.ts       # User CRUD endpoints
├── migrations/
│   └── 0001_user_table.sql      # Database migration
├── config/
│   └── wrangler.jsonc           # Production configuration
├── user.http                    # HTTP request examples
├── wrangler.jsonc               # Development configuration
├── package.json                 # Project dependencies
└── tsconfig.json                # TypeScript configuration
```

---

## API Endpoints

### Base URL
- **Development**: `http://localhost:8787`
- **Production**: `https://your-worker.workers.dev`

### Endpoints Overview

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/health` | Health check | None |
| GET | `/api/v1/users` | List all users | None |
| GET | `/api/v1/users/:id` | Get user by ID | None |
| POST | `/api/v1/users` | Create new user | None |
| PUT | `/api/v1/users/:id` | Update user | None |
| DELETE | `/api/v1/users/:id` | Delete user | None |

### Request Examples

#### Create User
```bash
POST /api/v1/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john.doe@example.com"
}
```

#### Get User
```bash
GET /api/v1/users/1
```

#### Update User
```bash
PUT /api/v1/users/1
Content-Type: application/json

{
  "email": "john.doe.updated@example.com"
}
```

#### Delete User
```bash
DELETE /api/v1/users/1
```

---

## Development

### Start Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:8787`

### Test API Endpoints

Use the provided `user.http` file with REST Client extension in VS Code:

1. Open `user.http` in VS Code
2. Click "Send Request" above any request
3. View responses in the split window

### Generate TypeScript Types

```bash
pnpm cf-typegen
```

---

## Deployment

### Development Deployment

```bash
# Deploy to Cloudflare Workers dev environment
wrangler dev
```

### Production Deployment

```bash
# Deploy to production with minification
pnpm deploy
```

### Push Production Environment Variables

```bash
# Push secrets to production environment
pnpm push-prod-env
```

---

## Database Operations

### Create Migration

```bash
pnpm create_migration
```

### List Migrations

```bash
# Local migrations
pnpm list_migrations:dev

# Production migrations
pnpm list_migrations:prod
```

### Apply Migrations

```bash
# Apply to local database
pnpm apply_migration:dev

# Apply to production database
pnpm apply_migration:prod
```

---

## Configuration

### Development Configuration (`wrangler.jsonc`)

```json
{
  "name": "user_app-dev",
  "main": "src/index.ts",
  "compatibility_date": "2026-06-04",
  "d1_databases": [{
    "binding": "USER_DATABASE",
    "database_name": "user-db",
    "database_id": "local-db-id"
  }]
}
```

### Production Configuration (`config/wrangler.jsonc`)

```json
{
  "name": "user_app-prod",
  "main": "../src/index.ts",
  "workers_dev": false,
  "d1_databases": [{
    "binding": "USER_DATABASE",
    "database_name": "user-db",
    "database_id": "your-production-db-id"
  }]
}
```

---

## Learning Path for Cloudflare Workers

### Level 1: Basics
- Understand the Workers runtime model
- Learn about V8 isolates and execution context
- Master basic HTTP request handling
- Practice environment variables and secrets

### Level 2: Database Integration
- D1 database operations with prepared statements
- Database migrations and schema management
- Query optimization and indexing
- Transaction handling

### Level 3: Advanced Features
- KV storage for caching and session management
- R2 object storage for file handling
- Queues for asynchronous processing
- Scheduled tasks (Cron Triggers)

### Level 4: Production Skills
- Monitoring and logging
- Error handling and debugging
- Performance optimization
- Security best practices

---

## Performance Considerations

### Cloudflare Workers Advantages

- **Sub-millisecond cold starts** with V8 isolates
- **Automatic horizontal scaling** without configuration
- **Edge-based execution** reducing latency by 90%+
- **Built-in CDN** for static assets

### Best Practices

1. **Minimize External Dependencies**: Keep Workers lightweight
2. **Use D1 for Data**: Leverage edge database for fast queries
3. **Implement Caching**: Use KV for frequently accessed data
4. **Optimize Bundle Size**: Minimize JavaScript/TypeScript bundles
5. **Handle Errors Gracefully**: Implement proper error boundaries

---

## Troubleshooting

### Common Issues

#### Migration Path Issues
```bash
# Error: No migrations folder found
# Solution: Use --legacy-migrations-dir flag
pnpm apply_migration:prod
```

#### Database Connection Issues
```bash
# Verify D1 binding configuration
# Check database_id in wrangler.jsonc
# Ensure migrations are applied
```

#### CORS Errors
```bash
# Check ALLOWED_ORIGINS in .dev.vars
# Verify CORS middleware configuration
# Ensure proper headers are set
```

---

## Additional Resources

### Official Documentation
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Framework Documentation](https://hono.dev/)
- [D1 Database Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Guide](https://developers.cloudflare.com/workers/wrangler/)

### Learning Resources
- [Cloudflare Workers Tutorial](https://developers.cloudflare.com/workers/tutorials/)
- [Hono Examples](https://hono.dev/examples)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes with descriptive messages
4. Push to your branch
5. Create a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

Built as part of the Cloudflare Workers learning journey.

---

## Conclusion

This project demonstrates the power and simplicity of building modern APIs with Cloudflare Workers and Hono. The serverless architecture provides global scale, cost efficiency, and developer-friendly experience that traditional backend approaches can't match.

**Start building with Cloudflare Workers today and join the future of edge computing!**