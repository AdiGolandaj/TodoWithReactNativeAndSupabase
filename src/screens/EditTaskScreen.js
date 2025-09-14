import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tasksService } from '../services/tasksService';

export default function EditTaskScreen({ navigation, route }) {
  const { task } = route.params;
  const [taskTitle, setTaskTitle] = useState(task.task_title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateTask = async () => {
    if (!taskTitle.trim()) {
      setError('Please enter a task title');
      return;
    }

    if (taskTitle.trim() === task.task_title) {
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await tasksService.updateTask(task.id, taskTitle);
      
      if (error) {
        setError(error.message);
        Alert.alert('Error', error.message);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete this task?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await tasksService.deleteTask(task.id);
              
              if (error) {
                Alert.alert('Error', error.message);
              } else {
                navigation.goBack();
              }
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-900"
    >
      {/* Header */}
      <View className="bg-gray-900 border-b border-gray-800/50 px-6 py-6 pt-12">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="bg-gray-800 p-2.5 rounded-xl mr-4"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#E5E7EB" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">Edit Task</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Update your task details
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            className="bg-red-500/20 p-3 rounded-xl"
            onPress={handleDeleteTask}
            disabled={loading}
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        {/* Task Input */}
        <View className="mb-8">
          <Text className="text-gray-300 mb-4 font-medium text-base">
            Task description
          </Text>
          <TextInput
            className={`bg-gray-800 border rounded-xl px-4 py-6 text-white text-base leading-6 ${
              error ? 'border-red-500' : 'border-gray-700'
            } focus:border-blue-500`}
            placeholder="Enter your task here..."
            placeholderTextColor="#6B7280"
            value={taskTitle}
            onChangeText={(text) => {
              setTaskTitle(text);
              if (error) setError(null);
            }}
            multiline
            textAlignVertical="top"
            style={{ minHeight: 120, maxHeight: 200 }}
            autoFocus
            selectionColor="#3B82F6"
          />
          {error && (
            <View className="flex-row items-center mt-3">
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-red-400 text-sm ml-2">{error}</Text>
            </View>
          )}
        </View>

        {/* Task Metadata */}
        <View className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-5 mb-8">
          <View className="flex-row items-center mb-3">
            <View className="bg-gray-700/50 p-2 rounded-lg">
              <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
            </View>
            <Text className="text-gray-300 font-medium ml-3">Task Information</Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text className="text-gray-400 text-sm ml-2">
                Created: {formatDate(task.created_at)}
              </Text>
            </View>
            {task.updated_at && task.updated_at !== task.created_at && (
              <View className="flex-row items-center">
                <Ionicons name="pencil-outline" size={14} color="#6B7280" />
                <Text className="text-gray-400 text-sm ml-2">
                  Last updated: {formatDate(task.updated_at)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            className={`bg-blue-500 rounded-xl py-4 px-6 ${loading ? 'opacity-50' : ''}`}
            onPress={handleUpdateTask}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Updating...
                </Text>
              </View>
            ) : (
              <View className="flex-row justify-center items-center">
                <Ionicons name="checkmark" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Update Task
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-800 rounded-xl py-4 px-6"
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text className="text-gray-300 text-center font-semibold text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}