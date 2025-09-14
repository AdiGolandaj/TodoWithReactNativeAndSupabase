# Supabase Database Setup Instructions

Follow these steps to set up your Supabase database with the tasks table and Row Level Security (RLS) policies.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for an account or log in
3. Click "New Project"
4. Choose your organization
5. Enter a project name (e.g., "my-tasks-app")
6. Enter a database password (save this!)
7. Choose a region closest to your users
8. Click "Create new project"

## 2. Get Your Project Credentials

1. Once your project is ready, go to Settings > API
2. Copy your Project URL
3. Copy your anon/public key
4. Update the values in `src/config/env.js`:

```javascript
export const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
export const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

## 3. Create the Tasks Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create the tasks table
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create an index on user_id for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Create an index on created_at for ordering
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 4. Enable Row Level Security (RLS)

Run this SQL to enable RLS and create policies:

```sql
-- Enable RLS on the tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert tasks for themselves
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own tasks
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
```

## 5. Enable Realtime (Optional)

If you want real-time updates, run this SQL:

```sql
-- Enable realtime for the tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

## 6. Test Your Setup

After setting up the database, you can test the RLS policies by:

1. Creating two different user accounts in your app
2. Adding tasks with each user
3. Verifying that each user only sees their own tasks
4. Trying to access another user's task directly (should fail)

## 7. Sample Data (Optional)

If you want to add some test data, run this SQL (replace the user_id with an actual user ID from your auth.users table):

```sql
-- Insert sample tasks (replace with actual user ID)
INSERT INTO tasks (user_id, task_title) VALUES 
  ('USER_ID_HERE', 'Complete project documentation'),
  ('USER_ID_HERE', 'Review code changes'),
  ('USER_ID_HERE', 'Deploy to production');
```

## Security Notes

- RLS policies ensure that users can only access their own data
- The `auth.uid()` function returns the current authenticated user's ID
- All policies check that the `user_id` matches the authenticated user
- Never disable RLS on tables containing user data
- Always test your policies thoroughly

## Troubleshooting

### Common Issues:

1. **"relation 'tasks' does not exist"**: Make sure you created the table first
2. **"permission denied"**: Check that RLS policies are correctly set up
3. **"JWT expired"**: User needs to sign in again
4. **Real-time not working**: Make sure you enabled the publication

### Testing RLS Policies:

You can test policies manually in the SQL editor:

```sql
-- Test as if you're a specific user (replace with actual user ID)
SELECT set_config('request.jwt.claims', '{"sub":"USER_ID_HERE"}', true);

-- Now test queries
SELECT * FROM tasks; -- Should only return tasks for that user
```

## Environment Setup Checklist

- [ ] Supabase project created
- [ ] Project URL and anon key updated in env.js
- [ ] Tasks table created with proper schema
- [ ] RLS enabled and policies created
- [ ] Realtime enabled (if desired)
- [ ] Policies tested with multiple users
- [ ] App can connect to Supabase successfully