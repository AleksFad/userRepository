#!/bin/bash

createUsersJson() {
    echo "Creating users.json with default data..."
    local usersFilePath="$(pwd)/db/users.json"

    node -e "
    const fs = require('fs');
    const { v4: uuidv4 } = require('uuid');
    const bcrypt = require('bcrypt');

    const users = [...Array(10).keys()].map(i => ({
        id: uuidv4(),
        email: \`user\${i+1}@example.com\`,
        password: bcrypt.hashSync('password' + (i+1), 10),
        lastLogins: [],
        isValidated: true
    }));

    fs.writeFileSync('${usersFilePath}', JSON.stringify(users, null, 2));
    "
    echo "users.json created at ${usersFilePath}"
}


echo "Setting up backend..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created from .env.example"
else
    echo ".env file already exists"
fi

echo "Installing backend packages..."
npm install

if [ ! -f db/users.json ]; then
    createUsersJson
else
    echo "users.json already exists."
fi

echo "Starting backend server..."
npm start &
BACK_PID=$!
echo "Backend server started with PID $BACK_PID"

cd ..
echo "Setting up frontend..."
cd frontend

if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created from .env.example"
else
    echo ".env file already exists"
fi

echo "Installing frontend packages..."
npm install

echo "Starting frontend server..."
npm start &
FRONT_PID=$!
echo "Frontend server started with PID $FRONT_PID"

wait $BACK_PID $FRONT_PID
