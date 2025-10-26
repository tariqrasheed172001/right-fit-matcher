# Frontend Testing Documentation

## Overview

Frontend testing setup with Jest and React Testing Library for the Right Fit Matcher application.

## Setup

### Dependencies

- `jest` - Testing framework
- `@testing-library/react` - React component testing
- `@testing-library/jest-dom` - Custom Jest matchers for DOM
- `@testing-library/user-event` - User interaction simulation
- `jest-environment-jsdom` - DOM environment for Jest
- `ts-jest` - TypeScript support

### Configuration

- **jest.config.js** - Jest configuration for Next.js
- **jest.setup.js** - Global test setup and mocks

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Coverage

### Completed Tests ✅

1. **API Utilities** (`src/__tests__/lib/auth.test.ts`)

   - User registration
   - User login
   - Profile management
   - Error handling

2. **Auth API Integration** (`src/__tests__/lib/api.test.ts`)
   - University API calls
   - Matching API calls
   - Axios integration

## Test Structure

### API Tests

- Mock axios for HTTP requests
- Test all CRUD operations
- Verify request parameters
- Test error scenarios

### Context Tests

- Test authentication state
- Test user profile management
- Test login/logout flows
- Test token management

### Component Tests (To Be Implemented)

- MatchForm component testing
- ResultsDisplay component testing
- Navigation and routing
- Form validation
- Error states

## Testing Best Practices

### Mocking

- Mock external API calls
- Mock localStorage
- Mock Next.js router
- Use MSW (Mock Service Worker) for API mocking

### Test Organization

```typescript
describe("Feature Name", () => {
  beforeEach(() => {
    // Setup
  });

  describe("Sub-feature", () => {
    it("should do something", () => {
      // Test
    });
  });

  afterEach(() => {
    // Cleanup
  });
});
```

### Assertions

- Use semantic queries (`getByRole`, `getByText`)
- Test user interactions, not implementation
- Verify accessibility
- Test error states and edge cases

## Future Test Plans

### Components to Test

- [ ] MatchForm
- [ ] ResultsDisplay
- [ ] StatsSection
- [ ] AuthContext Provider
- [ ] Login/Signup pages
- [ ] Profile page

### Features to Test

- [ ] Form validation
- [ ] Search functionality
- [ ] Results sorting
- [ ] CSV export
- [ ] Authentication flows
- [ ] Protected routes

## Running Specific Tests

```bash
# Run a specific test file
npm test -- src/__tests__/lib/auth.test.ts

# Run tests matching a pattern
npm test -- --testPathPattern=auth

# Run tests with verbose output
npm test -- --verbose
```

## Coverage Goals

- Target: 80% code coverage
- Focus areas:
  - Business logic
  - API integration
  - Authentication flows
  - User interactions
  - Error handling
