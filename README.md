# Employee Attendance System

A full-stack web application for managing employee attendance with role-based access for **Employees** and **Managers**.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Redux Toolkit, Vite      |
| Backend  | Node.js, Express.js                |
| Database | MongoDB (Mongoose ODM)             |
| Auth     | JWT (JSON Web Tokens)              |
| Charts   | Recharts                           |

## Features

### Employee
- Register / Login with JWT authentication
- Check In & Check Out with live clock
- View personal attendance history
- Monthly summary (present, absent, late, half-day, total hours)
- Dashboard with today's status, monthly stats, recent 7-day table
- Profile page

### Manager
- Login with JWT authentication
- Dashboard with team stats, weekly attendance trend chart, department-wise attendance chart
- View all employees' attendance with filters (employee, date, status)
- Team calendar view with daily breakdowns
- Reports page with date/employee filters and CSV export
- Profile page

## Project Structure

```
Employee Attendance System/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/      # Auth & error middleware
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── seed/             # Sample data seeder
│   │   ├── utils/            # Helper functions
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/Images/        # App logo & background images
│   ├── src/
│   │   ├── api/              # Axios client
│   │   ├── app/              # Redux store
│   │   ├── components/       # Shared components (Layout, StatusBadge)
│   │   ├── features/         # Redux slices (auth, attendance, dashboard)
│   │   ├── pages/            # All page components
│   │   ├── router/           # React Router config
│   │   ├── styles.css        # Global styles
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## API Endpoints

### Auth
| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| POST   | `/api/auth/register` | Register employee    |
| POST   | `/api/auth/login`    | Login (any role)     |
| GET    | `/api/auth/me`       | Get current user     |

### Attendance (Employee)
| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| POST   | `/api/attendance/checkin`    | Check in                 |
| POST   | `/api/attendance/checkout`   | Check out                |
| GET    | `/api/attendance/my-history` | Personal history         |
| GET    | `/api/attendance/my-summary` | Monthly summary          |
| GET    | `/api/attendance/today`      | Today's status           |

### Attendance (Manager)
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/api/attendance/all`           | All attendance records   |
| GET    | `/api/attendance/employee/:id`  | Employee attendance      |
| GET    | `/api/attendance/summary`       | Team summary             |
| GET    | `/api/attendance/export`        | Export CSV               |
| GET    | `/api/attendance/today-status`  | Today's team status      |

### Dashboard
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/dashboard/employee` | Employee dashboard data  |
| GET    | `/api/dashboard/manager`  | Manager dashboard data   |

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/employee-attendance-system.git
cd employee-attendance-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/attendance_system
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
OFFICE_START_HOUR=9
OFFICE_START_MINUTE=30
```

Start the backend:

```bash
npm run dev
```

Seed sample data:

```bash
npm run seed
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the app

Visit: [http://localhost:5173](http://localhost:5173)

## Sample Login Credentials

After running the seed script:

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Manager  | manager@example.com    | password123   |
| Employee | amit@example.com       | password123   |

## Environment Variables

### Backend (`backend/.env`)
| Variable             | Description                    | Default                |
|----------------------|--------------------------------|------------------------|
| `PORT`               | Server port                    | 5000                   |
| `MONGO_URI`          | MongoDB connection string      | localhost               |
| `JWT_SECRET`         | JWT signing secret             | —                      |
| `JWT_EXPIRES_IN`     | Token expiry duration          | 7d                     |
| `OFFICE_START_HOUR`  | Office start hour              | 9                      |
| `OFFICE_START_MINUTE`| Office start minute            | 30                     |

### Frontend (`frontend/.env`)
| Variable              | Description         | Default                       |
|-----------------------|---------------------|-------------------------------|
| `VITE_API_BASE_URL`   | Backend API URL     | http://localhost:5000/api     |

## License

This project is for educational purposes.

## Screenshots

### Employee Login
![Employee Login](screenshots/employee-login.png)

### Employee Dashboard
![Employee Dashboard](screenshots/employee-dashboard.png)

### Mark Attendance
![Mark Attendance](screenshots/mark-attendance.png)

### My Attendance History
![My History](screenshots/my-history.png)

### Employee Profile
![Employee Profile](screenshots/employee-profile.png)

### Manager Login
![Manager Login](screenshots/manager-login.png)

### Manager Dashboard
![Manager Dashboard](screenshots/manager-dashboard.png)

### All Employees Attendance
![All Attendance](screenshots/all-attendance.png)

### Team Calendar
![Team Calendar](screenshots/team-calendar.png)

### Reports
![Reports](screenshots/reports.png)
