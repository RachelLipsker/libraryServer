# REST API for Users and Cards

This project is a REST API that allows performing CRUD operations for users and cards. Built with Node.js and Express, this server project provides a robust backend solution for managing user data and card information.

## Table of Contents

- [Libraries Used](#libraries-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)

## Libraries Used
- **express**: For building the server.
-  **mongoose**: For connecting to the MongoDB database.
-  **cors**: For enabling Cross-Origin Resource Sharing.
-  **jsonwebtoken**: For creating and verifying JSON Web Tokens.
- **bcryptjs**: For encrypting user passwords.
-  **joi**: For validation of user input.
- **chalk**: For coloring console prints.
- **config**: For configuration management.
- **cross-env**: For setting environment variables across platforms.
- **dotenv**: For loading environment variables from a `.env` file.
- **lodash**: For utility functions.
- **morgan**: For logging HTTP requests.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository** from GitHub:

2. **Install dependencies** using npm:
   ```bash
   npm install
   
## Environment Variables
In the main folder, create a .env file with the following variables:
- JWT_SECRET: Your secret key for creating JSON Web Tokens.
- ATLAS_CONNECTION_STRING: Your connection string to the MongoDB Atlas database.

## Running the Project
To run the project in different environments, use the following commands:
1. For local development:
   ```bash
   npm run dev
2. For production (with the MongoDB Atlas database):
   ```bash
   npm start    
## API Documentation
You can find the API documentation for the Users and Cards endpoints here:

- Library: [Postman Documentation]([https://documenter.getpostman.com/view/38195820/2sAXxJhaNU](https://documenter.getpostman.com/view/38195820/2sAYBXCWv5
))



