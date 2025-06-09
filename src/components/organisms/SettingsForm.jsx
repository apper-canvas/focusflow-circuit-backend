import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const SettingsForm = ({ formData, handleInputChange, handleSubmit, onClose }) => {
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Timer Durations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Timer Durations
        </h3>
        <div className="space-y-4">
          <FormField
            label="Work Session (minutes)"
            type="number"
            min="1"
            max="120"
            value={formData.workDuration}
            onChange={(val) => handleInputChange('workDuration', parseInt(val))}
          />
          
          <FormField
            label="Short Break (minutes)"
            type="number"
            min="1"
            max="30"
            value={formData.shortBreakDuration}
            onChange={(val) => handleInputChange('shortBreakDuration', parseInt(val))}
          />
          
          <FormField
            label="Long Break (minutes)"
            type="number"
            min="1"
            max="60"
            value={formData.longBreakDuration}
            onChange={(val) => handleInputChange('longBreakDuration', parseInt(val))}
          />
        </div>
      </div>
      
      {/* Auto-start Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Auto-start Options
        </h3>
        <div className="space-y-3">
          <FormField
            label="Auto-start breaks after work sessions"
            type="checkbox"
            checked={formData.autoStartBreaks}
            onChange={(val) => handleInputChange('autoStartBreaks', val)}
          />
          
          <FormField
            label="Auto-start work sessions after breaks"
            type="checkbox"
            checked={formData.autoStartPomodoros}
            onChange={(val) => handleInputChange('autoStartPomodoros', val)}
          />
        </div>
      </div>
      
      {/* Sound Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notifications
        </h3>
        <div className="space-y-3">
          <FormField
            label="Play notification sound when sessions complete"
            type="checkbox"
            checked={formData.soundEnabled}
            onChange={(val) => handleInputChange('soundEnabled', val)}
          />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;