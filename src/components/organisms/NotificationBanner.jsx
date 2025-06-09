import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotificationBanner = ({ message, onClose, onStartNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-4 right-4 z-50"
    >
      <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-200 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <ApperIcon name="CheckCircle" size={20} className="text-success" />
          </div>
          
          <div className="flex-1">
            <p className="text-gray-900 font-medium mb-2">{message}</p>
            
            <div className="flex gap-2">
              <Button
                onClick={onStartNext}
                className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Next
              </Button>
              
              <Button
                onClick={onClose}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dismiss
              </Button>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ApperIcon name="X" size={16} className="text-gray-400" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationBanner;