import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { tasksService } from '../services/tasksService';

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { user, signOut } = useAuth();

  const fetchTasks = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      
      console.log('Fetching tasks for user:', user?.id);
      const { data, error } = await tasksService.getTasks();
      
      if (error) {
        console.error('TasksScreen - Error fetching tasks:', error);
        setError(error.message);
        Alert.alert('Error', error.message);
      } else {
        console.log('TasksScreen - Tasks received:', data);
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await tasksService.deleteTask(taskId);
              
              if (error) {
                Alert.alert('Error', error.message);
              } else {
                // Remove the task from local state
                setTasks(prev => prev.filter(task => task.id !== taskId));
              }
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks(true);

    // Subscribe to real-time updates
    const subscription = tasksService.subscribeToTasks((payload) => {
      console.log('Real-time update:', payload);
      
      // Check if this task belongs to the current user
      const taskUserId = payload.new?.user_id || payload.old?.user_id;
      if (taskUserId !== user?.id) {
        return; // Ignore tasks from other users
      }
      
      // Use correct Supabase real-time event property
      switch (payload.eventType) {
        case 'INSERT':
          setTasks(prev => [payload.new, ...prev]);
          break;
        case 'UPDATE':
          setTasks(prev => prev.map(task => 
            task.id === payload.new.id ? payload.new : task
          ));
          break;
        case 'DELETE':
          setTasks(prev => prev.filter(task => task.id !== payload.old.id));
          break;
      }
    });

    return () => {
      if (subscription) {
        tasksService.unsubscribeFromTasks(subscription);
      }
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const renderTask = ({ item, index }) => (
    <TouchableOpacity
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 mb-3 active:bg-gray-800/70"
      onPress={() => navigation.navigate('EditTask', { task: item })}
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-4">
          <Text className="text-white font-medium text-base leading-6 mb-2">
            {item.task_title}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text className="text-gray-400 text-sm ml-1">
              {formatDate(item.created_at)}
              {item.updated_at && item.updated_at !== item.created_at && (
                <Text className="text-gray-500"> • edited</Text>
              )}
            </Text>
          </View>
        </View>
        
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="bg-blue-500/20 p-2.5 rounded-lg"
            onPress={() => navigation.navigate('EditTask', { task: item })}
          >
            <Ionicons name="pencil" size={16} color="#3B82F6" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-red-500/20 p-2.5 rounded-lg"
            onPress={() => handleDeleteTask(item.id, item.task_title)}
          >
            <Ionicons name="trash" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center px-8 py-16">
      <View className="bg-gray-800/30 p-8 rounded-3xl mb-8">
        <Ionicons name="document-text-outline" size={48} color="#6B7280" />
      </View>
      <Text className="text-white text-2xl font-bold mb-3">
        No tasks yet
      </Text>
      <Text className="text-gray-400 text-center text-base leading-6 mb-8">
        Start organizing your work by{'\n'}creating your first task
      </Text>
      <TouchableOpacity
        className="bg-blue-500 px-8 py-4 rounded-xl"
        onPress={() => navigation.navigate('AddTask')}
      >
        <View className="flex-row items-center">
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold text-base ml-2">
            Create first task
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900">
        <View className="bg-gray-900 border-b border-gray-800/50 px-6 py-6 pt-12">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-xl font-bold tracking-tight">My Tasks</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Loading your workspace...
              </Text>
            </View>
          </View>
        </View>
        
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-gray-800 p-8 rounded-2xl border border-gray-700 items-center">
            <View className="bg-blue-500/10 p-4 rounded-full mb-4">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
            <Text className="text-white font-semibold text-lg mb-2 tracking-tight">Loading Tasks</Text>
            <Text className="text-gray-400 text-center leading-6 max-w-xs">
              Fetching your latest tasks from the cloud...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-900 border-b border-gray-800/50 px-6 py-6 pt-12">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold mb-2 tracking-tight">
              My Tasks
            </Text>
            <Text className="text-gray-400 text-base">
              {user?.email?.split('@')[0] || 'Welcome back'}
            </Text>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="bg-gray-800 p-3 rounded-xl"
              onPress={() => navigation.navigate('Debug')}
            >
              <Ionicons name="bug-outline" size={20} color="#F59E0B" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-800 p-3 rounded-xl"
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6">
        {error && (
          <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
            <View className="flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text className="text-red-400 ml-3 flex-1">{error}</Text>
            </View>
          </View>
        )}

        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white font-semibold text-lg">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Stay organized, stay productive
                </Text>
              </View>
              <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-xl"
                onPress={() => navigation.navigate('AddTask')}
              >
                <View className="flex-row items-center">
                  <Ionicons name="add" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">New</Text>
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              data={tasks}
              renderItem={renderTask}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  tintColor="#6B7280"
                  colors={['#6B7280']}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        )}
      </View>
    </View>
  );
}