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
import * as Notifications from 'expo-notifications';
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await databaseService.initDatabase();
        setIsDatabaseReady(true);
        
        const dbTasks = await databaseService.getTasks();
        const tasks = dbTasks
          .filter(task => task.id !== undefined)
          .map(task => ({
            id: task.id!.toString(),
            title: task.title,
            dopamineScore: task.score,
            completed: task.completed,
          }));
        
        setTasks(tasks);
        
        await setupNotifications();
      } catch (error) {
        Alert.alert('Error', 'Failed to initialize app.');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const setupNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        setNotificationsEnabled(false);
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Dopamax',
          body: 'Good morning! Ready to be productive today?',
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Dopamax',
          body: 'Weekly summary: You completed tasks this week',
        },
        trigger: {
          weekday: 1,
          hour: 18,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      setNotificationsEnabled(false);
    }
  };

  const addTask = async () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (isDatabaseReady) {
      try {
        const dbTask: Omit<DatabaseTask, 'id'> = {
          title: newTaskTitle.trim(),
          score: 1,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        const savedTask = await databaseService.addTask(dbTask);
        
        const newTask: Task = {
          id: savedTask.id.toString(),
          title: savedTask.title,
          dopamineScore: savedTask.score,
          completed: savedTask.completed,
        };
        setTasks([...tasks, newTask]);
      } catch (error) {
        Alert.alert('Warning', 'Task saved locally but failed to save to database.');
        
        const newTask: Task = {
          id: Date.now().toString(),
          title: newTaskTitle.trim(),
          dopamineScore: 1,
          completed: false,
        };
        setTasks([...tasks, newTask]);
      }
    } else {
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
    
    setTasks(updatedTasks);

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

  const confirmDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const deleteTask = async () => {
    if (!taskToDelete) return;
    
    setTasks(tasks.filter(task => task.id !== taskToDelete));

    if (isDatabaseReady) {
      try {
        const dbId = parseInt(taskToDelete);
        if (!isNaN(dbId)) {
          await databaseService.deleteTask(dbId);
        }
      } catch (error) {
        Alert.alert('Warning', 'Task deleted locally but failed to delete from database.');
      }
    }
    
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
  };

  const saveEdit = async () => {
    if (!editingTask || editTaskTitle.trim() === '') return;

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id ? { ...task, title: editTaskTitle.trim() } : task
    );
    
    setTasks(updatedTasks);

    if (isDatabaseReady) {
      try {
        const dbId = parseInt(editingTask.id);
        if (!isNaN(dbId)) {
          await databaseService.updateTask(dbId, {
            title: editTaskTitle.trim(),
          });
        }
      } catch (error) {
        Alert.alert('Warning', 'Task updated locally but failed to update in database.');
      }
    }
    
    setEditingTask(null);
    setEditTaskTitle('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTaskTitle('');
  };

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsEnabled(false);
    } else {
      await setupNotifications();
      setNotificationsEnabled(true);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const totalDopamine = tasks.filter(task => task.completed).length;

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
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Dopamax</Text>
            <Text style={styles.subtitle}>Turn tasks into dopamine hits</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationToggle} 
            onPress={toggleNotifications}
          >
            <Text style={styles.notificationToggleText}>
              {notificationsEnabled ? '🔔' : '🔕'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
              {editingTask?.id === task.id ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editTaskTitle}
                    onChangeText={setEditTaskTitle}
                    placeholder="Edit task..."
                    placeholderTextColor="#999"
                    autoFocus
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
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
                  
                  <View style={styles.taskActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => startEdit(task)}
                    >
                      <Text style={styles.editButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => confirmDelete(task.id)}
                    >
                      <Text style={styles.deleteButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Task?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this task? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={cancelDelete}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDeleteButton} onPress={deleteTask}>
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationToggle: {
    padding: 8,
  },
  notificationToggleText: {
    fontSize: 20,
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

  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 12,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 12,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#FF6B6B',
  },
  editContainer: {
    padding: 16,
    width: '100%',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    maxWidth: 300,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalDeleteButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  modalDeleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
