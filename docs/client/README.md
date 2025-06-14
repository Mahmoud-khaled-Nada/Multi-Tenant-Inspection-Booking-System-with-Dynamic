# Client Application - Local Development Guide

This guide explains how to run the client application locally for development and testing.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

## 1. Install Dependencies

Navigate to the `client` directory and install the required packages:

```sh
cd client
npm install
```

## 2. Set Environment Variables

The client requires the `VITE_API_SERVER_URL` environment variable to connect to the backend API. For local development, create a `.env` file in the `client` directory with the following content:

```env
VITE_API_SERVER_URL="http://localhost:8080/api/v1"
```

> **Note:** Adjust the URL if your backend server runs on a different host or port.

## 3. Start the Development Server

Run the following command in the `client` directory:

```sh
npm run dev
```

This will start the Vite development server, usually at [http://localhost:3000](http://localhost:3000).

## 4. Access the Application

Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the client application.

## 5. Troubleshooting

- Ensure the backend API is running and accessible at the URL specified in `VITE_API_SERVER_URL`.
- If you change the `.env` file, restart the development server.

---

For more details, see the main project README or contact the project maintainer. 