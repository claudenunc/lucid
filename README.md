# Lucid Dreams Application

This repository contains a full-stack web application for lucid dreaming practice, tracking, and enhancement.

## Features

- User authentication and profiles
- Dream journal with lucidity rating
- Practice session tracking
- Progress metrics and visualization
- Audio resources for guided meditation
- Breathing guide for relaxation techniques

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: SQLite
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/claudenunc/lucid.git
cd lucid
```

2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm start

# In a new terminal, start frontend
cd frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

The application can be deployed to any hosting service that supports Node.js applications.

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Deploy the backend code to your server
3. Run database migrations
4. Start the server with `npm start`

### Frontend Deployment

1. Build the frontend with `npm run build`
2. Deploy the static files to your hosting service

## License

This project is licensed under the MIT License - see the LICENSE file for details.
