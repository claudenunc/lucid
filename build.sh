#!/bin/bash

# Build script for Lucid Dreams application

# Load environment variables
source .env

# Build frontend
echo "Building frontend..."
npm run build

# Create production build directory
mkdir -p dist
cp -r .next dist/
cp -r public dist/
cp package.json dist/
cp .env dist/

# Build backend
echo "Building backend..."
mkdir -p dist/backend
cp -r backend/* dist/backend/

echo "Build completed successfully!"
echo "The application is ready for deployment in the dist/ directory."
