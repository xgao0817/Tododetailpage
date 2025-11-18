import React, { useState } from 'react';
import { TodoHeader } from './components/todo/TodoHeader';
import { StatsOverview } from './components/todo/StatsOverview';
import { TodoTableNew } from './components/todo/TodoTableNew';
import { Toast } from './components/todo/Toast';
import { AddTodoModal } from './components/todo/AddTodoModal';
import { MentorChatPanelV2 } from './components/todo/MentorChatPanelV2';
import { SmartPostOverlay } from './components/todo/SmartPostOverlay';
import { ReviewPostDrawer } from './components/todo/ReviewPostDrawer';
import { LinkageDrawer } from './components/todo/LinkageDrawer';

export interface Todo {
  id: string;
  completed: boolean;
  task: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  tags: string[];
  posts: number;
  streak: number;
  lastCompletedDate?: string; // Track when it was last completed
  linkages?: {
    moment?: string;
    project?: string;
    milestone?: string;
  };
}

const initialTodos: Todo[] = [
  {
    id: '1',
    completed: true,
    task: 'Research color theory basics',
    description: 'Study warm vs cool colors, complementary schemes',
    dueDate: '2025-10-14',
    priority: 'High',
    recurrence: 'none',
    tags: ['Research', 'Theory'],
    posts: 2,
    streak: 0,
    linkages: {
      moment: 'Color theory insights',
      project: 'Design System V2',
    },
  },
  {
    id: '2',
    completed: true,
    task: 'Create color wheel exercise',
    description: 'Take photos and make notes',
    dueDate: '2025-10-17',
    priority: 'Medium',
    recurrence: 'none',
    tags: ['Practice', 'Exercise'],
    posts: 0,
    streak: 0,
    linkages: {
      project: 'Design System V2',
    },
  },
  {
    id: '3',
    completed: true,
    task: 'Practice mixing earth tones',
    description: 'Focus on beige, ochre, umber variations',
    dueDate: '2025-10-19',
    priority: 'Medium',
    recurrence: 'none',
    tags: ['Practice', 'Color'],
    posts: 1,
    streak: 0,
  },
  {
    id: '4',
    completed: false,
    task: 'Complete design system documentation',
    description: 'Write comprehensive guide for Glacier Blue theme',
    dueDate: '2025-11-15',
    priority: 'High',
    recurrence: 'none',
    tags: ['Design', 'Docs'],
    posts: 3,
    streak: 0,
    linkages: {
      project: 'Design System V2',
      milestone: 'Q4 Launch',
    },
  },
  {
    id: '5',
    completed: false,
    task: 'Daily standup meeting',
    description: 'Quick sync with team on progress and blockers',
    dueDate: '2025-11-14',
    priority: 'High',
    recurrence: 'daily',
    tags: ['Meeting', 'Team'],
    posts: 15,
    streak: 18,
    linkages: {
      moment: 'Team sync notes',
    },
  },
  {
    id: '6',
    completed: false,
    task: 'Weekly sprint review',
    description: 'Demo completed features and gather feedback',
    dueDate: '2025-11-15',
    priority: 'Medium',
    recurrence: 'weekly',
    tags: ['Meeting', 'Review'],
    posts: 8,
    streak: 6,
    linkages: {
      project: 'Product Development',
      milestone: 'Sprint 12',
    },
  },
  {
    id: '7',
    completed: false,
    task: 'Monthly performance report',
    description: 'Compile metrics and create executive summary',
    dueDate: '2025-11-30',
    priority: 'High',
    recurrence: 'monthly',
    tags: ['Report', 'Analytics'],
    posts: 3,
    streak: 2,
    linkages: {
      moment: 'NVDA price dip',
      project: 'NVDA Deep Research',
    },
  },
  {
    id: '8',
    completed: false,
    task: 'Update API endpoints',
    description: 'Refactor authentication flow',
    dueDate: '2025-11-10',
    priority: 'High',
    recurrence: 'none',
    tags: ['Backend', 'API'],
    posts: 5,
    streak: 0,
    linkages: {
      project: 'Backend Refactor',
      milestone: 'API v2.0',
    },
  },
  {
    id: '9',
    completed: false,
    task: 'Optimize performance metrics',
    description: 'Reduce bundle size and improve load times',
    dueDate: '2025-11-18',
    priority: 'Low',
    recurrence: 'none',
    tags: ['Performance'],
    posts: 2,
    streak: 0,
  },
];

