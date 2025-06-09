import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const SettingsModal = ({ settings, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    workDuration: settings.workDuration,
    shortBreakDuration: settings.shortBreakDuration,
    longBreakDuration: settings.longBreakDuration,
    autoStartBreaks: settings.autoStartBreaks,
    autoStartPomodoros: settings.autoStartPomodoros,
    soundEnabled: settings.soundEnabled,
    soundType: settings.soundType,
    soundVolume: settings.soundVolume
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Timer Durations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timer Durations
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Session (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.workDuration}
                    onChange={(e) => handleInputChange('workDuration', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.shortBreakDuration}
                    onChange={(e) => handleInputChange('shortBreakDuration', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.longBreakDuration}
                    onChange={(e) => handleInputChange('longBreakDuration', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Auto-start Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Auto-start Options
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.autoStartBreaks}
                    onChange={(e) => handleInputChange('autoStartBreaks', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">
                    Auto-start breaks after work sessions
                  </span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.autoStartPomodoros}
                    onChange={(e) => handleInputChange('autoStartPomodoros', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">
                    Auto-start work sessions after breaks
                  </span>
                </label>
              </div>
            </div>
            
            {/* Sound Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.soundEnabled}
                    onChange={(e) => handleInputChange('soundEnabled', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">
                    Play notification sound when sessions complete
                  </span>
                </label>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsModal;