import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  return (
    <button type="submit" className="button" {...props}>
      {children}
    </button>
  );
};

export default Button;