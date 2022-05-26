import React from 'react';

interface LoginFormProps {
  
}

const LoginForm: React.FC<LoginFormProps> = () => {
  return (
    <form className="form">
      <fieldset className="fieldset">
        <legend className="legend">Log In</legend>
        <label className="label">
          Login:
          <input
            type="text"
            className="input"
            aria-invalid="true"
            aria-errormessage="error-username"
          />
          <span id="error-username" className="error">
            Login is required
          </span>
        </label>
        <label className="label">
          Password:
          <input
            type="text"
            className="input"
            aria-invalid="true"
            aria-errormessage="error-password"
          />
          <span id="error-password" className="error">
            Password is required
          </span>
        </label>
        <button type="submit" className="button">
          Login
        </button>
        <div className="error">Bad username or password</div>
        <div className="success">Welcome username!</div>
      </fieldset>
    </form>
  );
};

export default LoginForm;