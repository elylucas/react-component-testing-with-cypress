import React from 'react';
import style from './InputField.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  requiredMessage: string;
  submitted?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  requiredMessage,
  submitted,
  ...props
}) => {
  return (
    <label className={style.label}>
      {label}:
      <input
        className={style.input}
        aria-invalid={submitted && !props.value}
        aria-errormessage={`error-${props.name}`}
        {...props}
      />
      <span id={`error-${props.name}`} className={style.error}>
        {requiredMessage}
      </span>
    </label>
  );
};

export default InputField;
