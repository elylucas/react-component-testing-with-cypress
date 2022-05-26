import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  
}

const InputField: React.FC<InputFieldProps> = () => {
  return (
    <div>InputField</div>
  );
};

export default InputField;