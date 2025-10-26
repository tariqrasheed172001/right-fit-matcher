# Right Fit Matcher

A comprehensive university matching platform that helps students find the best-fit university programs based on their profile (GMAT, GPA, and work experience).

## 📁 Project Structure

This is a monorepo containing both frontend and backend:

```
right-fit-matcher/
├── right-fit-matcher-backend/   # Express.js API with PostgreSQL
├── right-fit-matcher-frontend/  # Next.js TypeScript frontend
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Backend Setup

```bash
cd right-fit-matcher-backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection details

# Create database
./src/database/create-database.sh

# Sync database schema
npm run sync-db

# Seed sample data
npm run seed

# Start development server
npm run dev
```

Backend will run on http://localhost:4000

### Frontend Setup

```bash
cd right-fit-matcher-frontend
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

## 📚 Features

### Backend
- RESTful API with Express.js
- PostgreSQL database with Sequelize ORM
- Authentication with JWT
- University matching algorithm
- Comprehensive logging with Winston
- Swagger API documentation
- Unit tests with Jest (34 tests)

### Frontend
- Next.js 16 with TypeScript
- Beautiful UI with Tailwind CSS
- Authentication management
- Real-time matching results
- User profile and search history
- CSV export functionality
- Responsive design

## 🧪 Testing

### Backend Tests
```bash
cd right-fit-matcher-backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

### Frontend Tests
```bash
cd right-fit-matcher-frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

## 📖 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:4000/api-docs
- Health Check: http://localhost:4000/health

## 🗄️ Database Schema

See `right-fit-matcher-backend/DATABASE_SETUP.md` for detailed setup instructions.

## 📝 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run sync-db` - Sync database schema
- `npm run seed` - Seed sample data
- `npm run clear-db` - Clear all data
- `npm run reset-db` - Clear and reseed database

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/right_fit_matcher
PORT=4000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT

## 👤 Author

Tariq Rasheed

## 🙏 Acknowledgments

- Sequelize ORM
- Next.js framework
- React Testing Library
- Tailwind CSS

