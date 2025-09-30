# Counting App Backend

A Node.js backend API for a counting application that counts from 1 to 10 with various control features.

## Features

- Start, pause, resume, and reset counting
- Adjust counting speed
- Automatic completion when reaching 10
- User authentication and authorization
- RESTful API design

## Tech Stack

- Node.js
- Express.js
- TypeScript
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and configure environment variables
   ```
   cp .env.example .env
   ```
4. Start the development server
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/external/auth/login` - User login
- `POST /api/external/auth/register` - User registration

### Counter Operations

- `POST /api/internal/counter/start` - Start counting
- `POST /api/internal/counter/pause` - Pause counting
- `POST /api/internal/counter/resume` - Resume counting
- `POST /api/internal/counter/reset` - Reset counter to 1
- `GET /api/internal/counter/status` - Get current counter status

### Counter Settings

- `PUT /api/internal/counter/settings/speed` - Update counting speed
- `GET /api/internal/counter/settings` - Get counter settings

## Development

### Build

```
npm run build
```

### Run Tests

```
npm test
```

### Linting

```
npm run lint
```

## Project Structure

```
src/
├── api/                  # API controllers
├── config/               # Application configuration
├── middleware/           # Express middleware
├── routes/               # Route definitions
├── services/             # Business logic
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── server.ts            # Application entry point
```