---
slug: /
---

# Getting Started

Welcome to the Workshop!

This workshop covers cool stuff.

To get started, clone the repo and install the dependencies:

## Clone Repo and

```bash
git clone https://github.com/elylucas/react-component-testing-with-cypress.git
```

## Install Dependencies

Go into the **app** directory and install the dependencies:

```bash
cd app
npm install
```

The Vite React app and Cypress are already installed, no need to set up anything
additional.

## Start Cypress

Run `npx cypress open` in the **app** directory.

```bash
npx cypress open
```

Select component testing and go through the setup wizard. When prompted, start
the test runner selecting the browser of your choice and select "Start component
testing".

> For more info on setting up Cypress for component testing in a React app, see
> the [guide](https://docs.cypress.io/guides/component-testing/react/overview)
> on it.

You'll see that there currently isn't any specs to run. But before we create a
spec, we need a component to test! Let's create one.

## Create LoginForm

Create **src/components/LoginForm.tsx** and copy the html out of
**assets/form.html** and convert it to JSX. You will need to update the `class`
attributes to `className` for React.

Next, copy the css from **assets/form.css** and replace the contents of
**src/App.css** with it.

Import the app css in **cypress/support/component.ts**.

Next, we need to import the custom font design wants us to use. In
**cypress/support/component-index.html** add the font import found in
**assets/font.html**.

Now the form displays like it should.

## Button Component

Create a new component at **src/components/Button.tsx** and copy the button html
over to the JSX. Create a spec file **src/components/Button.cy.tsx**.

### 1st Button test, uses custom text

Add test:

```tsx
it('uses custom text for the button label', () => {
  cy.mount(<Button>Click me!</Button>);
  cy.get('button').should('contain.text', 'Click me!');
});
```

The test currently fails because we have hard coded the text "Login" into the
component. Lets make this more customizable by showing the `children` provided
to the component instead of the text.

Add children to button and use it, update the props to inherit from
`React.ButtonHTMLAttributes<HTMLButtonElement>` and show it working

Show how the first test is rendering a button with no text. Make the children
required by adding `children: React.ReactNode` to ButtonProps

Update tests to compile

### 2nd Button test, should emit onClick event

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

Test passes

### Add Button to LoginForm

add test in **LoginForm.cy.tsx** to test existence of button:

````tsx
it('form should have button with login text', () => {
  cy.mount(<LoginForm />);
  cy.get('button').contains('Login');
});

Update **LoginForm.tsx** to include button:

```tsx
<Button>Login</Button>
````

Test now passes.

## Input Field

Create InputField component and spec files. Copy input field html from form.html
into jsx. Replace all hard coded values with props:

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
    <label className="label">
      {label}:
      <input
        type="text"
        className="input"
        aria-invalid="true"
        aria-errormessage={`error-${props.name}`}
        {...props}
      />
      <span id={`error-${props.name}`} className="error">
        {requiredMessage}
      </span>
    </label>
  );
};

export default InputField;
```

### 1st InputField Test - should show error if field if is blank and form has been submitted

Update form to take a submitted prop, and use it in JSX:

```tsx
return (
  <label className="label">
    {label}:
    <input
      type="text"
      className="input"
      aria-invalid={submitted && !props.value}
      aria-errormessage={`error-${props.name}`}
      {...props}
    />
    <span id={`error-${props.name}`} className="error">
      {requiredMessage}
    </span>
  </label>
);
```

Show test using id:

```tsx
cy.get(`#error-username`).should('contain.text', 'Username is required');
```

Show how to use just `cy.contains` but it doesn't provide context to the
element.

Would be nice to use something like: `cy.getErrorMessageFor('Username')`.

## getErrorMessageFor custom command

Add the following into **cypress/support/commands.ts**:

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      getErrorMessageFor: typeof getErrorMessageFor;
    }
  }
}

Cypress.Commands.add('getErrorMessageFor', getErrorMessageFor);

function getErrorMessageFor(label: string) {
  return cy.contains('label', label).then((label) => {
    const htmlFor = label.attr('for');
    if (htmlFor) {
      cy.get(`input#${htmlFor}`).as('input');
    } else {
      cy.wrap(label).find('input').as('input');
    }
    cy.get('@input')
      .invoke('attr', 'aria-errormessage')
      .then((value) => {
        return cy.get(`#${value}`);
      });
  });
}

