# Monerepay API Demo Application

A full-stack demonstration of secure integration with Monerepay's cryptocurrency vault management API.

## Features

- **Secure Authentication**: Backend implementation of HMAC-SHA256 signing for Monerepay API.
- **Proxy Architecture**: Frontend never exposes API secrets; all requests are proxied through Node.js.
- **Modern UI**: Built with React, Vite, and TailwindCSS.
- **Dockerized**: specific containers for backend and frontend.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Monerepay API Credentials (`API_KEY`, `Secret`, `Passphrase`)

## Setup & Running

1. **Clone/Open the project**

2. **Configure Credentials**
   Navigate to the `backend` directory and create your environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` and fill in your Monerepay credentials.

3. **Run with Docker**
   From the root directory:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001](http://localhost:3001)

## Development (No Docker)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing

### 1. Verify Authentication Logic
We have included a script to verify that the HMAC-SHA256 signature generation is working correctly and matches standard crypto implementations.
```bash
cd backend
node scripts/test_auth.js
```

### 2. Integration Test (Running the App)
The best way to test the full flow is to run the application with valid credentials.
1. Ensure `.env` in `backend/` has valid `VAULTODY_API_KEY`, `Secret`, etc.
2. Run `docker-compose up`.
3. Go to `http://localhost:3000` and check the "ApiStatus" indicator in the top right.
4. Try selecting a vault. If you see data, the secure proxy is working.

## Project Structure
- `/backend`: Node.js Express server. Handlers authentication signing.
- `/frontend`: React + Vite application.
