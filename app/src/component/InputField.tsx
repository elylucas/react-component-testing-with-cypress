import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  requiredMessage: string;
  submitted: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  requiredMessage,
  submitted,
  ...props
}) => {
  return (
    <label className="label">
      {label}:
      <input
        {...props}
        className="input"
        aria-invalid={submitted && !props.value}
        aria-errormessage={`error-${props.name}`}
      />
      <span id={`error-${props.name}`} className="error">
        {requiredMessage}
      </span>
    </label>
  );
};

export default InputField;
