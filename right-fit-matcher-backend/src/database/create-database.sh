#!/bin/bash

# Script to create the database for the Right Fit Matcher backend

echo "Creating database 'right_fit_matcher'..."

# Check if database already exists
DB_EXISTS=$(psql -U postgres -lqt | cut -d \| -f 1 | grep -w right_fit_matcher | wc -l)

if [ "$DB_EXISTS" != "0" ]; then
    echo "Database 'right_fit_matcher' already exists."
    read -p "Do you want to drop and recreate it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping existing database..."
        psql -U postgres -c "DROP DATABASE IF EXISTS right_fit_matcher;"
    else
        echo "Keeping existing database."
        exit 0
    fi
fi

# Create the database
echo "Creating new database..."
psql -U postgres -c "CREATE DATABASE right_fit_matcher;"

# Check if creation was successful
if [ $? -eq 0 ]; then
    echo "✅ Database 'right_fit_matcher' created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with the correct database connection string"
    echo "2. Run: npm run sync-db"
else
    echo "❌ Failed to create database"
    exit 1
fi

