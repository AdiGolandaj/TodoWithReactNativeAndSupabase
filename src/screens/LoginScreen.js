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
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const { signIn, loading, authError, clearError } = useAuth();

  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    clearError();
    const { error } = await signIn(email, password);
    
    if (error) {
      Alert.alert('Sign In Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-900"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-8 py-12">
          {/* Header */}
          <View className="mb-12 items-center">
            <View className="bg-blue-500/10 p-4 rounded-2xl mb-6">
              <Ionicons name="checkmark-done" size={32} color="#3B82F6" />
            </View>
            <Text className="text-4xl font-bold text-white mb-3 tracking-tight">
              Welcome back
            </Text>
            <Text className="text-gray-400 text-lg text-center leading-6">
              Sign in to continue managing{'\n'}your tasks and projects
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Email Field */}
            <View>
              <Text className="text-gray-300 mb-3 font-medium text-base">
                Email address
              </Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-800 border rounded-xl px-4 py-4 text-white text-base ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-700'
                  } focus:border-blue-500`}
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (validationErrors.email) {
                      setValidationErrors(prev => ({ ...prev, email: null }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  selectionColor="#3B82F6"
                />
                {email.length > 0 && (
                  <View className="absolute right-4 top-4">
                    <Ionicons 
                      name={validationErrors.email ? "close-circle" : "checkmark-circle"} 
                      size={20} 
                      color={validationErrors.email ? "#EF4444" : "#10B981"} 
                    />
                  </View>
                )}
              </View>
              {validationErrors.email && (
                <Text className="text-red-400 text-sm mt-2 ml-1">
                  {validationErrors.email}
                </Text>
              )}
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-gray-300 mb-3 font-medium text-base">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-800 border rounded-xl px-4 py-4 text-white text-base ${
                    validationErrors.password ? 'border-red-500' : 'border-gray-700'
                  } focus:border-blue-500`}
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (validationErrors.password) {
                      setValidationErrors(prev => ({ ...prev, password: null }));
                    }
                  }}
                  secureTextEntry
                  autoComplete="password"
                  selectionColor="#3B82F6"
                />
                {password.length > 0 && (
                  <View className="absolute right-4 top-4">
                    <Ionicons 
                      name={validationErrors.password ? "close-circle" : "checkmark-circle"} 
                      size={20} 
                      color={validationErrors.password ? "#EF4444" : "#10B981"} 
                    />
                  </View>
                )}
              </View>
              {validationErrors.password && (
                <Text className="text-red-400 text-sm mt-2 ml-1">
                  {validationErrors.password}
                </Text>
              )}
            </View>

            {/* Error Message */}
            {authError && (
              <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <View className="flex-row items-center">
                  <Ionicons name="alert-circle" size={20} color="#EF4444" />
                  <Text className="text-red-400 ml-3 flex-1">{authError}</Text>
                </View>
              </View>
            )}

            {/* Sign In Button */}
            <TouchableOpacity
              className={`bg-blue-500 rounded-xl py-4 px-6 mt-6 ${loading ? 'opacity-50' : ''}`}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Signing in...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Sign in
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mt-8 pt-6 border-t border-gray-800">
              <Text className="text-gray-400 text-base">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text className="text-blue-400 font-semibold text-base">Create one</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}