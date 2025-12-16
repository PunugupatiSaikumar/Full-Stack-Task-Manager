# Full-Stack Task Manager

A professional, intermediate-level full-stack CRUD application built with React frontend and Node.js/Express backend. This project demonstrates modern web development practices including reusable components, RESTful API design, error handling, and clean code architecture.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, and Delete tasks
- **Reusable Component Library**: Modular components for forms, cards, and modals
- **RESTful API**: Well-structured backend endpoints with proper error handling
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Task Filtering**: Filter tasks by status and priority
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling throughout the application
- **Loading States**: User-friendly loading indicators
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📋 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with modern design patterns

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Full-Stack Task Manager/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic layer
│   ├── utils/            # Utility functions
│   ├── data/             # Data storage (JSON file)
│   ├── server.js         # Express server entry point
│   └── package.json      # Backend dependencies
│
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── FormInput/    # Reusable form input component
│   │   │   ├── TodoCard/     # Task card component
│   │   │   ├── Modal/         # Modal component
│   │   │   ├── Header/        # Header component
│   │   │   └── TaskList/      # Task list component
│   │   ├── services/     # API service layer
│   │   ├── App.js        # Main app component
│   │   └── index.js      # React entry point
│   └── package.json      # Frontend dependencies
│
└── README.md             # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional, defaults are provided):
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/tasks
```

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/tasks` | Get all tasks | Query params: `?status=pending&priority=high` |
| GET | `/api/tasks/:id` | Get a single task | - |
| POST | `/api/tasks` | Create a new task | `{ title, description, status, priority, dueDate }` |
| PUT | `/api/tasks/:id` | Update a task | `{ title?, description?, status?, priority?, dueDate? }` |
| DELETE | `/api/tasks/:id` | Delete a task | - |

### Task Schema

```json
{
  "id": "uuid",
  "title": "string (required, max 200 chars)",
  "description": "string (optional)",
  "status": "pending | in-progress | completed",
  "priority": "low | medium | high",
  "dueDate": "ISO date string (optional)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Example API Request

```bash
# Create a new task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

## 🎨 Component Library

### FormInput Component
Reusable form input supporting multiple types:
- Text input
- Textarea
- Select dropdown
- Date picker

**Props:**
- `label` - Input label
- `name` - Input name
- `type` - Input type (text, textarea, select, date)
- `value` - Input value
- `onChange` - Change handler
- `error` - Error message
- `required` - Required field flag
- `options` - Options for select type

### TodoCard Component
Displays individual task information with status and priority badges.

**Props:**
- `task` - Task object
- `onEdit` - Edit handler
- `onDelete` - Delete handler

### TaskFormModal Component
Modal for creating and editing tasks with form validation.

**Props:**
- `task` - Task object (null for create mode)
- `onClose` - Close handler
- `onSubmit` - Submit handler

## 🔧 Development

### Running Both Servers

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/build` directory.

## 🧪 Testing the Application

1. **Create a Task**: Click "Add Task" button, fill in the form, and submit
2. **View Tasks**: Tasks are displayed in a responsive grid
3. **Filter Tasks**: Use the filter dropdowns in the header
4. **Edit Task**: Click the edit icon on any task card
5. **Delete Task**: Click the delete icon and confirm

## 📝 Code Quality

- **Comments**: Comprehensive code comments throughout
- **Error Handling**: Proper error handling at all levels
- **Validation**: Client and server-side validation
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and semantic HTML
- **Clean Code**: Modular, reusable components

## 🚀 Deployment Considerations

### Backend
- Set `NODE_ENV=production`
- Use environment variables for configuration
- Consider using a database (MongoDB, PostgreSQL) instead of JSON file
- Add authentication/authorization if needed
- Set up proper logging

### Frontend
- Build the production bundle: `npm run build`
- Serve static files using a web server (Nginx, Apache)
- Configure environment variables for API URL
- Enable HTTPS in production

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Add new features
- Improve error handling
- Enhance UI/UX
- Add unit tests
- Integrate a database

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as a professional full-stack CRUD application demonstrating intermediate-level web development skills.

---

**Note**: This project uses file-based storage (JSON) for simplicity. For production use, consider integrating a proper database like MongoDB, PostgreSQL, or MySQL.

