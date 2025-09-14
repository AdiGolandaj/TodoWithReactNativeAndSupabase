# My Tasks App - React Native with Supabase

A complete React Native task management application with Supabase authentication and real-time database synchronization.

## Features

- ✅ **User Authentication**: Sign up, sign in, and sign out with email/password
- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Real-time Updates**: Tasks sync in real-time across devices
- ✅ **Row Level Security**: Users can only see and manage their own tasks
- ✅ **Responsive Design**: Built with NativeWind (Tailwind CSS for React Native)
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Input Validation**: Form validation for authentication and task creation
- ✅ **Loading States**: Loading indicators for better UX

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation 6
- **State Management**: React Context API
- **Database**: PostgreSQL with Row Level Security (RLS)

## Project Structure

```
my-tasks-app/
├── App.js                          # Main app component with navigation
├── src/
│   ├── config/
│   │   ├── env.js                 # Environment configuration
│   │   └── supabase.js            # Supabase client setup
│   ├── contexts/
│   │   └── AuthContext.js         # Authentication context
│   ├── screens/
│   │   ├── LoginScreen.js         # User login screen
│   │   ├── SignUpScreen.js        # User registration screen
│   │   ├── TasksScreen.js         # Main tasks list screen
│   │   ├── AddTaskScreen.js       # Create new task screen
│   │   └── EditTaskScreen.js      # Edit existing task screen
│   ├── services/
│   │   └── tasksService.js        # API service for task operations
│   └── components/
│       └── ErrorHandling.js       # Error handling components
├── SUPABASE_SETUP.md              # Database setup instructions
└── package.json
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account

## Installation

1. **Clone the repository** (or create the project structure):
   ```bash
   cd my-tasks-app
   npm install
   ```

2. **Set up Supabase**:
   - Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create a new Supabase project
   - Set up the database schema and RLS policies
   - Get your project URL and anon key

3. **Configure environment**:
   - Update `src/config/env.js` with your Supabase credentials:
   ```javascript
   export const SUPABASE_URL = 'your-project-url';
   export const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

## Database Schema

The app uses a simple `tasks` table with the following structure:

```sql
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

## Row Level Security (RLS) Policies

The app implements strict RLS policies to ensure data isolation:

- **SELECT**: Users can only view their own tasks
- **INSERT**: Users can only create tasks for themselves
- **UPDATE**: Users can only update their own tasks
- **DELETE**: Users can only delete their own tasks

## API Functions

### Authentication (`AuthContext.js`)
- `signUp(email, password)` - Create new user account
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user

### Tasks (`tasksService.js`)
- `getTasks()` - Fetch all tasks for current user
- `createTask(title)` - Create a new task
- `updateTask(id, title)` - Update existing task
- `deleteTask(id)` - Delete a task
- `subscribeToTasks(callback)` - Subscribe to real-time updates

## Key Features Explained

### 1. Authentication Flow
- Unauthenticated users see login/signup screens
- Authenticated users see the tasks interface
- Automatic session management with persistent storage

### 2. Real-time Updates
- Uses Supabase's real-time subscriptions
- Tasks are automatically synced across devices
- No manual refresh needed

### 3. Error Handling
- Network errors are caught and displayed to users
- Validation errors prevent invalid data submission
- Loading states provide feedback during operations

### 4. Security
- Row Level Security prevents data leaks
- JWT tokens are automatically managed
- All API calls are authenticated

## Testing RLS Functionality

To verify that RLS is working correctly:

1. Create two different user accounts
2. Log in with the first account and create some tasks
3. Log out and log in with the second account
4. Verify that the second user cannot see the first user's tasks
5. Try to access tasks directly via the Supabase dashboard

## Common Issues & Solutions

### 1. "relation 'tasks' does not exist"
- Ensure you've created the tasks table in Supabase
- Check your database connection

### 2. "permission denied for table tasks"
- Verify RLS policies are correctly set up
- Check that the user is authenticated

### 3. Real-time not working
- Ensure you've enabled the realtime publication
- Check your network connection

### 4. Authentication errors
- Verify your Supabase URL and anon key
- Check that authentication is enabled in Supabase

## Development Notes

### Adding New Features
1. Create new screens in `src/screens/`
2. Add navigation routes in `App.js`
3. Extend the tasks service if needed
4. Update database schema if required

### Styling
- Uses NativeWind for styling (Tailwind CSS syntax)
- Responsive design with consistent spacing
- Dark mode support can be added later

### State Management
- Authentication state managed by Context API
- Task state managed locally with real-time sync
- Consider Redux for more complex state needs


## License

This project is for educational purposes. Feel free to use and modify as needed.
