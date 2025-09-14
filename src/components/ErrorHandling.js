import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ErrorBoundary = ({ children }) => {
  return children; // For now, basic implementation
};

export const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <View className={`bg-red-500/10 border border-red-500/20 rounded-xl p-4 ${className}`}>
      <View className="flex-row items-center mb-3">
        <Ionicons name="alert-circle" size={20} color="#EF4444" />
        <Text className="text-red-400 font-medium ml-3">Error</Text>
      </View>
      <Text className="text-red-400 mb-4 leading-5">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          className="bg-red-500 px-4 py-2.5 rounded-lg self-start"
          onPress={onRetry}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const LoadingSpinner = ({ message = 'Loading...', size = 'large' }) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <ActivityIndicator size={size} color="#3B82F6" />
      <Text className="text-gray-400 mt-4 text-base">{message}</Text>
    </View>
  );
};

export const EmptyState = ({ 
  icon, 
  title, 
  message, 
  actionText, 
  onAction,
  className = '' 
}) => {
  return (
    <View className={`flex-1 justify-center items-center px-8 ${className}`}>
      <View className="bg-gray-800/30 p-8 rounded-3xl mb-8">
        <Ionicons name={icon} size={48} color="#6B7280" />
      </View>
      <Text className="text-white text-2xl font-bold mb-3 text-center">
        {title}
      </Text>
      <Text className="text-gray-400 text-center text-base leading-6 mb-8">
        {message}
      </Text>
      {onAction && actionText && (
        <TouchableOpacity
          className="bg-blue-500 px-8 py-4 rounded-xl"
          onPress={onAction}
        >
          <Text className="text-white font-semibold">{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const SuccessMessage = ({ message, onClose, className = '' }) => {
  return (
    <View className={`bg-green-500/10 border border-green-500/20 rounded-xl p-4 ${className}`}>
      <View className="flex-row items-center mb-3">
        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        <Text className="text-green-400 font-medium ml-3">Success</Text>
      </View>
      <Text className="text-green-400 mb-4 leading-5">{message}</Text>
      {onClose && (
        <TouchableOpacity
          className="bg-green-500 px-4 py-2.5 rounded-lg self-start"
          onPress={onClose}
        >
          <Text className="text-white font-medium">Dismiss</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const InfoMessage = ({ message, onClose, className = '' }) => {
  return (
    <View className={`bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 ${className}`}>
      <View className="flex-row items-center mb-3">
        <Ionicons name="information-circle" size={20} color="#3B82F6" />
        <Text className="text-blue-400 font-medium ml-3">Information</Text>
      </View>
      <Text className="text-blue-400 mb-4 leading-5">{message}</Text>
      {onClose && (
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2.5 rounded-lg self-start"
          onPress={onClose}
        >
          <Text className="text-white font-medium">Got it</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};