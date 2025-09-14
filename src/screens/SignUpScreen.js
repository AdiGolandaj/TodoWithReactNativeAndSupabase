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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const { signUp, loading, authError, clearError } = useAuth();

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
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    clearError();
    const { error } = await signUp(email, password);
    
    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else {
      Alert.alert(
        'Account Created!',
        'Welcome! Please check your email to confirm your account.',
        [
          {
            text: 'Got it',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
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
            <View className="bg-green-500/10 p-4 rounded-2xl mb-6">
              <Ionicons name="person-add" size={32} color="#10B981" />
            </View>
            <Text className="text-4xl font-bold text-white mb-3 tracking-tight">
              Get started
            </Text>
            <Text className="text-gray-400 text-lg text-center leading-6">
              Create your account to start{'\n'}organizing your tasks
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
                  placeholder="Create a strong password"
                  placeholderTextColor="#6B7280"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (validationErrors.password) {
                      setValidationErrors(prev => ({ ...prev, password: null }));
                    }
                  }}
                  secureTextEntry
                  autoComplete="password-new"
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

            {/* Confirm Password Field */}
            <View>
              <Text className="text-gray-300 mb-3 font-medium text-base">
                Confirm password
              </Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-800 border rounded-xl px-4 py-4 text-white text-base ${
                    validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  } focus:border-blue-500`}
                  placeholder="Confirm your password"
                  placeholderTextColor="#6B7280"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors(prev => ({ ...prev, confirmPassword: null }));
                    }
                  }}
                  secureTextEntry
                  autoComplete="password-new"
                  selectionColor="#3B82F6"
                />
                {confirmPassword.length > 0 && (
                  <View className="absolute right-4 top-4">
                    <Ionicons 
                      name={validationErrors.confirmPassword ? "close-circle" : "checkmark-circle"} 
                      size={20} 
                      color={validationErrors.confirmPassword ? "#EF4444" : "#10B981"} 
                    />
                  </View>
                )}
              </View>
              {validationErrors.confirmPassword && (
                <Text className="text-red-400 text-sm mt-2 ml-1">
                  {validationErrors.confirmPassword}
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

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`bg-green-500 rounded-xl py-4 px-6 mt-6 ${loading ? 'opacity-50' : ''}`}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Creating account...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Create account
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center mt-8 pt-6 border-t border-gray-800">
              <Text className="text-gray-400 text-base">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-blue-400 font-semibold text-base">Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}