# Medollo Healthcare Application

Medollo is a comprehensive healthcare application that allows users to browse, purchase, and manage medicines online. The application consists of a modern React frontend and a robust Node.js backend with MongoDB database.

## Project Structure

```
client1/
├── Medollo/          # Frontend React Application
├── server/           # Backend Node.js API Server
└── README.md         # This file
```

## Frontend (Medollo)

### Overview
A modern, responsive React application built with Vite, featuring a user-friendly interface for browsing medicines, managing cart, user authentication, and more.

### Tech Stack
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Headless UI** - Unstyled UI components
- **Heroicons** - Icon library
- **React Intersection Observer** - Intersection detection

### Features
- User authentication (login/signup)
- Medicine browsing and search
- Shopping cart functionality
- Order management
- Prescription upload
- Vendor dashboard
- Responsive design
- Smooth animations and transitions

### Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd Medollo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend (Server)

### Overview
A RESTful API server built with Node.js and Express, providing endpoints for user management, medicine data, orders, and more.

### Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Twilio** - SMS services
- **Multer** - File upload handling
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

### Features
- User authentication and authorization
- Medicine data management
- Order processing
- Vendor management
- File upload (prescriptions, images)
- SMS notifications
- Secure API endpoints

### Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medollo
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current logged-in user

#### User Management
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change user password
- `GET /api/users` - Get all users (Admin only)

#### Medicine Management
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine details
- `POST /api/medicines` - Add new medicine (Admin/Vendor)
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

#### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

#### Vendor Management
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Register as vendor
- `PUT /api/vendors/profile` - Update vendor profile

#### Search and Random
- `GET /api/search` - Search medicines
- `GET /api/random-medicines` - Get random medicines

#### Health Check
- `GET /api/health` - Check server health

## Getting Started

1. Ensure you have Node.js (v16+) and MongoDB installed
2. Clone the repository
3. Follow setup instructions for both frontend and backend
4. Start the backend server first, then the frontend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.