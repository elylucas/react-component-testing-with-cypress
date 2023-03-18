import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('should mount', () => {
    cy.mount(<LoginForm />);
  });

  it('form should have button with login text', () => {
    cy.mount(<LoginForm />);
    cy.contains('button', 'Login').should('exist');
  });

  it('fields should show validation messages if they are blank and form is submitted', () => {
    cy.mount(<LoginForm />);
    cy.contains('button', 'Login').click();
    cy.contains('span', 'Username is required').should('be.visible');
    cy.contains('span', 'Password is required').should('be.visible');
  });

  it('fields should NOT show validation messages if they have value and form is submitted', () => {
    cy.mount(<LoginForm />);
    cy.contains('label', 'Username').find('input').type('testuser');
    cy.contains('label', 'Password').find('input').type('password');
    cy.contains('button', 'Login').click();
    cy.contains('span', 'Username is required').should('not.be.visible');
    cy.contains('span', 'Password is required').should('not.be.visible');
  });

  it('should show invalid username and password message when creds are invalid', () => {
    cy.intercept('POST', '/auth', {
      statusCode: 401,
    });
    cy.mount(<LoginForm />);
    cy.contains('label', 'Username').find('input').type('baduser');
    cy.contains('label', 'Password').find('input').type('badpassword');
    cy.contains('button', 'Login').click();
    cy.contains('div', 'Bad username or password').should('be.visible');
  });

  it('should show welcome message when creds are valid', () => {
    cy.intercept('POST', '/auth', {
      statusCode: 200,
    });
    cy.mount(<LoginForm />);
    cy.contains('label', 'Username').find('input').type('gooduser');
    cy.contains('label', 'Password').find('input').type('goodpassword');
    cy.contains('button', 'Login').click();
    cy.contains('div', 'Welcome gooduser!').should('be.visible');
  });
});
