# 🚀 Take Home Assignment

Welcome to the awesome take-home assignment project! This repository contains both frontend and backend code.

## 📂 Project Structure

- `/frontend` - Contains the Next.js frontend application
- `/backend` - Contains the Node.js backend API

## ✨ Bonus Features Implemented

This project includes all the optional bonus requirements:

- **🔐 Advanced Authentication System** - Comprehensive JWT authentication with token validation, refresh mechanisms, and secure storage
- **📊 Structured Logging** - Winston integration for advanced structured logging with multiple transport layers
- **🧪 Comprehensive Test Coverage** - Extensive unit and integration tests with Jest
- **🔄 CI/CD Pipeline** - Automated testing and deployment workflow

## ✅ Prerequisites

Before running the application, ensure you have started the docker:

### Running Docker

```bash
docker compose up -d
```

## 🖥️ Backend Setup

To set up and run the backend:

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=3001
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   For production:

   ```bash
   npm start
   # or
   yarn start
   ```

✨ The backend API should now be running at `http://localhost:3001`.

## 🌐 Frontend Setup

To set up and run the frontend:

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the frontend directory with:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

✨ The frontend application should now be running at `http://localhost:3000`.

## 🔐 Authentication System

The application implements a robust JWT authentication system with the following features:

- Secure token storage and transmission
- Automatic token validation and refreshing
- Protection against common security vulnerabilities
- Role-based access control
- Session management

After registering or logging in, the token is stored in local storage and automatically included in API requests.

## 📊 Logging System

The project utilizes Winston for structured logging with:

- Multiple log levels (error, warn, info, debug)
- Formatted JSON output for better parsing
- Console and file transport options
- Request/response logging for API endpoints
- Error tracking and reporting

## ❓ Troubleshooting

If you encounter any issues:

1. 🔄 Make sure all dependencies are installed
2. 📝 Verify environment variables are correctly set
3. 🔌 Check if the backend server is running when using the frontend
4. 🧹 Clear browser cache and local storage if experiencing authentication issues

## 📫 Need Help?

If you need any assistance or have questions, please don't hesitate to reach out!

---

### 🌟 Happy Coding! 🌟
