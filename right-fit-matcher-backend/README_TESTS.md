# Testing Documentation

## Overview

This backend has comprehensive unit tests covering critical business logic, error handling, and edge cases.

## Test Coverage

### Test Suites

- ✅ **Error Classes** (`src/__tests__/utils/errors.test.js`) - 8 tests
- ✅ **AuthService** (`src/__tests__/services/AuthService.test.js`) - 15 tests
- ✅ **MatchingService** (`src/__tests__/services/MatchingService.test.js`) - 11 tests

**Total: 34 passing tests**

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run with verbose output
npm run test:verbose
```

## Test Structure

### AuthService Tests

**Registration Edge Cases:**

- ✅ Valid user registration
- Invalid email format
- ✅ User already exists
- ✅ Password too short (< 6 characters)
- ✅ Password with only spaces

**Login Edge Cases:**

- ✅ Valid credentials
- ✅ Invalid email format
- ✅ User not found
- ✅ Incorrect password

**Profile Edge Cases:**

- ✅ Get profile excludes password
- ✅ User not found when getting profile
- ✅ Update profile excludes password
- ✅ Update fails when user doesn't exist
- ✅ Password cannot be updated through profile endpoint

### MatchingService Tests

**Matching Algorithm:**

- ✅ Finds matching universities for MBA programs
- ✅ Results sorted by probability (descending)
- ✅ Limits results to top_k
- ✅ Handles MS programs (non-MBA) with GMAT weight = 0
- ✅ Doesn't save search history without user_id
- ✅ Handles missing/adjusted parameters gracefully

**Scoring:**

- ✅ Calculates compatibility correctly for MBA
- ✅ Higher probability for users exceeding university averages
- ✅ Lower probability for users below university averages

**Utility:**

- ✅ Clamp function keeps values within range
- ✅ Clamp handles values outside range

### Error Classes Tests

- ✅ AppError with default status 500
- ✅ AppError with custom status
- ✅ ValidationError (400)
- ✅ NotFoundError (404)
- ✅ AuthenticationError (401)
- ✅ AuthorizationError (403)
- ✅ Proper stack traces

## Test Coverage Highlights

### Authentication Service

- Email validation (regex format checking)
- Password strength requirements
- Duplicate user prevention
- Password hashing and comparison
- JWT token generation
- Profile data sanitization (removes passwords)

### Matching Algorithm

- Compatibility score calculation
- Program-specific weight adjustments (MBA vs MS)
- Probability calculation based on admit rate
- Result sorting and limiting
- Edge cases (missing data, zero values)
- Search history integration

## Edge Cases Tested

1. **Invalid Email Formats**: Tests rejection of malformed emails
2. **Weak Passwords**: Tests enforcement of minimum length
3. **Nonexistent Users**: Tests proper error handling
4. **Duplicate Emails**: Tests uniqueness validation
5. **Missing Profile Data**: Tests graceful handling of incomplete data
6. **Zero GMAT Scores**: Tests handling of MS programs without GMAT
7. **Negative Scores**: Tests data validation and clamping
8. **Empty Universities**: Tests handling when no matches found
9. **Password Exposure**: Ensures passwords never returned in responses
10. **Unauthorized Updates**: Tests prevention of password changes

## Mock Strategy

- **Repositories**: Mocked to isolate business logic
- **External Dependencies**: bcrypt.js mocked for password testing
- **Database**: No actual database connections in unit tests
- **Isolation**: Each test is independent with fresh mocks

## Continuous Testing

Tests run automatically on:

- `npm install` (if git hooks configured)
- Manual execution via `npm test`
- Watch mode for active development
