# Deployment Documentation

This document provides instructions for deploying the Lucid Dreams application to various environments.

## Local Deployment

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Steps

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
# Copy the example env file or create a new one
cp .env.example .env
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm start

# In a new terminal, start frontend
npm run dev
```

5. Access the application at `http://localhost:3000`

## Production Deployment

### Option 1: Manual Deployment

1. Build the application
```bash
# Run the build script
./build.sh
```

2. Deploy the backend
```bash
# Copy the backend files to your server
scp -r dist/backend/* user@your-server:/path/to/backend/

# SSH into your server
ssh user@your-server

# Install dependencies
cd /path/to/backend
npm install --production

# Set up environment variables
cp .env.example .env
# Edit .env with your production settings

# Start the server
npm start
```

3. Deploy the frontend
```bash
# Copy the frontend files to your server
scp -r dist/.next dist/public dist/package.json user@your-server:/path/to/frontend/

# SSH into your server
ssh user@your-server

# Install dependencies
cd /path/to/frontend
npm install --production

# Set up environment variables
cp .env.example .env
# Edit .env with your production settings

# Start the server
npm start
```

### Option 2: Deployment to Vercel

1. Push your code to GitHub
```bash
git push origin main
```

2. Connect your GitHub repository to Vercel
   - Create an account on Vercel
   - Import your GitHub repository
   - Configure the build settings
   - Deploy

3. Set up environment variables in the Vercel dashboard

### Option 3: Deployment to Heroku

1. Create a Heroku account and install the Heroku CLI
```bash
npm install -g heroku
heroku login
```

2. Create a new Heroku app
```bash
heroku create lucid-dreams-app
```

3. Set up environment variables
```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set JWT_EXPIRY=7d
```

4. Deploy the application
```bash
git push heroku main
```

5. Open the application
```bash
heroku open
```

## Database Deployment

The application uses SQLite by default, which stores the database as a file. For production, you might want to use a more robust database like PostgreSQL or MySQL.

### Migrating to PostgreSQL

1. Install PostgreSQL dependencies
```bash
npm install pg pg-hstore
```

2. Update the database configuration in `backend/db.js`

3. Create migration scripts to convert your schema

4. Run the migrations
```bash
node migrations/run.js
```

## Troubleshooting

If you encounter issues during deployment:

1. Check the logs
```bash
# Backend logs
cd backend
npm run logs

# Frontend logs
npm run logs
```

2. Verify environment variables are correctly set

3. Ensure all dependencies are installed

4. Check for port conflicts

5. Verify database connections
