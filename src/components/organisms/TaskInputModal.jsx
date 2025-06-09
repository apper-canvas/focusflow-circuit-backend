import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const TaskInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [taskLabel, setTaskLabel] = useState('');
  const [error, setError] = useState('');
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTaskLabel('');
      setError('');
    }
  }, [isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const trimmedLabel = taskLabel.trim();
    if (!trimmedLabel) {
      setError('Task name is required');
      return;
    }
    
    if (trimmedLabel.length > 100) {
      setError('Task name must be 100 characters or less');
      return;
    }
    
    onSubmit(trimmedLabel);
    onClose();
  };
  
  const handleInputChange = (e) => {
    setTaskLabel(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full glass"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ApperIcon name="Target" size={20} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Name Your Session
                </h2>
              </div>
              
              <Button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-surface-500" />
              </Button>
            </div>
            
            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <FormField
                  label="Task Name"
                  value={taskLabel}
                  onChange={handleInputChange}
                  placeholder="e.g., Review presentation slides"
                  error={error}
                  autoFocus
                  maxLength={100}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-surface-500">
                    What will you be working on during this session?
                  </p>
                  <span className="text-xs text-surface-400">
                    {taskLabel.length}/100
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  disabled={!taskLabel.trim()}
                >
                  <ApperIcon name="Play" size={16} />
                  Start Session
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskInputModal;