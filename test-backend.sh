#!/bin/bash

# Start the backend server
cd /home/ubuntu/lucid-project/backend
echo "Starting backend server..."
node server.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 5

# Test backend API endpoints
echo "Testing backend API endpoints..."

# Test auth endpoint
echo "Testing auth endpoint..."
curl -s http://localhost:5000/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}' | grep -q "token" && \
  echo "✅ Auth endpoint working" || echo "❌ Auth endpoint failed"

# Test dream journal endpoint
echo "Testing dream journal endpoint..."
TOKEN=$(curl -s http://localhost:5000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -s http://localhost:5000/api/dream-journal -X GET \
  -H "Authorization: Bearer $TOKEN" | grep -q "entries" && \
  echo "✅ Dream journal endpoint working" || echo "❌ Dream journal endpoint failed"

# Test practice session endpoint
echo "Testing practice session endpoint..."
curl -s http://localhost:5000/api/practice-session -X GET \
  -H "Authorization: Bearer $TOKEN" | grep -q "sessions" && \
  echo "✅ Practice session endpoint working" || echo "❌ Practice session endpoint failed"

# Test progress tracking endpoint
echo "Testing progress tracking endpoint..."
curl -s http://localhost:5000/api/progress-tracking -X GET \
  -H "Authorization: Bearer $TOKEN" | grep -q "metrics" && \
  echo "✅ Progress tracking endpoint working" || echo "❌ Progress tracking endpoint failed"

# Test audio resource endpoint
echo "Testing audio resource endpoint..."
curl -s http://localhost:5000/api/audio-resource -X GET | grep -q "resources" && \
  echo "✅ Audio resource endpoint working" || echo "❌ Audio resource endpoint failed"

# Kill the backend server
echo "Stopping backend server..."
kill $BACKEND_PID

echo "Backend API tests completed."
