# CT Enablement

## Start

Working dir:
/Users/elylucas/projects/cypresstestapps/cypress-talks/ct-enablement/my-awesome-app
Branch: create new work branch

## Installing/Configuring Cypress

Install: npm install
https://cdn.cypress.io/beta/npm/10.0.0/darwin-x64/10.0-release-87f1ed8d5e580e57865f2d708b1ca00149edab2d/cypress.tgz

Start cypress `npx cypress open`

Go through config wizard

Talking Points: mention framework support, how its in beta, show off new UI

## LoginForm

Before creating a spec, create `components/LoginForm.tsx` with a simple Test
div.

Create spec with UI, show red squigglies and how to add "cypress" to includes in
tsconfig to get rid of them. Mention that in libs that include Jest the types
for 'describe' and 'it' might be wrong and point to docs.

Import the html and convert to React.

Update the test to mount <LoginForm>, show how it doesn’t load css

Paste in global config to index.css and import support/component.ts. Import font
in index.html.

Show how font is still off, import font in component-index.html

Configure a viewPortWidth of 700 and show how browser reloads from config
change.

## Button

- Button requirements:
  - Displays custom text
  - When clicked calls an click method

Create Button.tsx and **cut** and paste in button from LoginForm

Create spec and mount button, show it works.

### Button CSS

Componitize the css using css modules, copy button css to Button.module.css and
update Button to use it

```tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {}

const Button: React.FC<ButtonProps> = () => {
  return (
    <button type="submit" className={styles.button}>
      Login
    </button>
  );
};

export default Button;
```

### 1st Button test, uses custom text

Add test:

```tsx
it('uses custom text for the button label', () => {
  cy.mount(<Button>Click me!</Button>);
  cy.get('button').contains('Click me!');
});
```

Show test fail

Add children to button and use it, update the props to inherit from
`React.ButtonHTMLAttributes<HTMLButtonElement>` and show it working

Show how the first test is rendering a button with no text. Make the children
required by adding `children: React.ReactNode` to ButtonProps

Update tests to compile

### Button should emit an onClick event

add a test using a spy to spy on onClick:

```jsx
it('when button is clicked, onClick should be called', () => {
  const onClickSpy = cy.spy().as('onClickSpy');
  cy.mount(<Button onClick={onClickSpy}>Click me!</Button>);
  cy.get('button').click();
  cy.get('@onClickSpy').should('have.been.called');
});
```

Show test fails

Spread props out on button.

Show Test passes

### Add Button to LoginForm

add test in LoginForm to test existence of button:

```tsx
it('form should have button with login text', () => {
  cy.mount(<LoginForm />);
  cy.get('button').contains('Login');
});
```

Add `<Button />` to form and show test passing

## InputField

- Requirements
- Shows a required message only when the form is submitted and there is no value

### Make InputField.tsx and first spec

Make Inputfield.tsx, **cut** login field out and put it in file, replace all
text pieces with props

```tsx
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  requiredMessage: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  requiredMessage,
  ...props
}) => {
  return (
    <div className="inputField">
      <label className="label">
        {label}:
        <input
          type="text"
          {...props}
          aria-invalid="true"
          aria-errormessage={`error-${props.name}`}
        />
        <span id={`error-${props.name}`} className="error">
          {requiredMessage}
        </span>
      </label>
    </div>
  );
};

export default InputField;
```

Create spec, mount it, and show

Show how to wrap the mount in a function and add a container to it:

```tsx
function mount(InputField: JSX.Element) {
  cy.viewport(400, 150);
  cy.mount(<div style={{ padding: 10 }}>{InputField}</div>);
}
```

### 1st InputField test, required login message

Implement required login. First, make a test:

```tsx
it('should show error if field if is blank and form has been submitted', () => {
  mount(
    <InputField
      name="name"
      label="Name"
      requiredMessage="Name is required"
      value={''}
      submitted={true}
    />
  );

  cy.get('.error').should('be.visible');
});
```

Add submitted prop to InputField, use it in markup, update test, show it in
runner

### Modularize CSS and show selector best practice

OOPS, forgot to import module css, do it.

Test now fails because .error class is renamed by module css, explain why

Fix selector `cy.contains('span', 'Name is required').should('be.visible')`

### 2nd InputField test,

Should not show error when field has not been submitted and there is not value

Add test:

```tsx
it('should NOT show error if there is no value and form has NOT been submitted', () => {
  mount(
    <InputField
      name="name"
      label="Name"
      requiredMessage="Name is required"
      value={''}
      submitted={false}
    />
  );

  cy.contains('Name is required').should('not.be.visible');
});
```

Show test fail

Explain how we are using aria attributes and css to show/hide error

Update aria invalid attr on input to control valid:
`aria-invalid={submitted && !props.value}`

Show test still fails, but why?

Use debug tools to see that the span contain error is still there, but its not
visible

Explain nuance in how `contains` works. Update test to specify tag in contains:
`cy.contains('span', 'Name is required').should('not.be.visible');`

Test passes

### 3rd InputField test

Should not show error when field has been submitted and there is value

Add test:

```tsx
it('should NOT show error if there is a value and form has been submitted', () => {
  mount(
    <InputField
      name="name"
      label="Name"
      requiredMessage="Name is required"
      value={'abc123'}
      submitted={false}
    />
  );

  cy.contains('span', 'Name is required').should('not.be.visible');
});
```

### 4th InputField Test

when input is modified, onChange should be called

Add test:

```tsx
it('when input is modified, onChange should be called', () => {
  mount(
    <InputField
      name="name"
      label="Name"
      requiredMessage="Name is required"
      value={'abc123'}
      submitted={false}
      onChange={cy.spy().as('onChangeSpy')}
    />
  );

  cy.get('input').type('abc123');

  cy.get('@onClickSpy').should((spy: any) => {
    const args = spy.getCall(0).args;
    expect(args[0].target.value).to.equal('abc123');
  });
  cy.get('input').and('contain.value', 'abc123');
});
```

Explain how passing an object to have been called does a shallow compare.

Show test fail.

Spread props across input field, and take away type:

```tsx
<input
  className={styles.input}
  aria-invalid={submitted && !props.value}
  aria-errormessage={`error-${props.name}`}
  {...props}
/>
```

### Add Inputfields to LoginForm

Remove input html from LoginForm, and add tests to show their existence:

```tsx LoginForm.cy.tsx
it('form should have username and password inputs', () => {
  cy.mount(<LoginForm />);
  cy.get('input[type=text]')
    .should('have.attr', 'name')
    .and('equal', 'username');
  cy.get('input[type=password]')
    .should('have.attr', 'name')
    .and('equal', 'password');
});
```

Add input fields to LoginForm

```tsx
<>
  <InputField
    name="username"
    label="Username"
    requiredMessage="Username is required"
    type="text"
    submitted={false}
  />
  <InputField
    name="password"
    label="Password"
    requiredMessage="Password is required"
    type="password"
    submitted={false}
  />
</>
```

show tests pass.

## LoginForm Logic

- Requirements
- Fields should show validation message if fields are blank and form is
  submitted
- Form should not submit if its invalid
- Should show bad username or password field for invalid credentials
- Should show Welcome message for valid credentials

### Move LoginForm css to module

you know the drill, do it

### 1st LoginForm test

fields should show validation messages if they are blank and form is submitted

Add test:

```tsx
it('fields should show validation messages if they are blank and form is submitted', () => {
  cy.mount(<LoginForm />);
  cy.get('button').contains('Login').click();
  cy.get('span').contains('Username is required').should('be.visible');
  cy.get('span').contains('Password is required').should('be.visible');
});
```

Form goes crazy over form submit, so add handleSubmit method:

```tsx
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
};
```

Test now fails.

Add submitted state to form and update it to true on handleSubmit:

```tsx
const [submitted, setSubmitted] = useState(false);

<InputField
  type="text"
  label="Username"
  name="username"
  submitted={submitted}
  requiredMessage="Username is required"
  value={''}
/>;
// same for password

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  setSubmitted(true);
};
```

Test now passes

### 2nd LoginForm test

Should not show validation errors when inputs have value and form is submitted

Add test:

```tsx
it('should NOT show validation messages if inputs have value and form is submitted', () => {
  cy.mount(<LoginForm />);

  cy.contains('Username').find('input').type('testuser');
  cy.contains('Password').find('input').type('testpassword');
  cy.get('button').contains('Login').click();

  cy.contains('span', 'Username is required').should('not.be.visible');
  cy.contains('span', 'Password is required').should('not.be.visible');
});
```

Test fails, because controlled inputs are not being modified.

Add username, password state fields and update inputs to use them:

```tsx
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

<InputField
  name="username"
  label="Username"
  requiredMessage="Username is required"
  type="text"
  submitted={submitted}
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>;
//same for password
```

### 3rd Login Form test

Invalid username/password error should show when credentials are invalid

Add test:

```tsx
it('should show invalid username and password message when credentials are invalid', () => {
  cy.mount(<LoginForm />);

  cy.contains('Username').find('input').type('baduser');
  cy.contains('Password').find('input').type('badpassword');
  cy.get('button').contains('Login').click();

  cy.contains('div', 'Bad username or password').should('be.visible');
});
```

Show test fail.

Add login method, errorMessageState, call login from handleSubmit:

```tsx
const [errorMessage, setErrorMessage] = useState('');

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  setSubmitted(true);
  setErrorMessage('');
  if (username && password) {
    login(username, password);
  }
};

const login = async (username: string, password: string) => {
  const res = await fetch('/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (res.status === 401) {
    setErrorMessage('Bad username or password');
  }
};

{
  errorMessage && <div className={styles.error}>{errorMessage}</div>;
}
```

Test still fails, we need to intercept in test:

```tsx
// after mount:
cy.intercept('POST', '/auth', {
  statusCode: 401,
});
```

### 4th Login Form test

Welcome message should show when credentials are valid

Add Test:

```tsx
it('should show welcome message when credentials are valid', () => {
  cy.mount(<LoginForm />);
  cy.intercept('POST', '/auth', {
    statusCode: 200,
  });

  cy.contains('Username').find('input').type('testuser');
  cy.contains('Password').find('input').type('testpassword');
  cy.get('button').contains('Login').click();

  cy.contains('div', 'Welcome testuser!').should('be.visible');
});
```

Add isAuthed state, update login to handle 201:

```tsx
const [isAuthed, setIsAuthed] = useState(false);

//handlesubmit under setErrorMessage
setIsAuthed(false);

//in login
if (res.status === 200) {
  setIsAuthed(true);
}

//in jsx
{
  isAuthed && <div className={styles.success}>Welcome {username}!</div>;
}
```

Show test pass

### Adding intercept to beforeEach

Show how other test that passes is getting a 404 to /auth post

Remove intercept from tests, and add it to beforeEach:

```tsx
beforeEach(() => {
  cy.intercept('POST', '/auth', (req) => {
    if (
      req.body.username === 'testuser' &&
      req.body.password === 'testpassword'
    ) {
      req.reply({ statusCode: 200 });
    } else {
      req.reply({ statusCode: 401 });
    }
  });
});
```

## Done!
