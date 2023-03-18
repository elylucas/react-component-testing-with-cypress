import React, { useState } from 'react';
import Button from './Button';
import InputField from './InputField';
import style from './LoginForm.module.css';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setErrorMessage('');
    login();
  };

  const login = async () => {
    if (username && password) {
      const res = await fetch('/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 401) {
        setErrorMessage('Bad username or password');
      } else if (res.status === 200) {
        setIsLoggedIn(true)
      }
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <fieldset className={style.fieldset}>
        <legend className={style.legend}>Log In</legend>
        <InputField
          type="text"
          name="username"
          label="Username"
          requiredMessage="Username is required"
          submitted={submitted}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          type="password"
          name="password"
          label="Password"
          requiredMessage="Password is required"
          submitted={submitted}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button>Login</Button>
        {errorMessage && <div className={style.error}>{errorMessage}</div>}
        {isLoggedIn && <div className={style.success}>Welcome {username}!</div>}
      </fieldset>
    </form>
  );
};

export default LoginForm;