export {};
```

now we can use that command.

### 2nd InputField test - should not show error

Should not show error when field has not been submitted and there is not value

Add test:

```tsx
it('should NOT show error if there is no value and form has NOT been submitted', () => {
  mount(
    <InputField
      name="username"
      label="Username"
      requiredMessage="Username is required"
      value={''}
      submitted={false}
    />
  );

  cy.getErrorMessageFor('Username').should('not.be.visible');
});
```

Show test fail

Explain how we are using aria attributes and css to show/hide error

Update aria invalid attr on input to control valid:
`aria-invalid={submitted && !props.value}`

Test passes

### 3rd InputField test

Should not show error when field has been submitted and there is value

Add test:

```tsx
it('should NOT show error if there is a value and form has been submitted', () => {
  cy.mount(
    <InputField
      name="username"
      label="Username"
      requiredMessage="Username is required"
      value={'abc123'}
      submitted={false}
    />
  );

  cy.getErrorMessageFor('Username').should('not.be.visible');
});
```

### 4th InputField Test

when input is modified, onChange should be called

Add test:

```tsx
it('when input is modified, onChange should be called', () => {
  mount(
    <InputField
      name="username"
      label="Username"
      requiredMessage="Username is required"
      value={'abc123'}
      submitted={false}
      onChange={cy.spy().as('onChangeSpy')}
    />
  );
});
```

lets add a `getInputFor` command to get inputs

add to commands:

```ts
Cypress.Commands.add('getInputFor', getInputFor);

function getInputFor(label: string) {
  return cy.contains('label', label).then((label) => {
    const htmlFor = label.attr('for');
    if (htmlFor) {
      return cy.get(`input#${htmlFor}`);
    } else {
      return cy.wrap(label).find('input');
    }
  });
}
```

update test to:

```tsx
cy.getInputFor('Username').type('abc123');

cy.get('@onChangeSpy').should((spy: any) => {
  const args = spy.getCall(0).args;
  expect(args[0].target.value).to.equal('abc123');
});
cy.getInputFor('Username').should('contain.value', 'abc123');
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

## LoginForm Tests

fields should show validation messages if they are blank and form is submitted

Add test:

```tsx
it('fields should show validation messages if they are blank and form is submitted', () => {
  cy.mount(<LoginForm />);
  cy.get('button').contains('Login').click();
  cy.getErrorMessageFor('Username').should('be.visible');
  cy.getErrorMessageFor('Password').should('be.visible');
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

  cy.getInputFor('Username').type('testuser');
  cy.getInputFor('Password').type('testpassword');
  cy.get('button').contains('Login').click();

  cy.getErrorMessageFor('Username').should('not.be.visible');
  cy.getErrorMessageFor('Password').should('not.be.visible');
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

  cy.getInputFor('Username').type('baduser');
  cy.getInputFor('Password').type('badpassword');
  cy.get('button').contains('Login').click();

  cy.contains('Bad username or password').should('be.visible');
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

When creds are valid, user should be redirected to home page

Add Test:

```tsx
it('should show welcome message when credentials are valid', () => {
  cy.intercept('POST', '/auth', {
    statusCode: 200,
  });

  cy.mount(<LoginForm />);

  cy.getInputFor('Username').type('testuser');
  cy.getInputFor('Password').type('testpassword');
  cy.get('button').contains('Login').click();

  cy.contains('Welcome testuser!').should('be.visible');
});
```

import useNavigation from react-router-dom in LoginForm.tsx and use it on
successful login:

```tsx
import { useNavigate } from 'react-router-dom';
```

```tsx
const navigate = useNavigate();

//in login
if (res.status === 200) {
  navigate('/home');
}
```

Show test fails as there is no router provider context.

Rename component.ts to component.tsx so we can use JSX in it, then update mount
method to use MemoryRouter provider in component.tsx:

```tsx
Cypress.Commands.add('mount', (jsx) => {
  return mount(<MemoryRouter>{jsx}</MemoryRouter>);
});
```

Use DI to inject useNavigate method into component via prop.

alias useNavigate to \_useNavigate

update interface:

```tsx
interface LoginFormProps {
  useNavigate?: typeof _useNavigate;
}
```

add prop:

```tsx
const LoginForm: React.FC<LoginFormProps> = ({ useNavigate = _useNavigate }) => 
```

add spy and test it was called:

```tsx
const navigateSpy = cy.spy().as('navigateSpy')

cy.mount(<LoginForm useNavigate={() => navigateSpy} />);

/// after actions


```