export type SortOption = 'task' | 'dueDate' | 'priority' | 'recurrence' | 'default';
export type SortOrder = 'asc' | 'desc';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);
  const [addTodoModalOpen, setAddTodoModalOpen] = useState(false);
  const [customOrder, setCustomOrder] = useState<string[]>([]);
  
  // New panel states
  const [smartPostPanelOpen, setSmartPostPanelOpen] = useState(false);
  const [currentSmartPostTodoId, setCurrentSmartPostTodoId] = useState<string | null>(null);
  const [mentorChatOpen, setMentorChatOpen] = useState(false);
  const [mentorChatMode, setMentorChatMode] = useState<'task-lens' | 'writing-partner'>('task-lens');
  const [currentTaskTitle, setCurrentTaskTitle] = useState('');
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [currentReviewTodoId, setCurrentReviewTodoId] = useState<string | null>(null);
  const [linkageDrawerOpen, setLinkageDrawerOpen] = useState(false);
  const [linkageDrawerType, setLinkageDrawerType] = useState<'moment' | 'project'>('moment');
  const [linkageDrawerTitle, setLinkageDrawerTitle] = useState('');
  
  // Panel width states
  const [smartPostWidth, setSmartPostWidth] = useState(600);
  const [mentorChatWidth, setMentorChatWidth] = useState(420);
  const [smartPostCollapsed, setSmartPostCollapsed] = useState(false);
  const [mentorChatCollapsed, setMentorChatCollapsed] = useState(false);

  const showToastMessage = (message: string, action?: { label: string; onClick: () => void }) => {
    setToastMessage(message);
    setToastAction(action || null);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastAction(null);
    }, 5000);
  };

  const onUpdateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const updatedTodo = { ...todo, ...updates };
        
        // Handle recurrent task completion
        if ('completed' in updates) {
          const wasCompleted = todo.completed;
          const nowCompleted = updates.completed;
          
          // Prevent recompleting if already done today
          if (!wasCompleted && nowCompleted && todo.recurrence !== 'none') {
            const today = new Date().toISOString().split('T')[0];
            
            // Check if already completed today
            if (todo.lastCompletedDate === today) {
              showToastMessage('⏰ You\'ve already completed this task today! Come back tomorrow.');
              return todo; // Return unchanged
            }
            
            // Mark as completed with today's date
            const currentDate = new Date(todo.dueDate);
            let nextDate = new Date(currentDate);
            
            switch (todo.recurrence) {
              case 'daily':
                nextDate.setDate(currentDate.getDate() + 1);
                break;
              case 'weekly':
                nextDate.setDate(currentDate.getDate() + 7);
                break;
              case 'monthly':
                nextDate.setMonth(currentDate.getMonth() + 1);
                break;
            }
            
            updatedTodo.dueDate = nextDate.toISOString().split('T')[0];
            updatedTodo.completed = false;
            updatedTodo.streak = todo.streak + 1;
            updatedTodo.lastCompletedDate = today;
            
            const newStreak = updatedTodo.streak;
            const streakEmoji = newStreak >= 10 ? '🔥' : newStreak >= 5 ? '⚡' : '✨';
            showToastMessage(`${streakEmoji} Streak ${newStreak}! \"${todo.task}\" completed and rescheduled to ${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
            return updatedTodo;
          }
          
          // Regular task completion
          if (todo.posts > 0) {
            showToastMessage('🎉 Awesome! You completed this task and attached evidence. Keep up the great work!');
          } else {
            showToastMessage(
              '✨ Nice work! Task completed! Want to capture this moment?',
              {
                label: 'Add Post',
                onClick: () => openUploadModal(id)
              }
            );
          }
        }
        
        return updatedTodo;
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addTodo = () => {
    setAddTodoModalOpen(true);
  };

  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'completed' | 'posts' | 'streak'>) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      completed: false,
      posts: 0,
      streak: 0,
      ...todoData,
    };
    setTodos([newTodo, ...todos]);
  };

  const clearCompleted = () => {
    if (window.confirm('Delete all completed tasks?')) {
      setTodos(todos.filter(todo => !todo.completed));
    }
  };

  // Calculate stats
  const totalTasks = todos.length;
  const notStarted = todos.filter(t => !t.completed).length;
  const done = todos.filter(t => t.completed).length;
  const totalPosts = todos.reduce((sum, t) => sum + t.posts, 0);

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'All' || todo.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Sort function
  const sortTodos = (todosToSort: Todo[]) => {
    // If custom order exists and no filters/sorts are active, use it
    if (customOrder.length > 0 && sortBy === 'default' && searchQuery === '' && priorityFilter === 'All') {
      const orderedTodos: Todo[] = [];
      const remaining: Todo[] = [];
      
      // First, add todos in custom order
      customOrder.forEach(id => {
        const todo = todosToSort.find(t => t.id === id);
        if (todo) orderedTodos.push(todo);
      });
      
      // Then add any new todos not in custom order
      todosToSort.forEach(todo => {
        if (!customOrder.includes(todo.id)) {
          remaining.push(todo);
        }
      });
      
      return [...orderedTodos, ...remaining];
    }
    
    // Otherwise use regular sorting
    const sorted = [...todosToSort];
    const uncompleted = sorted.filter(t => !t.completed);
    const completed = sorted.filter(t => t.completed);
    
    const sortFn = (a: Todo, b: Todo) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'task':
          comparison = a.task.localeCompare(b.task);
          break;
        case 'priority':
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'recurrence':
          const recurrenceOrder = { 'none': 0, 'daily': 1, 'weekly': 2, 'monthly': 3 };
          comparison = recurrenceOrder[a.recurrence] - recurrenceOrder[b.recurrence];
          break;
        default:
          const prioOrder = { High: 0, Medium: 1, Low: 2 };
          comparison = prioOrder[a.priority] - prioOrder[b.priority];
          if (comparison === 0) {
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    };
    
    return [...uncompleted.sort(sortFn), ...completed];
  };

  const sortedTodos = sortTodos(filteredTodos);

  const toggleSort = (column: SortOption) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleToggleSort = (column: SortOption) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const moveTodo = (dragIndex: number, hoverIndex: number) => {
    const dragTodo = sortedTodos[dragIndex];
    const newOrder = [...sortedTodos];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, dragTodo);
    
    // Update custom order with IDs
    setCustomOrder(newOrder.map(t => t.id));
  };

  return (
    <div 
      className="h-screen flex flex-col overflow-hidden"
      style={{ 
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Main Todo Interface */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-8 py-6">
          <TodoHeader 
            completedTasks={done}
            onAddTodo={addTodo}
            onClearCompleted={clearCompleted}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Stats */}
        <div className="flex-shrink-0 px-8 py-4">
          <StatsOverview
            total={totalTasks}
            notStarted={notStarted}
            done={done}
            posts={totalPosts}
          />
        </div>

        {/* Todo Table */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <TodoTableNew
            todos={sortedTodos}
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={deleteTodo}
            searchQuery={searchQuery}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onToggleSort={handleToggleSort}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onOpenSmartPost={(id) => {
              const todo = todos.find(t => t.id === id);
              if (todo) {
                setCurrentSmartPostTodoId(id);
                setCurrentTaskTitle(todo.task);
                setSmartPostPanelOpen(true);
              }
            }}
            onOpenReviewDrawer={(id) => {
              setCurrentReviewTodoId(id);
              setReviewDrawerOpen(true);
            }}
            onOpenTaskUnderstanding={(id, taskTitle) => {
              setCurrentTaskTitle(taskTitle);
              setMentorChatMode('task-lens');
              setMentorChatOpen(true);
            }}
            onOpenLinkageDrawer={(type, title) => {
              setLinkageDrawerType(type);
              setLinkageDrawerTitle(title);
              setLinkageDrawerOpen(true);
            }}
          />
        </div>
      </div>

      {/* Smart Post Overlay - Full Screen with dual panels */}
      {smartPostPanelOpen && (
        <SmartPostOverlay
          onClose={() => setSmartPostPanelOpen(false)}
          todoTitle={currentTaskTitle}
        />
      )}

      {/* Standalone Mentor Chat - Full Height Right Panel */}
      {mentorChatOpen && !smartPostPanelOpen && (
        <div
          className="fixed top-0 right-0 h-full z-50"
          style={{
            width: '500px',
            borderLeft: '1px solid rgba(227, 242, 250, 0.6)',
            boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.08)',
          }}
        >
          <MentorChatPanelV2
            onClose={() => setMentorChatOpen(false)}
            mode={mentorChatMode}
            taskTitle={currentTaskTitle}
            isSmartPostOpen={false}
            isFullHeight={true}
          />
        </div>
      )}

      <Toast 
        message={toastMessage} 
        show={showToast}
        action={toastAction}
      />

      {addTodoModalOpen && (
        <AddTodoModal
          onClose={() => setAddTodoModalOpen(false)}
          onAddTodo={handleAddTodo}
        />
      )}
      
      {/* Review Post Drawer */}
      {reviewDrawerOpen && currentReviewTodoId && (
        <ReviewPostDrawer
          onClose={() => setReviewDrawerOpen(false)}
          todoTitle={todos.find(t => t.id === currentReviewTodoId)?.task || ''}
          posts={[]}
        />
      )}
      
      {/* Linkage Drawer */}
      {linkageDrawerOpen && (
        <LinkageDrawer
          onClose={() => setLinkageDrawerOpen(false)}
          linkageType={linkageDrawerType}
          linkageTitle={linkageDrawerTitle}
        />
      )}
    </div>
  );
}