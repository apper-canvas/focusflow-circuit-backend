import React from 'react';
import { motion } from 'framer-motion'; // framer-motion is an existing dependency

const Button = ({ children, onClick, className, title, whileHover, whileTap, ...props }) => {
  const ButtonComponent = whileHover || whileTap ? motion.button : 'button';

  return (
    <ButtonComponent
      onClick={onClick}
      className={className}
      title={title}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </ButtonComponent>
  );
};

export default Button;