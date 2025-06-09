import React from 'react';

const Input = ({ type = 'text', value, onChange, className, min, max, checked, ...props }) => {
  const isCheckbox = type === 'checkbox';
  const handleChange = (e) => {
    onChange(isCheckbox ? e.target.checked : e.target.value);
  };

  return (
    <input
      type={type}
      value={isCheckbox ? undefined : value}
      checked={isCheckbox ? checked : undefined}
      onChange={handleChange}
      className={className}
      min={min}
      max={max}
      {...props}
    />
  );
};

export default Input;