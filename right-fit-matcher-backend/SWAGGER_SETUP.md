# Swagger/OpenAPI Documentation

## Overview

This API now includes comprehensive Swagger documentation following OpenAPI 3.0 standards and best practices.

## Access Documentation

### Local Development

- **Swagger UI**: http://localhost:4000/api-docs
- **API Base**: http://localhost:4000/api

### Features

✅ **Interactive Documentation**: Test API endpoints directly from the browser
✅ **Schema Definitions**: Complete data models for all entities
✅ **Request/Response Examples**: Real-world examples for each endpoint
✅ **Validation**: Input validation and error handling documentation
✅ **Tags & Organization**: Endpoints organized by resource type
✅ **Custom Styling**: Clean, professional UI with custom branding

## Endpoints Documented

### 1. Universities (`GET /api/universities`)

- List all universities
- Filter by program type
- Get statistics
- Create new universities

### 2. Matching (`POST /api/match`)

- Match universities based on user profile
- Comprehensive request/response schemas
- Multiple example requests

### 3. Users (`POST /api/users`, `GET /api/users`)

- Create user profiles
- Retrieve user data
- Optional profile management

### 4. Health Check (`GET /health`)

- Server health monitoring
- Timestamp tracking

## Schema Definitions

All data models are fully documented:

- **University**: Complete university information schema
- **User**: User profile schema with validation
- **MatchRequest**: Request schema for matching algorithm
- **MatchResponse**: Response schema with probability scores
- **Error**: Standardized error response format

## Best Practices Implemented

1. **OpenAPI 3.0 Specification**: Modern, industry-standard format
2. **JSDoc Annotations**: Documentation lives with the code
3. **Schema Reusability**: Components defined once, used everywhere
4. **Comprehensive Examples**: Real-world usage examples
5. **Error Documentation**: All error cases documented
6. **Tag Organization**: Logical grouping of endpoints
7. **Parameter Validation**: Min/max values, enums, formats
8. **Response Types**: Proper status codes and schemas

## Usage

### View Documentation

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open your browser to:

   ```
   http://localhost:4000/api-docs
   ```

3. Explore the interactive documentation

### Test Endpoints

1. Click on any endpoint in Swagger UI
2. Click "Try it out"
3. Enter request parameters
4. Click "Execute"
5. View the response

### Generate API Client

Use tools like Swagger Codegen or OpenAPI Generator to generate client libraries:

```bash
# Example: Generate TypeScript client
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:4000/api-docs/swagger.json \
  -g typescript-axios \
  -o ./api-client
```

## Customization

### Update API Info

Edit `src/config/swagger.js` to customize:

- API title and description
- Contact information
- Version number
- Server URLs

### Add New Endpoints

1. Add route to appropriate route file
2. Add JSDoc annotations above the route
3. Follow the existing annotation pattern
4. Documentation updates automatically

## Integration with Frontend

The OpenAPI spec can be imported into:

- **Postman**: Import as OpenAPI 3.0
- **Insomnia**: Import as OpenAPI spec
- **Redoc**: Generate beautiful documentation site
- **API Clients**: Auto-generate client code

## Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JSDoc Guidelines](https://jsdoc.app/)
