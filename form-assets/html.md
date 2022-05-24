Login Form:

```jsx
<form class="form">
  <fieldset class="fieldset">
    <legend class="legend">Log In</legend>
    <label class="label">
      Login:
      <input
        type="text"
        class="input"
        aria-invalid="true"
        aria-errormessage="error-username"
      />
      <span id="error-username" class="error">
        Login is required
      </span>
    </label>
    <label class="label">
      Password:
      <input
        type="text"
        class="input"
        aria-invalid="true"
        aria-errormessage="error-password"
      />
      <span id="error-password" class="error">
        Password is required
      </span>
    </label>
    <button type="submit" class="button">
      Login
    </button>
    <div class="error">Bad username or password</div>
    <div class="success">Welcome username!</div>
  </fieldset>
</form>
```