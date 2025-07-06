#!/bin/bash

# Render deployment script for DJ Platform
echo "🚀 Starting DJ Platform deployment..."

# Navigate to the React app directory
cd dj-platform

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: ./dj-platform/build"
else
    echo "❌ Build failed!"
    exit 1
fi 