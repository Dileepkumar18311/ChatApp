# ChatApp

A modern real-time chat application built with React, Node.js, and PostgreSQL.

## Features

- User authentication with JWT tokens
- Real-time messaging
- Group chats and direct messages
- Message reactions and threaded replies
- User profiles and status indicators
- File attachments
- Email verification

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- React Router for navigation
- React Query for data fetching

### Backend
- Node.js with Express
- PostgreSQL with Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email verification
- Helmet for security headers
- Rate limiting for API protection

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dileepkumar3684/ChatApp.git
cd ChatApp
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
Create a `.env` file in the backend directory:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_super_secure_random_string_here
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
BASE_URL=http://localhost:3001
```

5. Set up the database:
```bash
cd backend
npm run migrate
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:8080/` and the backend at `http://localhost:3001/`.

## Project Structure

```
ChatApp/
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   ├── models/
│   │   ├── validation/
│   │   └── index.js
│   ├── config/
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── lib/
│   └── package.json
└── README.md
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- Security headers with Helmet
- Input validation with Zod
- Email verification for new accounts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
