import React, { useState } from 'react';
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

interface Task {
  id: string;
  title: string;
  dopamineScore: number;
  completed: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskScore, setNewTaskScore] = useState('5');

  const addTask = () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const score = parseInt(newTaskScore) || 5;
    if (score < 1 || score > 10) {
      Alert.alert('Error', 'Dopamine score must be between 1-10');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      dopamineScore: score,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskScore('5');
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const totalDopamine = tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.dopamineScore, 0);

  const getProgressColor = () => {
    if (progress >= 0.8) return '#8B5CF6';
    if (progress >= 0.5) return '#A855F7';
    return '#F1F3F4';
  };

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
          <Text style={styles.dopamineLabel}>dopamine points earned</Text>
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
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Dopamine Score:</Text>
            <View style={styles.scoreButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <TouchableOpacity
                  key={score}
                  style={[
                    styles.scoreButton,
                    {
                      backgroundColor: parseInt(newTaskScore) === score ? '#8B5CF6' : '#F1F3F4',
                    },
                  ]}
                  onPress={() => setNewTaskScore(score.toString())}
                >
                  <Text
                    style={[
                      styles.scoreButtonText,
                      {
                        color: parseInt(newTaskScore) === score ? 'white' : '#666',
                      },
                    ]}
                  >
                    {score}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Tasks</Text>
        
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyText}>No tasks yet!</Text>
            <Text style={styles.emptySubtext}>Add your first dopamine-boosting task above</Text>
          </View>
        ) : (
          tasks.map((task) => (
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
                  <View style={styles.taskScore}>
                    <Text style={styles.scoreText}>
                      {task.dopamineScore}
                    </Text>
                  </View>
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
  scoreContainer: {
    gap: 8,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  scoreButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  scoreButtonText: {
    fontSize: 12,
    fontWeight: '600',
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
  taskScore: {
    alignSelf: 'flex-start',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  deleteButton: {
    padding: 16,
  },
  deleteButtonText: {
    fontSize: 18,
  },
});
