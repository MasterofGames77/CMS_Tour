# Custom CMS Tour Content

A lightweight headless CMS for managing tour content, built with Next.js, React, and Node.js. This project demonstrates full-stack development capabilities with modern web technologies.

## Features

- Admin dashboard for tour content management
- Full CRUD operations for tour data
- Responsive design with dark mode support
- RESTful API backend
- JSON-based data storage

## Tech Stack

### Frontend

- Next.js 13+
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express
- JSON file-based storage

## Getting Started

1. Clone the repository:

```bash
git clone [your-repo-url]
cd custom-cms-tour
```

2. Install dependencies:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Start the development servers:

```bash
# Start the backend server (from the backend directory)
node index.js

# Start the frontend development server (from the frontend directory)
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
custom-cms-tour/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js app directory
│   │   ├── lib/      # Shared utilities and API clients
│   │   └── styles/   # Global styles
│   └── public/       # Static assets
└── backend/          # Node.js backend
    ├── data/        # JSON data storage
    ├── routes/      # API routes
    └── services/    # Business logic
```

## API Endpoints

- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get a specific tour
- `POST /api/tours` - Create a new tour
- `PUT /api/tours/:id` - Update a tour
- `DELETE /api/tours/:id` - Delete a tour

## Future Improvements

- Add authentication and authorization
- Implement image upload functionality
- Add search and filtering capabilities
- Migrate to a proper database
- Add automated testing
