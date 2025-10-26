# Right Fit Matcher Backend

A comprehensive API for matching students with the right university programs based on their profile (GMAT, GPA, work experience).

## 🏗️ Architecture

This backend follows **separation of concerns** with these layers:

```
Routes → Controllers → Services → Repositories → Models (Sequelize)
```

### Directory Structure

```
src/
├── config/
│   ├── sequelize.js          # Database configuration
│   └── swagger.js            # Swagger/OpenAPI configuration
├── controllers/              # Request/response handling
│   ├── UniversityController.js
│   └── UserController.js
├── docs/                     # API Documentation (YAML)
│   ├── universities.yaml
│   ├── matching.yaml
│   ├── users.yaml
│   └── health.yaml
├── models/                   # Sequelize models
│   ├── index.js
│   ├── University.js
│   ├── User.js
│   └── Search.js
├── repositories/             # Data access layer
│   ├── UniversityRepository.js
│   ├── UserRepository.js
│   └── SearchRepository.js
├── routes/                   # Route definitions
│   ├── index.js
│   ├── universityRoutes.js
│   ├── userRoutes.js
│   └── matchRoutes.js
├── services/                 # Business logic
│   ├── UniversityService.js
│   ├── UserService.js
│   └── MatchingService.js
└── server.js
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create the database:

```bash
createdb right_fit_matcher
```

Or if using psql:

```bash
psql -d postgres -c "CREATE DATABASE right_fit_matcher;"
```

### 3. Configure Environment

Update `.env` with your database credentials:

```env
DATABASE_URL=postgresql://your_username@localhost:5432/right_fit_matcher
PORT=4000
NODE_ENV=development
```

### 4. Initialize Database

Sync database schema:

```bash
npm run sync-db
```

Seed sample data:

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Server will be running at `http://localhost:4000`

## 📚 API Documentation

### Interactive Swagger UI

Visit: **http://localhost:4000/api-docs**

### Available Endpoints

#### Universities

- `GET /api/universities` - List all universities
- `GET /api/universities?program=MBA` - Filter by program type
- `GET /api/universities/:id` - Get specific university
- `GET /api/universities/stats` - Get statistics
- `POST /api/universities` - Create new university

#### Matching

- `POST /api/match` - Match universities based on user profile

#### Users

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create user profile

#### Health

- `GET /health` - Health check

## 🛠️ Scripts

```bash
# Development
npm run dev          # Start with auto-reload

# Database
npm run sync-db      # Sync database schema
npm run seed         # Seed sample data
npm run clear-db     # Clear all data
npm run reset-db     # Clear and re-seed

# Production
npm start            # Start production server
```

## 📝 API Documentation Management

**Best Practice**: Documentation is kept **separate** from routes in `src/docs/*.yaml` files:

- **Universities**: `src/docs/universities.yaml`
- **Matching**: `src/docs/matching.yaml`
- **Users**: `src/docs/users.yaml`
- **Health**: `src/docs/health.yaml`

This keeps route files clean and readable while maintaining comprehensive API documentation.

## 🧪 Testing the API

### Using cURL

```bash
# Get all universities
curl http://localhost:4000/api/universities

# Filter by program
curl 'http://localhost:4000/api/universities?program=MBA'

# Find matches
curl -X POST http://localhost:4000/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "gmat": 700,
    "gpa": 3.5,
    "work_exp": 3,
    "target_program": "MBA",
    "top_k": 10
  }'

# Create user
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "gmat": 700,
    "gpa": 3.5,
    "target_program": "MBA"
  }'
```

## 🏛️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Swagger/OpenAPI** - API documentation
- **Nodemon** - Auto-reload in development

## 📊 Database Schema

- **universities** - University information and admission criteria
- **users** - User profiles
- **searches** - Search history (optional)

## 🤝 Contributing

1. Follow the separation of concerns architecture
2. Keep route files clean - documentation in `src/docs/`
3. Write comprehensive Swagger documentation
4. Add proper error handling
5. Follow ES6+ syntax

## 📄 License

MIT
