import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { databaseService, Task as DatabaseTask, TaskWithId } from './database';

interface Task {
  id: string;
  title: string;
  dopamineScore: number;
  completed: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  // Initialize database and load tasks
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await databaseService.initDatabase();
        setIsDatabaseReady(true);
        
        // Load existing tasks from database
        const dbTasks = await databaseService.getTasks();
        const convertedTasks: Task[] = dbTasks
          .filter(dbTask => dbTask.id !== undefined) // Only include tasks with valid IDs
          .map(dbTask => ({
            id: dbTask.id!.toString(), // Safe to use ! since we filtered
            title: dbTask.title,
            dopamineScore: dbTask.score,
            completed: dbTask.completed,
          }));
        
        setTasks(convertedTasks);
      } catch (error) {
        Alert.alert('Error', 'Failed to initialize app. Using local storage.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const addTask = async () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    // Save to database if ready
    if (isDatabaseReady) {
      try {
        const dbTask: Omit<DatabaseTask, 'id'> = {
          title: newTaskTitle.trim(),
          score: 1, // All tasks count as 1
          completed: false,
          createdAt: new Date().toISOString(),
        };
        const savedTask = await databaseService.addTask(dbTask);
        
        // Add to local state with the correct database ID
        const newTask: Task = {
          id: savedTask.id.toString(),
          title: savedTask.title,
          dopamineScore: savedTask.score,
          completed: savedTask.completed,
        };
        setTasks([...tasks, newTask]);
      } catch (error) {
        Alert.alert('Warning', 'Task saved locally but failed to save to database.');
        
                 // Fallback: add to local state with temporary ID
         const newTask: Task = {
           id: Date.now().toString(),
           title: newTaskTitle.trim(),
           dopamineScore: 1,
           completed: false,
         };
        setTasks([...tasks, newTask]);
      }
    } else {
             // Database not ready, add to local state with temporary ID
       const newTask: Task = {
         id: Date.now().toString(),
         title: newTaskTitle.trim(),
                    dopamineScore: 1,
         completed: false,
       };
       setTasks([...tasks, newTask]);
     }
     
     setNewTaskTitle('');
  };

  const toggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    // Update local state immediately for responsive UI
    setTasks(updatedTasks);

    // Update database if ready
    if (isDatabaseReady) {
      try {
        const task = updatedTasks.find(t => t.id === taskId);
        if (task) {
          const dbId = parseInt(taskId);
          if (!isNaN(dbId)) {
            await databaseService.updateTask(dbId, {
              completed: task.completed,
            });
          }
        }
      } catch (error) {
        Alert.alert('Warning', 'Task updated locally but failed to update in database.');
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    // Remove from local state immediately for responsive UI
    setTasks(tasks.filter(task => task.id !== taskId));

    // Delete from database if ready
    if (isDatabaseReady) {
      try {
        const dbId = parseInt(taskId);
        if (!isNaN(dbId)) {
          await databaseService.deleteTask(dbId);
        }
      } catch (error) {
        Alert.alert('Warning', 'Task deleted locally but failed to delete from database.');
      }
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const totalDopamine = tasks.filter(task => task.completed).length;

  // Filter tasks based on completion status
  const visibleTasks = showCompletedTasks 
    ? tasks 
    : tasks.filter(task => !task.completed);

  const getProgressColor = () => {
    if (progress >= 0.8) return '#8B5CF6';
    if (progress >= 0.5) return '#A855F7';
    return '#F1F3F4';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Dopamax...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dopamax</Text>
        <Text style={styles.subtitle}>Turn tasks into dopamine hits</Text>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressText}>
            {completedTasks}/{totalTasks} tasks completed
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        
        <View style={styles.dopamineCounter}>
          <Text style={styles.dopamineText}>{totalDopamine}</Text>
          <Text style={styles.dopamineLabel}>tasks completed</Text>
        </View>
      </View>

      {/* Add Task Section */}
      <View style={styles.addTaskSection}>
        <Text style={styles.sectionTitle}>Add New Task</Text>
        
                  <View style={styles.inputContainer}>
            <TextInput
              style={styles.taskInput}
              placeholder="What do you want to accomplish?"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholderTextColor="#999"
            />
          
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.tasksHeader}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
          {completedTasks > 0 && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowCompletedTasks(!showCompletedTasks)}
            >
              <Text style={styles.toggleButtonText}>
                {showCompletedTasks ? 'Hide' : 'Show'} Completed ({completedTasks})
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {visibleTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyText}>
              {tasks.length === 0 ? 'No tasks yet!' : 'All tasks completed!'}
            </Text>
            <Text style={styles.emptySubtext}>
              {tasks.length === 0 
                ? 'Add your first dopamine-boosting task above'
                : 'Great job! Add more tasks to keep the momentum going'
              }
            </Text>
          </View>
        ) : (
          visibleTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => toggleTask(task.id)}
              >
                <View style={styles.taskCheckbox}>
                  <Text style={styles.checkboxText}>
                    {task.completed ? '✓' : '○'}
                  </Text>
                </View>
                
                <View style={styles.taskInfo}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && styles.completedTask,
                    ]}
                  >
                    {task.title}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(task.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F3F4',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  dopamineCounter: {
    alignItems: 'center',
  },
  dopamineText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  dopamineLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addTaskSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    gap: 16,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },

  addButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  taskItem: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskCheckbox: {
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 20,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  deleteButton: {
    padding: 16,
  },
  deleteButtonText: {
    fontSize: 18,
  },
});
