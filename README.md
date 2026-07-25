# STRIDEFORGE Events — Marathon Event Management System

A monorepo for India's premium marathon event series. Built with a React frontend and a Node.js + Express + MongoDB backend.

## Repository Structure

```
Marathon/
├── marathon-fe/          # React + Vite frontend
│   ├── src/              # Application source
│   ├── public/           # Static assets
│   └── README.md         # Frontend documentation
└── marathon-be/          # Node.js + Express backend
    ├── src/
    │   ├── config/       # Database configuration
    │   ├── controllers/  # Route handlers
    │   ├── middleware/    # Express middleware
    │   ├── models/       # Mongoose models
    │   ├── routes/       # API route definitions
    │   ├── utils/        # Helper functions
    │   └── validations/  # Request validation rules
    └── package.json
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, Tailwind CSS, GSAP |
| **Backend** | Node.js, Express, MongoDB Atlas, Mongoose |

## Setup Instructions

### Prerequisites

- Node.js >= 18
- npm
- MongoDB Atlas connection string (for backend)

### Clone

```bash
git clone https://github.com/manojkumar-mern/marathon.git
cd marathon
```

### Frontend

```bash
cd marathon-fe
npm install
npm run dev
```

The frontend dev server starts at `http://localhost:5173`.

### Backend

```bash
cd marathon-be
npm install
```

Create a `.env` file in `marathon-be/`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/marathon?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

```bash
npm run dev
```

The backend starts at `http://localhost:5000`.

## Frontend

See [marathon-fe/README.md](./marathon-fe/README.md) for detailed frontend documentation.

## Backend

The backend provides a REST API for user authentication and event management.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/health` | Health check |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 5000) |

## Live Demo

Frontend: [https://strideforge.in](https://strideforge.in)

## License

MIT
