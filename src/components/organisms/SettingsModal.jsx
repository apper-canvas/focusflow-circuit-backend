import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SettingsForm from '@/components/organisms/SettingsForm';
import Button from '@/components/atoms/Button';

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
            <Button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          {/* Content */}
          <SettingsForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleSubmit} 
            onClose={onClose} // Passed to allow Cancel button within form
          />
        </div>
      </motion.div>
    </>
  );
};

export default SettingsModal;