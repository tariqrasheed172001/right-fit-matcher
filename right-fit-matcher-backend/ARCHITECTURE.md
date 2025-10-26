# Backend Architecture - Right Fit Matcher

## Architecture Overview

This backend follows a **separation of concerns** principle with these layers:

```
Routes → Controllers → Services → Repositories → Models (Sequelize)
```

### Layer Responsibilities

- **Routes**: Define API endpoints and connect them to controllers
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle database operations
- **Models**: Define data structures using Sequelize ORM

## Directory Structure

```
src/
├── config/
│   └── sequelize.js          # Database configuration
├── controllers/
│   ├── UniversityController.js
│   └── UserController.js
├── models/
│   ├── index.js              # Model initialization
│   ├── University.js
│   ├── User.js
│   └── Search.js
├── repositories/
│   ├── UniversityRepository.js
│   ├── UserRepository.js
│   └── SearchRepository.js
├── routes/
│   ├── index.js              # Main router
│   ├── universityRoutes.js
│   ├── userRoutes.js
│   └── matchRoutes.js
├── services/
│   ├── UniversityService.js
│   ├── UserService.js
│   └── MatchingService.js
└── server.js
```

## API Endpoints

### 1. GET /api/universities

Get all universities, optionally filter by program type.

**Query Parameters:**

- `program` (optional): Filter by program type (MBA, MS, MSCS, MSDS, PhD)

**Example:**

```
GET /api/universities?program=MBA
```

**Response:**

```json
{
  "universities": [
    {
      "id": 1,
      "name": "Stanford University",
      "program_type": "MBA",
      "avg_gmat": 730,
      "avg_gpa": 3.8,
      "avg_work_exp": 4.5,
      "admit_rate": 0.08
    }
  ]
}
```

### 2. GET /api/universities/:id

Get a specific university by ID.

**Example:**

```
GET /api/universities/1
```

### 3. POST /api/match

Find matching universities for a user profile.

**Request Body:**

```json
{
  "gmat": 700,
  "gpa": 3.5,
  "work_exp": 3,
  "target_program": "MBA",
  "top_k": 20,
  "user_id": 1 // optional: save search if provided
}
```

**Response:**

```json
{
  "matches": [
    {
      "university_id": 1,
      "name": "Stanford University",
      "probability": 0.8524,
      "compatibility": 0.892,
      "details": {
        "s_gmat": 0.962,
        "s_gpa": 0.875,
        "s_work": 0.833
      }
    }
  ]
}
```

### 4. POST /api/users

Create a new user profile (optional).

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "gmat": 700,
  "gpa": 3.5,
  "work_exp": 3,
  "target_program": "MBA"
}
```

**Response:**

```json
{
  "user_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  ...
}
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=4000
```

### 3. Sync Database

```bash
npm run sync-db
```

This will create/update tables based on Sequelize models.

### 4. Start Development Server

```bash
npm run dev
```

The server will be running on `http://localhost:4000`

## Database Schema

The database uses three main tables:

1. **universities**: Stores university information and admission criteria
2. **users**: Stores user profiles
3. **searches**: Stores search history (optional)

All tables are defined using Sequelize models with proper relationships and validations.

## Key Features

✅ **ORM**: Uses Sequelize for database operations
✅ **Separation of Concerns**: Clean architecture with distinct layers
✅ **Type Safety**: Database validations built-in
✅ **Modular**: Easy to maintain and extend
✅ **Auto-reload**: Development with nodemon
✅ **CORS**: Configured for frontend integration
