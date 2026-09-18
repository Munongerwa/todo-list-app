import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Star, CheckSquare, Tags, Settings, HelpCircle, LogOut, 
  Bell, Mail, Search, Plus, Trash2, CheckCircle2, Upload, User, X, 
  Clock, BarChart3, AlertCircle, Award, TrendingUp, CheckCheck, Trash, Volume2,
  Calendar, ChevronLeft, ChevronRight
} from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [notifiedTaskIds, setNotifiedTaskIds] = useState([]);
  const [notified10PercentIds, setNotified10PercentIds] = useState([]);
  const [notifiedAtDueIds, setNotifiedAtDueIds] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [reportPeriod, setReportPeriod] = useState('week');

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [userProfile, setUserProfile] = useState({
    name: 'Batie',
    email: 'bati@gmail.com',
    avatar: null
  });
  
  const fileInputRef = useRef(null);
  const notificationsRef = useRef(null);
  const audioContextRef = useRef(null);

  // --- LOAD DATA ---
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedProfile = localStorage.getItem('userProfile');
    const savedNotified = localStorage.getItem('notifiedTaskIds');
    const saved10Percent = localStorage.getItem('notified10PercentIds');
    const savedAtDue = localStorage.getItem('notifiedAtDueIds');
    const savedAllNotifs = localStorage.getItem('allNotifications');
    
    if (savedTodos) { try { setTodos(JSON.parse(savedTodos)); } catch (e) { console.error(e); } }
    if (savedProfile) { try { setUserProfile(JSON.parse(savedProfile)); } catch (e) { console.error(e); } }
    if (savedNotified) { try { setNotifiedTaskIds(JSON.parse(savedNotified)); } catch (e) { console.error(e); } }
    if (saved10Percent) { try { setNotified10PercentIds(JSON.parse(saved10Percent)); } catch (e) { console.error(e); } }
    if (savedAtDue) { try { setNotifiedAtDueIds(JSON.parse(savedAtDue)); } catch (e) { console.error(e); } }
    if (savedAllNotifs) { try { setAllNotifications(JSON.parse(savedAllNotifs)); } catch (e) { console.error(e); } }
    setIsLoaded(true);
  }, []);

  // --- REQUEST NOTIFICATION PERMISSION ---
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          Notification.requestPermission().then(permission => {
            setNotificationPermission(permission);
            if (permission === 'granted') {
              addNotification('Desktop notifications enabled! ', 'success');
            }
          });
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // --- SAVE DATA ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      localStorage.setItem('notifiedTaskIds', JSON.stringify(notifiedTaskIds));
      localStorage.setItem('notified10PercentIds', JSON.stringify(notified10PercentIds));
      localStorage.setItem('notifiedAtDueIds', JSON.stringify(notifiedAtDueIds));
      localStorage.setItem('allNotifications', JSON.stringify(allNotifications));
    }
  }, [todos, userProfile, notifiedTaskIds, notified10PercentIds, notifiedAtDueIds, allNotifications, isLoaded]);

  // --- ALARM SOUND ---
  const playAlarmSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const playBeep = (startTime, frequency, duration) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playBeep(now, 600, 0.3);
      playBeep(now + 0.35, 800, 0.3);
      playBeep(now + 0.7, 1000, 0.4);
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  };

  // --- BROWSER NOTIFICATION ---
  const sendBrowserNotification = (title, body, type = 'info') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
          tag: type + '-' + Date.now(),
          requireInteraction: type === 'error'
        });
      } catch (error) {
        console.error('Error sending browser notification:', error);
      }
    }
  };

  // --- NOTIFICATION SYSTEM ---
  useEffect(() => {
    const checkDueTasks = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (!todo.dueDateTime || todo.status === 'completed') return;
        const dueTime = new Date(todo.dueDateTime);
        const createdAt = todo.createdAt ? new Date(todo.createdAt) : null;
        const diffMs = dueTime - now;
        const diffMins = diffMs / (1000 * 60);

        if (createdAt && !notified10PercentIds.includes(todo.id)) {
          const totalDuration = dueTime - createdAt;
          const tenPercentDuration = totalDuration * 0.1;
          const tenPercentThreshold = dueTime - tenPercentDuration;
          if (now >= tenPercentThreshold && diffMs > 0) {
            const remainingMins = Math.round(diffMins);
            const message = `"${todo.text}" - Only 10% time remaining! (${remainingMins} min left)`;
            addNotification(message, 'warning');
            sendBrowserNotification('⏰ Task Time Running Out', `"${todo.text}" has only 10% of its time remaining. Due in ${remainingMins} minutes.`, 'warning');
            setNotified10PercentIds(prev => [...prev, todo.id]);
          }
        }

        if (!notifiedAtDueIds.includes(todo.id) && diffMs <= 0) {
          const message = `🚨 "${todo.text}" is now DUE!`;
          playAlarmSound();
          addNotification(message, 'error');
          sendBrowserNotification('🚨 Task Due Now!', `"${todo.text}" has reached its due time. Please complete it now!`, 'error');
          setNotifiedAtDueIds(prev => [...prev, todo.id]);
          setNotifiedTaskIds(prev => [...prev, todo.id]);
        }
      });
    };

    checkDueTasks();
    const interval = setInterval(checkDueTasks, 10000);
    return () => clearInterval(interval);
  }, [todos, notifiedTaskIds, notified10PercentIds, notifiedAtDueIds]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const timestamp = new Date().toISOString();
    const newNotif = { id, message, type, timestamp, read: false };
    setNotifications(prev => [...prev, newNotif]);
    setAllNotifications(prev => [newNotif, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markAllAsRead = () => setAllNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearAllNotifications = () => { setAllNotifications([]); setShowNotificationsPanel(false); };
  
  const toggleNotificationsPanel = () => {
    setShowNotificationsPanel(!showNotificationsPanel);
    if (!showNotificationsPanel) markAllAsRead();
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          addNotification('Desktop notifications enabled! 🔔', 'success');
          sendBrowserNotification('Notifications Enabled', 'You will now receive task alerts on your desktop.');
        }
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotificationsPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // --- HANDLERS ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserProfile({ ...userProfile, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUserProfile({ ...userProfile, name: formData.get('name'), email: formData.get('email') });
    addNotification('Profile updated successfully!', 'success');
  };

  const addTodo = () => {
    if (inputText.trim() === '') return;
    const newTodo = {
      id: Date.now(),
      text: inputText,
      description: taskDescription || 'No description',
      category: taskCategory,
      priority: taskPriority,
      status: 'not-started',
      dueDateTime: taskDueDate || null,
      comments: [],
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    setTodos([newTodo, ...todos]);
    setInputText(''); setTaskDescription(''); setTaskCategory('Personal'); setTaskPriority('Medium'); setTaskDueDate(''); setShowAddForm(false);
    addNotification('Task added successfully!', 'success');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setNotifiedTaskIds(prev => prev.filter(tid => tid !== id));
    setNotified10PercentIds(prev => prev.filter(tid => tid !== id));
    setNotifiedAtDueIds(prev => prev.filter(tid => tid !== id));
    addNotification('Task deleted.', 'info');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const newStatus = todo.status === 'completed' ? 'not-started' : 'completed';
        const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;
        return { ...todo, status: newStatus, completedAt };
      }
      return todo;
    }));
    addNotification('Task status updated!', 'success');
  };

  const addComment = (id, commentText) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const newComment = { text: commentText, date: new Date().toISOString() };
        return { ...todo, comments: [...(todo.comments || []), newComment] };
      }
      return todo;
    }));
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') addTodo(); };

  const getFilteredTodos = () => {
    let filtered = [...todos];
    if (filter === 'active') filtered = filtered.filter(t => t.status !== 'completed');
    else if (filter === 'completed') filtered = filtered.filter(t => t.status === 'completed');
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        (t.text || '').toLowerCase().includes(query) || 
        (t.description || '').toLowerCase().includes(query) ||
        (t.category || '').toLowerCase().includes(query)
      );
    }
    return filtered;
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(t => t.status === 'completed').length;
  const totalCount = todos.length;
  const completedPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
  const unreadCount = allNotifications.filter(n => !n.read).length;

  const getTasksForPeriod = (period) => {
    const now = new Date();
    return todos.filter(todo => {
      const created = new Date(todo.createdAt);
      if (period === 'today') return created.toDateString() === now.toDateString();
      if (period === 'week') { const oneWeekAgo = new Date(); oneWeekAgo.setDate(now.getDate() - 7); return created >= oneWeekAgo; }
      if (period === 'month') return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      return true;
    });
  };

  const reportTasks = getTasksForPeriod(reportPeriod);
  const reportCompleted = reportTasks.filter(t => t.status === 'completed').length;
  const reportPending = reportTasks.filter(t => t.status !== 'completed').length;
  const reportOverdue = reportTasks.filter(t => {
    if (!t.dueDateTime || t.status === 'completed') return false;
    return new Date(t.dueDateTime) < new Date();
  }).length;

  const getTimeTaken = (createdAt, completedAt) => {
    if (!createdAt || !completedAt) return 'N/A';
    const start = new Date(createdAt); const end = new Date(completedAt);
    const diffMs = end - start; const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return '< 1 min';
    if (diffMins < 60) return `${diffMins} mins`;
    const diffHours = Math.floor(diffMins / 60); const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // --- CALENDAR HELPERS ---
  const isSameDay = (d1, d2) => d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  
  const getTasksForDate = (date) => {
    return todos.filter(todo => {
      if (!todo.dueDateTime) return false;
      return isSameDay(new Date(todo.dueDateTime), date);
    });
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    // Padding for empty days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, date: new Date(year, month, i) });
    }
    return days;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  if (!isLoaded) return <div className="loading">Loading...</div>;

  const renderPage = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="stats-grid">
            <div className="task-cards">
              <div className="section-header">
                <h3 className="section-title">To-Do</h3>
                <button className="add-task-btn" onClick={() => setShowAddForm(!showAddForm)}>
                  {showAddForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add task</>}
                </button>
              </div>

              {showAddForm && (
                <div className="add-task-form">
                  <input type="text" placeholder="Task title *" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={handleKeyPress} className="form-input" autoFocus />
                  <textarea placeholder="Task description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className="form-textarea" rows="2" />
                  <div className="form-group">
                    <label>Due Date & Time</label>
                    <input type="datetime-local" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="form-input" />
                  </div>
                  <div className="form-row">
                    <select value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)} className="form-select">
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Health">Health</option>
                      <option value="Other">Other</option>
                    </select>
                    <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="form-select">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <button className="form-submit-btn" onClick={addTodo}><Plus size={18} /> Add Task</button>
                </div>
              )}

              <div className="search-container">
                <Search size={18} />
                <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
                {searchQuery && <button className="clear-search" onClick={() => setSearchQuery('')}><X size={16} /></button>}
              </div>

              <div className="filter-tabs">
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All ({todos.length})</button>
                <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active ({todos.filter(t => t.status !== 'completed').length})</button>
                <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed ({completedCount})</button>
              </div>
              
              <div className="cards-container">
                {filteredTodos.length === 0 ? (
                  <div className="empty-state-cards">
                    <div className="empty-icon"><CheckSquare size={64} strokeWidth={1.5} /></div>
                    <h3>No tasks found</h3>
                    <p>{searchQuery ? 'Try a different search term' : 'Click "+ Add task" to create your first task!'}</p>
                  </div>
                ) : (
                  filteredTodos.slice(0, 5).map((todo) => {
                    const isOverdue = todo.dueDateTime && new Date(todo.dueDateTime) < new Date() && todo.status !== 'completed';
                    const timeTaken = todo.status === 'completed' && todo.completedAt ? getTimeTaken(todo.createdAt, todo.completedAt) : null;
                    return (
                      <div key={todo.id} className={`task-card ${isOverdue ? 'overdue' : ''}`}>
                        <div className="task-card-content">
                          <div className="task-info">
                            <h4 className="task-card-title">{todo.text}</h4>
                            <p className="task-card-desc">{todo.description}</p>
                            <div className="task-footer">
                              <span className={`priority ${(todo.priority || 'medium').toLowerCase()}`}>{todo.priority || 'Medium'}</span>
                              <span className={`due-date-badge ${isOverdue ? 'overdue' : ''}`}>
                                {isOverdue ? <span className="flashing-alert"><AlertCircle size={12} className="flashing-icon" /> Overdue</span> : <><Clock size={12} /> {formatDate(todo.dueDateTime)}</>}
                              </span>
                            </div>
                          </div>
                        </div>
                        {todo.status === 'completed' && (
                          <div className="completed-details">
                            <span className="time-taken-badge"><CheckCircle2 size={12} /> Finished in {timeTaken}</span>
                            <div className="comments-section">
                              {(todo.comments || []).map((c, idx) => (
                                <div key={idx} className="comment-item">
                                  <span className="comment-text">{c.text}</span>
                                  <span className="comment-date">{new Date(c.date).toLocaleDateString()}</span>
                                </div>
                              ))}
                              <div className="add-comment-box">
                                <input type="text" placeholder="Add a completion note..." onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { addComment(todo.id, e.target.value.trim()); e.target.value = ''; } }} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="task-card-actions">
                          <button className={`complete-btn ${todo.status === 'completed' ? 'completed' : ''}`} onClick={() => toggleComplete(todo.id)}>
                            {todo.status === 'completed' ? <><CheckCircle2 size={16} /> Done</> : 'Mark Complete'}
                          </button>
                          <button className="delete-btn" onClick={() => deleteTodo(todo.id)}><Trash2 size={18} /></button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <div>
                  <h3 className="section-title"><Award size={20} className="award-icon" /> Overall Progress</h3>
                  <p className="progress-subtitle">Keep up the great work!</p>
                </div>
                <div className="progress-badge"><TrendingUp size={18} /><span>{Math.round(completedPercent)}%</span></div>
              </div>
              <div className="circular-progress-container">
                <div className="progress-circle large">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle gradient-circle" strokeDasharray={`${completedPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="circle-content">
                    <Award size={28} className="circle-center-icon" />
                    <span className="percentage">{Math.round(completedPercent)}%</span>
                  </div>
                </div>
              </div>
              <div className="progress-stats-row">
                <div className="progress-stat-item">
                  <div className="stat-icon green"><CheckCircle2 size={18} /></div>
                  <div className="stat-info"><span className="stat-value">{completedCount}</span><span className="stat-label">Completed</span></div>
                </div>
                <div className="progress-stat-divider"></div>
                <div className="progress-stat-item">
                  <div className="stat-icon blue"><Clock size={18} /></div>
                  <div className="stat-info"><span className="stat-value">{totalCount - completedCount}</span><span className="stat-label">Remaining</span></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'calendar':
        const calendarDays = getCalendarDays();
        const selectedDayTasks = getTasksForDate(selectedDate);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        return (
          <div className="page-content">
            <h2 className="page-title"><Calendar size={28} /> Calendar</h2>
            <p className="page-subtitle">View your tasks and events by date</p>
            
            <div className="calendar-layout">
              <div className="calendar-main">
                <div className="calendar-header">
                  <button className="cal-nav-btn" onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
                  <div className="cal-month-year">
                    <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <button className="cal-today-btn" onClick={goToToday}>Today</button>
                  </div>
                  <button className="cal-nav-btn" onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
                </div>
                
                <div className="calendar-weekdays">
                  {weekdays.map(day => <div key={day} className="weekday">{day}</div>)}
                </div>
                
                <div className="calendar-grid">
                  {calendarDays.map((dayObj, index) => {
                    if (!dayObj.date) return <div key={`empty-${index}`} className="calendar-day empty"></div>;
                    
                    const isToday = isSameDay(dayObj.date, new Date());
                    const isSelected = isSameDay(dayObj.date, selectedDate);
                    const dayTasks = getTasksForDate(dayObj.date);
                    const hasTasks = dayTasks.length > 0;
                    const hasOverdue = dayTasks.some(t => t.status !== 'completed' && new Date(t.dueDateTime) < new Date());
                    
                    return (
                      <div 
                        key={index} 
                        className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasTasks ? 'has-tasks' : ''}`}
                        onClick={() => setSelectedDate(dayObj.date)}
                      >
                        <span className="day-number">{dayObj.day}</span>
                        {hasTasks && <div className={`task-indicator ${hasOverdue ? 'overdue' : ''}`}></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="calendar-sidebar">
                <div className="selected-date-header">
                  <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                  <p>{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                
                <div className="selected-date-tasks">
                  {selectedDayTasks.length === 0 ? (
                    <div className="no-tasks-day">
                      <Calendar size={32} strokeWidth={1.5} />
                      <p>No tasks scheduled for this day</p>
                    </div>
                  ) : (
                    selectedDayTasks.map(todo => {
                      const isOverdue = todo.status !== 'completed' && new Date(todo.dueDateTime) < new Date();
                      return (
                        <div key={todo.id} className={`cal-task-item ${todo.status === 'completed' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
                          <div className={`cal-task-status ${todo.status}`}></div>
                          <div className="cal-task-info">
                            <h4>{todo.text}</h4>
                            <span className="cal-task-time">
                              <Clock size={12} /> {new Date(todo.dueDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className={`priority ${(todo.priority || 'medium').toLowerCase()}`}>{todo.priority}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        const reportCompletedPercent = reportTasks.length === 0 ? 0 : (reportCompleted / reportTasks.length) * 100;
        const reportPendingPercent = reportTasks.length === 0 ? 0 : (reportPending / reportTasks.length) * 100;
        const reportOverduePercent = reportTasks.length === 0 ? 0 : (reportOverdue / reportTasks.length) * 100;
        
        return (
          <div className="page-content">
            <h2 className="page-title"><BarChart3 size={28} /> Progress Reports</h2>
            <p className="page-subtitle">Track your productivity over time</p>
            <div className="report-controls">
              <button className={reportPeriod === 'today' ? 'active' : ''} onClick={() => setReportPeriod('today')}>Today</button>
              <button className={reportPeriod === 'week' ? 'active' : ''} onClick={() => setReportPeriod('week')}>This Week</button>
              <button className={reportPeriod === 'month' ? 'active' : ''} onClick={() => setReportPeriod('month')}>This Month</button>
            </div>
            <div className="report-stats-circles">
              <div className="circle-stat-card">
                <div className="progress-circle large">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle green" strokeDasharray={`${reportCompletedPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="circle-content"><CheckCircle2 size={24} /><span className="percentage">{Math.round(reportCompletedPercent)}%</span></div>
                </div>
                <h3>{reportCompleted}</h3><p>Completed</p>
              </div>
              <div className="circle-stat-card">
                <div className="progress-circle large">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle blue" strokeDasharray={`${reportPendingPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="circle-content"><Clock size={24} /><span className="percentage">{Math.round(reportPendingPercent)}%</span></div>
                </div>
                <h3>{reportPending}</h3><p>Pending</p>
              </div>
              <div className="circle-stat-card">
                <div className="progress-circle large">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle red" strokeDasharray={`${reportOverduePercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="circle-content"><AlertCircle size={24} /><span className="percentage">{Math.round(reportOverduePercent)}%</span></div>
                </div>
                <h3>{reportOverdue}</h3><p>Overdue</p>
              </div>
            </div>
            <div className="report-list">
              <h3>Tasks in this period ({reportTasks.length})</h3>
              {reportTasks.length === 0 ? <p className="empty-text">No tasks found for this period.</p> : (
                reportTasks.map(todo => (
                  <div key={todo.id} className="report-task-item">
                    <div className={`status-dot ${todo.status === 'completed' ? 'completed' : 'pending'}`}></div>
                    <div className="report-task-info"><h4>{todo.text}</h4><span>{formatDate(todo.dueDateTime)}</span></div>
                    <span className={`priority ${(todo.priority || 'medium').toLowerCase()}`}>{todo.priority}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'vital-task':
        return (
          <div className="page-content">
            <h2 className="page-title"><Star size={28} /> Vital Tasks</h2>
            <p className="page-subtitle">Your most important and urgent tasks</p>
            <div className="cards-container">
              {todos.filter(t => t.priority === 'High').length === 0 ? (
                <div className="empty-state-cards"><Star size={64} strokeWidth={1.5} /><h3>No vital tasks</h3><p>Create a high priority task to see it here</p></div>
              ) : (
                todos.filter(t => t.priority === 'High').map(todo => (
                  <div key={todo.id} className="task-card"><h4>{todo.text}</h4><p>{todo.description}</p><span className={`priority ${(todo.priority || 'medium').toLowerCase()}`}>{todo.priority}</span></div>
                ))
              )}
            </div>
          </div>
        );
      
      case 'my-task':
        return (
          <div className="page-content">
            <h2 className="page-title"><CheckSquare size={28} /> My Tasks</h2>
            <p className="page-subtitle">All your tasks in one place</p>
            <div className="cards-container">
              {todos.length === 0 ? (
                <div className="empty-state-cards"><CheckSquare size={64} strokeWidth={1.5} /><h3>No tasks</h3><p>You haven't created any tasks yet</p></div>
              ) : (
                todos.map(todo => (
                  <div key={todo.id} className="task-card"><h4>{todo.text}</h4><p>{todo.description}</p><div className="task-footer"><span className={`priority ${(todo.priority || 'medium').toLowerCase()}`}>{todo.priority}</span><span className="status">{todo.status}</span></div></div>
                ))
              )}
            </div>
          </div>
        );
      
      case 'task-categories':
        return (
          <div className="page-content">
            <h2 className="page-title"><Tags size={28} /> Task Categories</h2>
            <p className="page-subtitle">Organize your tasks by category</p>
            <div className="categories-grid">
              {['Personal', 'Work', 'Shopping', 'Health', 'Other'].map(category => {
                const count = todos.filter(t => t.category === category).length;
                return (<div key={category} className="category-card"><h3>{category}</h3><p className="category-count">{count} {count === 1 ? 'task' : 'tasks'}</p></div>);
              })}
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="page-content">
            <h2 className="page-title"><Settings size={28} /> Settings</h2>
            <p className="page-subtitle">Manage your profile and preferences</p>
            <div className="settings-section">
              <h3>🔔 Notifications</h3>
              <div className="notification-settings">
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <Volume2 size={20} className="setting-icon" />
                    <div><p className="setting-title">Alarm Sound</p><p className="setting-desc">Plays when a task reaches its due time</p></div>
                  </div>
                  <button className="test-sound-btn" onClick={playAlarmSound}><Volume2 size={16} /> Test Sound</button>
                </div>
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <Bell size={20} className="setting-icon" />
                    <div><p className="setting-title">Desktop Notifications</p><p className="setting-desc">Status: <span className={`permission-status ${notificationPermission}`}>{notificationPermission === 'granted' ? '✓ Enabled' : notificationPermission === 'denied' ? ' Blocked' : '⚠ Not set'}</span></p></div>
                  </div>
                  {notificationPermission !== 'granted' && <button className="enable-notif-btn" onClick={requestNotificationPermission}>Enable</button>}
                </div>
              </div>
            </div>
            <div className="settings-section">
              <h3>Profile Picture</h3>
              <div className="profile-upload">
                <div className="avatar-preview">{userProfile.avatar ? <img src={userProfile.avatar} alt="Profile" /> : <div className="avatar-placeholder"><User size={48} /></div>}</div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
                <button className="upload-btn" onClick={() => fileInputRef.current.click()}><Upload size={18} />{userProfile.avatar ? 'Change Photo' : 'Upload Photo'}</button>
                {userProfile.avatar && <button className="remove-btn" onClick={() => setUserProfile({...userProfile, avatar: null})}>Remove</button>}
              </div>
            </div>
            <div className="settings-section">
              <h3>Profile Information</h3>
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group"><label>Name</label><input type="text" name="name" defaultValue={userProfile.name} required /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" defaultValue={userProfile.email} required /></div>
                <button type="submit" className="save-btn"><CheckCircle2 size={18} />Save Changes</button>
              </form>
            </div>
          </div>
        );
      
      case 'help':
        return (
          <div className="page-content">
            <h2 className="page-title"><HelpCircle size={28} /> Help & Support</h2>
            <p className="page-subtitle">Get help with using the application</p>
            <div className="help-section">
              <div className="help-card"><h3>How to add a task?</h3><p>Click the "+ Add task" button, fill in the task details, and click "Add Task".</p></div>
              <div className="help-card"><h3>How do notifications work?</h3><p>You'll get a desktop alert when 10% of task time remains, and an alarm sound + notification when the task is due.</p></div>
              <div className="help-card"><h3>How to use the Calendar?</h3><p>Navigate months using arrows. Click any day to see tasks due on that date. Days with tasks show a colored indicator dot.</p></div>
              <div className="help-card"><h3>How to view reports?</h3><p>Go to the Reports page to see your productivity for Today, This Week, or This Month.</p></div>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="app-dashboard">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#FF8E53" />
          </linearGradient>
        </defs>
      </svg>

      <div className="toast-container">
        {notifications.map(notif => (
          <div key={notif.id} className={`toast ${notif.type}`}>
            <div className="toast-content">
              {notif.type === 'error' ? <AlertCircle size={20} /> : notif.type === 'warning' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
              <span>{notif.message}</span>
            </div>
            <button className="toast-close" onClick={() => removeNotification(notif.id)}><X size={16} /></button>
          </div>
        ))}
      </div>

      {showNotificationsPanel && (
        <div className="notifications-panel" ref={notificationsRef}>
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="notifications-actions">
              <button className="mark-read-btn" onClick={markAllAsRead}><CheckCheck size={16} /> Mark all read</button>
              <button className="clear-all-btn" onClick={clearAllNotifications}><Trash size={16} /> Clear all</button>
            </div>
          </div>
          <div className="notifications-list">
            {allNotifications.length === 0 ? (
              <div className="notifications-empty">
                <Bell size={48} strokeWidth={1.5} />
                <p>No notifications yet</p>
                <span>Task alerts will appear here</span>
              </div>
            ) : (
              allNotifications.map(notif => (
                <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                  <div className={`notification-icon ${notif.type}`}>
                    {notif.type === 'error' ? <AlertCircle size={18} /> : notif.type === 'warning' ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">{getRelativeTime(notif.timestamp)}</span>
                  </div>
                  {!notif.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo"><LayoutDashboard size={28} /> Dashboard</h2>
        </div>
        <div className="user-profile">
          <div className="avatar-container" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            {userProfile.avatar ? <img src={userProfile.avatar} alt="Profile" className="user-avatar" /> : <div className="user-avatar-placeholder"><User size={32} /></div>}
            <div className="avatar-overlay"><Upload size={16} /></div>
          </div>
          <div className="user-info"><h3>{userProfile.name}</h3><p>{userProfile.email}</p></div>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={20} />Dashboard</button>
          <button className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}><Calendar size={20} />Calendar</button>
          <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}><BarChart3 size={20} />Reports</button>
          <button className={`nav-item ${activeTab === 'vital-task' ? 'active' : ''}`} onClick={() => setActiveTab('vital-task')}><Star size={20} />Vital Task</button>
          <button className={`nav-item ${activeTab === 'my-task' ? 'active' : ''}`} onClick={() => setActiveTab('my-task')}><CheckSquare size={20} />My Task</button>
          <button className={`nav-item ${activeTab === 'task-categories' ? 'active' : ''}`} onClick={() => setActiveTab('task-categories')}><Tags size={20} />Categories</button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={20} />Settings</button>
          <button className={`nav-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}><HelpCircle size={20} />Help</button>
        </nav>
        <button className="logout-btn"><LogOut size={20} />Logout</button>
      </div>

      <div className="main-content">
        <div className="top-header">
          <div className="search-bar-main">
            <Search size={20} />
            <input type="text" placeholder="Search your task here..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && <button className="clear-search-btn" onClick={() => setSearchQuery('')}><X size={16} /></button>}
          </div>
          <div className="header-actions">
            <button className={`icon-btn notification-btn ${unreadCount > 0 ? 'has-notifications' : ''}`} onClick={toggleNotificationsPanel}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            <button className="icon-btn"><Mail size={20} /></button>
            <div className="date-display">
              <span className="day">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
              <span className="full-date">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {userProfile.name.split(' ')[0]} 👋</h1>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;