# API Documentation

This document provides an overview of the Multi-Tenant Inspection Booking System API endpoints.

## Base URL

All API endpoints are prefixed with: `http://localhost:8000/api/v1`

## Authentication

Most endpoints require Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Authentication

#### Register
- **POST** `/auth/register`
- Creates a new tenant and user account
- Request Body:
```json
{
    "tenant_name": "Your Tenant Name",
    "name": "Your Name",
    "email": "your@email.com",
    "password": "your_password",
    "password_confirmation": "your_password"
}
```

#### Login
- **POST** `/auth/login`
- Authenticates a user and returns a token
- Request Body:
```json
{
    "email": "your@email.com",
    "password": "your_password"
}
```

#### Profile
- **GET** `/auth/profile`
- Returns the authenticated user's profile
- Requires Authentication: Yes

#### Users List
- **GET** `/users`
- Returns a list of users
- Requires Authentication: Yes

### Tenant

#### Get Tenant
- **GET** `/tenant`
- Returns the current tenant information
- Requires Authentication: Yes

### Teams

#### List Teams
- **GET** `/teams`
- Returns a list of all teams
- Requires Authentication: Yes

#### Create Team
- **POST** `/teams`
- Creates a new team
- Requires Authentication: Yes
- Request Body:
```json
{
    "name": "Team Name"
}
```

#### Generate Team Slots
- **GET** `/teams/{team_id}/generate-slots`
- Generates available slots for a team within a date range
- Requires Authentication: Yes
- Query Parameters:
  - `from`: Start date (YYYY-MM-DD)
  - `to`: End date (YYYY-MM-DD)

#### Set Team Availability
- **POST** `/teams/{team_id}/availability`
- Sets the availability schedule for a team
- Requires Authentication: Yes
- Request Body:
```json
{
  "availability": [
    {
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "17:00"
    }
  ]
}
```

### Bookings

#### List Bookings
- **GET** `/bookings`
- Returns a list of all bookings
- Requires Authentication: Yes

#### Create Booking
- **POST** `/bookings`
- Creates a new booking
- Requires Authentication: Yes
- Request Body:
```json
{
  "team_id": 1,
  "date": "2025-06-15",
  "start_time": "10:00",
  "end_time": "11:00"
}
```

#### Delete Booking
- **DELETE** `/bookings/{booking_id}`
- Deletes a specific booking
- Requires Authentication: Yes

## Error Responses

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

Error responses include a message and details about what went wrong. 