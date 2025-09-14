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

export default function AddTaskScreen({ navigation }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      setError('Please enter a task title');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await tasksService.createTask(taskTitle);
      
      if (error) {
        setError(error.message);
        Alert.alert('Error', error.message);
      } else {
        // Success - navigate back with a subtle feedback
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-900"
    >
      {/* Header */}
      <View className="bg-gray-900 border-b border-gray-800/50 px-6 py-6 pt-12">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="bg-gray-800 p-2.5 rounded-xl mr-4"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#E5E7EB" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">New Task</Text>
            <Text className="text-gray-400 text-sm mt-1">
              Add a new task to your list
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        {/* Task Input */}
        <View className="mb-8">
          <Text className="text-gray-300 mb-4 font-medium text-base">
            What needs to be done?
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

        {/* Action Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            className={`bg-blue-500 rounded-xl py-4 px-6 ${loading ? 'opacity-50' : ''}`}
            onPress={handleCreateTask}
            disabled={loading || !taskTitle.trim()}
          >
            {loading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Creating...
                </Text>
              </View>
            ) : (
              <View className="flex-row justify-center items-center">
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Create Task
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

        {/* Tips Section */}
        <View className="mt-12 bg-gray-800/30 border border-gray-700/30 rounded-xl p-5">
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-500/20 p-2 rounded-lg">
              <Ionicons name="bulb-outline" size={16} color="#3B82F6" />
            </View>
            <Text className="text-white font-medium ml-3">Tips for better tasks</Text>
          </View>
          <Text className="text-gray-400 text-sm leading-6">
            • Be specific about what needs to be done{'\n'}
            • Include important details or deadlines{'\n'}
            • Keep it actionable and clear{'\n'}
            • Break down large tasks into smaller ones
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}