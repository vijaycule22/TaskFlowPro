# Todo App

A minimalistic todo application built with Angular, Tailwind CSS, PrimeNG, NestJS, and SQLite.

## Tech Stack

### Frontend

- **Angular 17** - Modern frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **PrimeNG** - UI component library
- **TypeScript** - Type-safe JavaScript

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **SQLite** - Lightweight database

## Project Structure

```
todo-app/
├── frontend/          # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── todo-list/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── backend/           # NestJS application
│   ├── src/
│   │   ├── controllers/
│   │   ├── entities/
│   │   ├── services/
│   │   └── ...
│   └── ...
└── README.md
```

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Add descriptions to todos
- ✅ Modern, responsive UI
- ✅ Real-time feedback with toast notifications
- ✅ Loading states
- ✅ Form validation

## Getting Started

### Prerequisites

- Node.js (v20.13.1 or higher)
- npm (v10.5.2 or higher)

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd todo-app
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd backend
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3000`

2. **Start the Frontend Development Server**

   ```bash
   cd frontend
   npm start
   ```

   The frontend will be available at `http://localhost:4200`

3. **Open your browser**
   Navigate to `http://localhost:4200` to use the application

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /todos` - Get all todos
- `GET /todos/:id` - Get a specific todo
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `PUT /todos/:id/toggle` - Toggle todo completion status
- `DELETE /todos/:id` - Delete a todo

## Database

The application uses SQLite as the database. The database file (`todo.db`) will be automatically created in the backend directory when you first run the application.

## Development

### Backend Development

- The backend uses TypeORM with SQLite
- Database schema is automatically synchronized in development mode
- CORS is enabled for the frontend domain

### Frontend Development

- Built with Angular 17 standalone components
- Uses Tailwind CSS for styling
- PrimeNG components for UI elements
- Responsive design for mobile and desktop

## Building for Production

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
ng build --configuration production
```

## Troubleshooting

1. **Port conflicts**: Make sure ports 3000 and 4200 are available
2. **Database issues**: Delete the `todo.db` file and restart the backend
3. **CORS errors**: Ensure the backend is running on port 3000
4. **Node version**: Make sure you're using Node.js v20.13.1 or higher

## License

This project is open source and available under the [ISC License](LICENSE).
