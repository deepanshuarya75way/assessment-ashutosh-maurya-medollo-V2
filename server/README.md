# Medollo Backend Server

This is the backend server for the Medollo Healthcare Application. It provides API endpoints for user authentication, user management, and more.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medollo
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current logged-in user

### User Management
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change user password
- `GET /api/users` - Get all users (Admin only)

### Server Status
- `GET /api/health` - Check server health

## Technologies Used
- Node.js
- Express
- MongoDB/Mongoose
- JWT Authentication
- bcryptjs for password hashing