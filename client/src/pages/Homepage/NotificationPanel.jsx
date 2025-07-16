import React, { useState, useEffect } from 'react';
import { FiBell, FiClock, FiCalendar, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import { FaBook, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../utils/api';

const NotificationPanel = ({ isOpen, onClose, darkMode }) => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dismissedReminders, setDismissedReminders] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchUpcomingReminders();
    }
  }, [isOpen]);

  const fetchUpcomingReminders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Calculate date range for next 3 days
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      // Fetch events that are due in the next 3 days
      const response = await api.get('/events', {
        params: {
          start: today.toISOString(),
          end: threeDaysFromNow.toISOString()
        }
      });
      
      if (response.data.success) {
        const events = response.data.data || [];
        const upcomingReminders = events
          .filter(event => {
            const eventDate = new Date(event.start || event.date);
            const timeDiff = eventDate - today;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            return daysDiff >= 0 && daysDiff <= 3;
          })
          .map(event => ({
            id: event._id || event.id,
            title: event.title,
            description: event.description,
            dueDate: new Date(event.start || event.date),
            category: event.category || 'general',
            priority: event.priority || 'medium',
            type: event.type || 'assignment'
          }))
          .sort((a, b) => a.dueDate - b.dueDate);
        
        setReminders(upcomingReminders);
      } else {
        setError('Failed to fetch reminders');
      }
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to load reminders');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeUntilDue = (dueDate) => {
    const now = new Date();
    const timeDiff = dueDate - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Due today';
    if (daysDiff === 1) return 'Due tomorrow';
    if (daysDiff === 2) return 'Due in 2 days';
    if (daysDiff === 3) return 'Due in 3 days';
    return `Due in ${daysDiff} days`;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return darkMode ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return darkMode ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return darkMode ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-green-600 bg-green-50 border-green-200';
      default:
        return darkMode ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'assignment':
      case 'homework':
        return <FaClipboardCheck className="w-4 h-4" />;
      case 'exam':
      case 'test':
        return <FaBook className="w-4 h-4" />;
      case 'project':
        return <FiCalendar className="w-4 h-4" />;
      default:
        return <FiBell className="w-4 h-4" />;
    }
  };

  const handleDismissReminder = (reminderId) => {
    setDismissedReminders(prev => new Set([...prev, reminderId]));
  };

  const handleMarkAsComplete = async (reminderId) => {
    try {
      // You can implement API call to mark as complete
      await api.patch(`/events/${reminderId}`, { completed: true });
      setReminders(prev => prev.filter(r => r.id !== reminderId));
    } catch (err) {
      console.error('Error marking reminder as complete:', err);
    }
  };

  const filteredReminders = reminders.filter(reminder => !dismissedReminders.has(reminder.id));

  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 top-full mt-2 w-80 max-h-96 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 overflow-hidden ${
      darkMode 
        ? "bg-slate-800/95 border-slate-700/50" 
        : "bg-white/95 border-gray-200/50"
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiBell className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Upcoming Reminders
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-slate-700/50 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Next 3 days
        </p>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading reminders...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <FiAlertCircle className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
            <button
              onClick={fetchUpcomingReminders}
              className={`mt-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                darkMode 
                  ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Retry
            </button>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="p-6 text-center">
            <FiCheck className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No upcoming reminders
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-3 rounded-xl mb-2 border transition-all duration-200 ${
                  darkMode 
                    ? 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50' 
                    : 'bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getPriorityColor(reminder.priority)}`}>
                      {getCategoryIcon(reminder.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm truncate ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {reminder.title}
                      </h4>
                      {reminder.description && (
                        <p className={`text-xs mt-1 line-clamp-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {reminder.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1">
                          <FiClock className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {getTimeUntilDue(reminder.dueDate)}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority || 'Medium'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => handleMarkAsComplete(reminder.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        darkMode 
                          ? 'hover:bg-green-500/20 text-gray-400 hover:text-green-400' 
                          : 'hover:bg-green-100 text-gray-500 hover:text-green-600'
                      }`}
                      title="Mark as complete"
                    >
                      <FiCheck className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDismissReminder(reminder.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        darkMode 
                          ? 'hover:bg-slate-600/50 text-gray-400 hover:text-white' 
                          : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                      }`}
                      title="Dismiss"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && !error && filteredReminders.length > 0 && (
        <div className={`p-3 border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
          <button
            onClick={onClose}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode 
                ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            View All Reminders
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;