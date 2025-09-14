import { supabase } from '../config/supabase';

// Tasks API service
export const tasksService = {
  // Fetch all tasks for the current user
  async getTasks() {
    try {
      // Get the current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw new Error('User not authenticated');
      }

      if (!user) {
        throw new Error('No authenticated user found');
      }

      console.log('Fetching tasks for user:', user.id);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw new Error(error.message);
      }

      console.log('Tasks fetched:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in getTasks:', error);
      return { 
        data: null, 
        error: { message: error.message || 'Failed to fetch tasks' } 
      };
    }
  },

  // Create a new task
  async createTask(taskTitle) {
    try {
      if (!taskTitle || !taskTitle.trim()) {
        throw new Error('Task title is required');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            task_title: taskTitle.trim(),
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in createTask:', error);
      return { 
        data: null, 
        error: { message: error.message || 'Failed to create task' } 
      };
    }
  },

  // Update an existing task
  async updateTask(taskId, taskTitle) {
    try {
      if (!taskId) {
        throw new Error('Task ID is required');
      }
      
      if (!taskTitle || !taskTitle.trim()) {
        throw new Error('Task title is required');
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          task_title: taskTitle.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Task not found or you do not have permission to update it');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in updateTask:', error);
      return { 
        data: null, 
        error: { message: error.message || 'Failed to update task' } 
      };
    }
  },

  // Delete a task
  async deleteTask(taskId) {
    try {
      if (!taskId) {
        throw new Error('Task ID is required');
      }

      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error deleting task:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Task not found or you do not have permission to delete it');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in deleteTask:', error);
      return { 
        data: null, 
        error: { message: error.message || 'Failed to delete task' } 
      };
    }
  },

  // Get a single task by ID
  async getTask(taskId) {
    try {
      if (!taskId) {
        throw new Error('Task ID is required');
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.error('Error fetching task:', error);
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getTask:', error);
      return { 
        data: null, 
        error: { message: error.message || 'Failed to fetch task' } 
      };
    }
  },

  // Subscribe to real-time changes for tasks
  subscribeToTasks(callback) {
    try {
      const subscription = supabase
        .channel('tasks')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'tasks' 
          }, 
          callback
        )
        .subscribe();

      return subscription;
    } catch (error) {
      console.error('Error subscribing to tasks:', error);
      return null;
    }
  },

  // Unsubscribe from real-time changes
  unsubscribeFromTasks(subscription) {
    try {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    } catch (error) {
      console.error('Error unsubscribing from tasks:', error);
    }
  }
};