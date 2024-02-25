#!/bin/bash

echo "Setting up backend..."
cd backend
cp .env.example .env
npm install
echo "Starting backend server..."
npm start &
BACK_PID=$!
echo "Backend server started with PID $BACK_PID"

echo "Setting up frontend..."
cd ../frontend
cp .env.example .env
npm install
echo "Starting frontend server..."
npm start &
FRONT_PID=$!
echo "Frontend server started with PID $FRONT_PID"

wait $BACK_PID $FRONT_PID
