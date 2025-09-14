import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { tasksService } from '../services/tasksService';

export default function DebugScreen({ navigation }) {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugInfo = async () => {
    setLoading(true);
    try {
      const { data: tasks, error } = await tasksService.getTasks();
      
      setDebugInfo({
        user: {
          id: user?.id || 'No user ID',
          email: user?.email || 'No email',
          authenticated: !!user,
        },
        tasks: {
          count: tasks?.length || 0,
          data: tasks || [],
          error: error?.message || null,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAllTasks = async () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to delete ALL your tasks? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const { data: tasks } = await tasksService.getTasks();
              
              if (tasks && tasks.length > 0) {
                for (const task of tasks) {
                  await tasksService.deleteTask(task.id);
                }
                Alert.alert('Success', `Deleted ${tasks.length} tasks`);
                fetchDebugInfo();
              } else {
                Alert.alert('Info', 'No tasks to delete');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete tasks: ' + error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.headerTitle}>Debug Panel</Text>
            <Text style={styles.headerSubtitle}>App diagnostics and troubleshooting</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="build" size={18} color="#60A5FA" />
            <Text style={styles.sectionTitle}>Debug Actions</Text>
          </View>
          
          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={fetchDebugInfo}
              disabled={loading}
            >
              <Ionicons name="refresh" size={20} color="#60A5FA" />
              <Text style={styles.debugButtonText}>
                {loading ? 'Loading...' : 'Fetch Debug Info'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.debugButton, styles.dangerButton]}
              onPress={clearAllTasks}
              disabled={loading}
            >
              <Ionicons name="trash" size={20} color="#EF4444" />
              <Text style={[styles.debugButtonText, styles.dangerButtonText]}>
                Clear All Tasks
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Debug Information */}
        {debugInfo && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={18} color="#10B981" />
              <Text style={styles.sectionTitle}>Debug Information</Text>
            </View>

            <View style={styles.debugContainer}>
              <View style={styles.debugItem}>
                <Text style={styles.debugLabel}>Timestamp:</Text>
                <Text style={styles.debugValue}>{debugInfo.timestamp}</Text>
              </View>

              {debugInfo.user && (
                <View style={styles.debugSection}>
                  <Text style={styles.debugSectionTitle}>User Information</Text>
                  <View style={styles.debugItem}>
                    <Text style={styles.debugLabel}>User ID:</Text>
                    <Text style={styles.debugValue}>{debugInfo.user.id}</Text>
                  </View>
                  <View style={styles.debugItem}>
                    <Text style={styles.debugLabel}>Email:</Text>
                    <Text style={styles.debugValue}>{debugInfo.user.email}</Text>
                  </View>
                  <View style={styles.debugItem}>
                    <Text style={styles.debugLabel}>Authenticated:</Text>
                    <Text style={[
                      styles.debugValue,
                      debugInfo.user.authenticated ? styles.successText : styles.errorText
                    ]}>
                      {debugInfo.user.authenticated ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </View>
              )}

              {debugInfo.tasks && (
                <View style={styles.debugSection}>
                  <Text style={styles.debugSectionTitle}>Tasks Information</Text>
                  <View style={styles.debugItem}>
                    <Text style={styles.debugLabel}>Task Count:</Text>
                    <Text style={styles.debugValue}>{debugInfo.tasks.count}</Text>
                  </View>
                  {debugInfo.tasks.error && (
                    <View style={styles.debugItem}>
                      <Text style={styles.debugLabel}>Error:</Text>
                      <Text style={[styles.debugValue, styles.errorText]}>
                        {debugInfo.tasks.error}
                      </Text>
                    </View>
                  )}
                  
                  {debugInfo.tasks.data && debugInfo.tasks.data.length > 0 && (
                    <View style={styles.tasksContainer}>
                      <Text style={styles.debugSectionTitle}>Task Details</Text>
                      {debugInfo.tasks.data.map((task, index) => (
                        <View key={task.id} style={styles.taskItem}>
                          <Text style={styles.taskTitle}>#{index + 1}: {task.task_title}</Text>
                          <Text style={styles.taskMeta}>ID: {task.id}</Text>
                          <Text style={styles.taskMeta}>
                            Created: {new Date(task.created_at).toLocaleString()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {debugInfo.error && (
                <View style={styles.debugSection}>
                  <Text style={[styles.debugSectionTitle, styles.errorText]}>Error</Text>
                  <Text style={[styles.debugValue, styles.errorText]}>{debugInfo.error}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle" size={18} color="#F59E0B" />
            <Text style={styles.sectionTitle}>How to Use</Text>
          </View>
          
          <View style={styles.instructionsContainer}>
            <View style={styles.instruction}>
              <View style={styles.instructionBullet} />
              <Text style={styles.instructionText}>
                Use "Fetch Debug Info" to see current user and task data
              </Text>
            </View>
            <View style={styles.instruction}>
              <View style={styles.instructionBullet} />
              <Text style={styles.instructionText}>
                Check if your user ID matches the task owner ID
              </Text>
            </View>
            <View style={styles.instruction}>
              <View style={styles.instructionBullet} />
              <Text style={styles.instructionText}>
                Use "Clear All Tasks" to reset your task list (destructive action)
              </Text>
            </View>
            <View style={styles.instruction}>
              <View style={styles.instructionBullet} />
              <Text style={styles.instructionText}>
                Share this debug info with support if you encounter issues
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  debugButton: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButton: {
    borderColor: '#DC2626',
  },
  debugButtonText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  dangerButtonText: {
    color: '#EF4444',
  },
  debugContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  debugItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  debugLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    width: 120,
    flexShrink: 0,
  },
  debugValue: {
    color: '#E5E7EB',
    fontSize: 14,
    flex: 1,
    fontFamily: 'monospace',
  },
  debugSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  debugSectionTitle: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  successText: {
    color: '#10B981',
  },
  errorText: {
    color: '#EF4444',
  },
  tasksContainer: {
    marginTop: 16,
  },
  taskItem: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  taskTitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskMeta: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  instructionsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#F59E0B',
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
    flexShrink: 0,
  },
  instructionText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});