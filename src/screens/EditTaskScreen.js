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
import { tasksService } from '../services/tasksService';

export default function EditTaskScreen({ navigation, route }) {
  const { task } = route.params;
  const [taskTitle, setTaskTitle] = useState(task.task_title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateTask = async () => {
    if (!taskTitle.trim()) {
      setError('Please enter a task title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await tasksService.updateTask(task.id, taskTitle.trim());
      
      if (error) {
        setError(error.message);
        return;
      }

      Alert.alert(
        'Success',
        'Task updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      setError('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#E5E7EB" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Edit Task</Text>
              <Text style={styles.headerSubtitle}>Update your task details</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Task Title</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="document-text" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your task..."
                  placeholderTextColor="#6B7280"
                  value={taskTitle}
                  onChangeText={(text) => {
                    setTaskTitle(text);
                    if (error) setError('');
                  }}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  autoFocus
                />
              </View>
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#EF4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>

            <View style={styles.metadataContainer}>
              <View style={styles.metadataHeader}>
                <Ionicons name="information-circle" size={18} color="#60A5FA" />
                <Text style={styles.metadataTitle}>Task Information</Text>
              </View>
              <View style={styles.metadataList}>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Created:</Text>
                  <Text style={styles.metadataValue}>{formatDate(task.created_at)}</Text>
                </View>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Task ID:</Text>
                  <Text style={styles.metadataValue}>#{task.id}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.updateButton, loading && styles.updateButtonDisabled]}
              onPress={handleUpdateTask}
              disabled={loading || !taskTitle.trim()}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View style={styles.updateButtonContent}>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.updateButtonText}>Update Task</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 65, 81, 0.5)',
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingTop: 48,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#1F2937',
    padding: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  inputWrapper: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 16,
    minHeight: 120,
  },
  inputIcon: {
    marginBottom: 8,
  },
  input: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginLeft: 6,
  },
  metadataContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  metadataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metadataTitle: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  metadataList: {
    paddingLeft: 8,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metadataLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    width: 80,
  },
  metadataValue: {
    color: '#E5E7EB',
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  updateButton: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
  },
  updateButtonDisabled: {
    opacity: 0.5,
  },
  updateButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});