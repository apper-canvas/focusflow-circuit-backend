import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, type, value, onChange, min, max, checked, className, labelClassName, inputClassName, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s/g, '-') : undefined);
  const isCheckbox = type === 'checkbox';

  if (isCheckbox) {
    return (
      <label className={`flex items-center gap-3 ${className}`}>
        <Input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary ${inputClassName}`}
          {...props}
        />
        <span className={`text-sm text-gray-700 ${labelClassName}`}>
          {label}
        </span>
      </label>
    );
  }

  return (
    <div>
      <label htmlFor={inputId} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
        {label}
      </label>
      <Input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${inputClassName}`}
        {...props}
      />
    </div>
  );
};

export default FormField;