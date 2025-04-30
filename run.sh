#!/bin/bash

echo "Starting backend..."
cd backend || exit
uvicorn app:app --reload &

cd ..

echo "Starting frontend..."
cd frontend || exit
npm install
npm start