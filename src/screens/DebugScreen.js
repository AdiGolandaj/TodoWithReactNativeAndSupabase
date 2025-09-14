import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function DebugScreen({ navigation }) {
  const [debugInfo, setDebugInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const runDebugTests = async () => {
    setLoading(true);
    let info = 'DEBUG INFORMATION:\n\n';
    
    try {
      // Test 1: Check current user
      info += '1. Current User:\n';
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        info += `   Error: ${userError.message}\n`;
      } else {
        info += `   User ID: ${currentUser?.id}\n`;
        info += `   Email: ${currentUser?.email}\n`;
      }
      info += '\n';

      // Test 2: Check session
      info += '2. Current Session:\n';
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        info += `   Error: ${sessionError.message}\n`;
      } else {
        info += `   Session exists: ${!!session}\n`;
        info += `   Access token exists: ${!!session?.access_token}\n`;
      }
      info += '\n';

      // Test 3: Raw query to tasks table
      info += '3. Raw Tasks Query (no filters):\n';
      const { data: allTasks, error: allTasksError } = await supabase
        .from('tasks')
        .select('*');
      
      if (allTasksError) {
        info += `   Error: ${allTasksError.message}\n`;
      } else {
        info += `   Total tasks in database: ${allTasks?.length || 0}\n`;
        if (allTasks && allTasks.length > 0) {
          info += `   Sample task: ${JSON.stringify(allTasks[0], null, 2)}\n`;
        }
      }
      info += '\n';

      // Test 4: Query with user_id filter
      if (currentUser?.id) {
        info += '4. Filtered Tasks Query (with user_id):\n';
        const { data: userTasks, error: userTasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', currentUser.id);
        
        if (userTasksError) {
          info += `   Error: ${userTasksError.message}\n`;
        } else {
          info += `   User's tasks: ${userTasks?.length || 0}\n`;
          if (userTasks && userTasks.length > 0) {
            userTasks.forEach((task, index) => {
              info += `   Task ${index + 1}: ${task.task_title} (ID: ${task.id})\n`;
            });
          }
        }
        info += '\n';
      }

      // Test 5: Manual insert test
      info += '5. Test Insert:\n';
      const testTitle = `Debug test task ${new Date().getTime()}`;
      const { data: insertData, error: insertError } = await supabase
        .from('tasks')
        .insert({ task_title: testTitle, user_id: currentUser?.id })
        .select();
      
      if (insertError) {
        info += `   Insert failed: ${insertError.message}\n`;
      } else {
        info += `   Insert successful: ${JSON.stringify(insertData)}\n`;
      }

    } catch (error) {
      info += `\nUnexpected error: ${error.message}\n`;
    }

    setDebugInfo(info);
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-gray-900">
      <View className="bg-gray-900 border-b border-gray-800/50 px-6 py-6 pt-12">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="bg-gray-800 p-2.5 rounded-xl mr-4"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#E5E7EB" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl font-bold">Debug Console</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Diagnostic information
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1 px-6 py-6">
        <TouchableOpacity
          className={`bg-blue-500 px-6 py-4 rounded-xl mb-6 ${loading ? 'opacity-50' : ''}`}
          onPress={runDebugTests}
          disabled={loading}
        >
          <View className="flex-row justify-center items-center">
            <Ionicons name="bug" size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              {loading ? 'Running Tests...' : 'Run Debug Tests'}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="flex-1 bg-gray-800 rounded-xl border border-gray-700">
          <View className="border-b border-gray-700 px-4 py-3">
            <View className="flex-row items-center">
              <Ionicons name="terminal" size={16} color="#9CA3AF" />
              <Text className="text-gray-300 font-medium ml-2">Console Output</Text>
            </View>
          </View>
          
          <ScrollView className="flex-1 p-4">
            <Text className="font-mono text-sm text-gray-300 leading-5">
              {debugInfo || 'Press "Run Debug Tests" to start debugging...\n\nThis will help identify any issues with:\n• User authentication\n• Database connectivity\n• RLS policies\n• Task creation and retrieval'}
            </Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}