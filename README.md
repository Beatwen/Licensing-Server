# Licensing Server

A full-stack application for managing software licenses with a Node.js backend and React frontend.

## Project Structure

- `Backend/`: Node.js Express server with OAuth2 authentication
- `Frontend/`: React application with Vite

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database

## Installation

1. Clone the repository
2. Install dependencies for all parts:

```bash
npm run install:all
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both Backend and Frontend directories
   - Update the values as needed

## Running the Application

### Development Mode

To run both the frontend and backend concurrently:

```bash
npm start
```

This will start:
- Backend server at http://localhost:3000
- Frontend server at http://localhost:5173

### Running Separately

To run only the backend:

```bash
npm run start:backend
```

To run only the frontend:

```bash
npm run start:frontend
```

## API Documentation

### Authentication Endpoints

- `POST /auth/register`: Register a new user
- `GET /auth/confirm-email?token=[token]`: Confirm email address
- `POST /auth/login`: Login user
- `POST /auth/logout`: Logout user
- `POST /auth/refresh`: Refresh access token

### License Management Endpoints

- `POST /licenses/buy`: Purchase a license
- `POST /licenses/activate`: Activate a license
- `POST /licenses/validate`: Validate a license
- `POST /licenses/activate-and-validate`: Combined activate and validate

## License

This project is licensed under the MIT License. 