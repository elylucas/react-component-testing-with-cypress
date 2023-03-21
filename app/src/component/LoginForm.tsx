import React, { useState } from 'react';
import Button from './Button';
import InputField from './InputField';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (username && password) {
      login(username, password);
    }
  };

  const [submitted, setSubmitted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = async (username: string, password: string) => {
    const res = await fetch('/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.status === 401) {
      setErrorMessage('Bad username or password');
    }
    if (res.status === 200) {
      setIsAuthed(true);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <fieldset className="fieldset">
        <legend className="legend">Log In</legend>
        <InputField
          name="username"
          label="Username"
          requiredMessage="Username is required"
          type="text"
          submitted={submitted}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          name="password"
          label="Password"
          requiredMessage="Password is required"
          type="password"
          submitted={submitted}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button>Login</Button>
        {errorMessage && <div className="error">{errorMessage}</div>}

        {isAuthed && <div className="success">Welcome {username}!</div>}
      </fieldset>
    </form>
  );
};

export default LoginForm;
