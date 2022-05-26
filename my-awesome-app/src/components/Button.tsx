import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const Button: React.FC<ButtonProps> = () => {
  return (
    <div>Button</div>
  );
};

export default Button;