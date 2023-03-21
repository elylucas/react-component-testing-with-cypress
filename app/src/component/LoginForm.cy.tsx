import React from 'react';
import LoginForm from './LoginForm';

describe('<LoginForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LoginForm />);
  });

  it('form should have button with login text', () => {
    cy.mount(<LoginForm />);
    cy.get('button').contains('Login');
  });

  it('form should have username and password inputs', () => {
    cy.mount(<LoginForm />);
    cy.get('input[type=text]')
      .should('have.attr', 'name')
      .and('equal', 'username');
    cy.get('input[type=password]')
      .should('have.attr', 'name')
      .and('equal', 'password');
  });

  it('fields should show validation messages if they are blank and form is submitted', () => {
    cy.mount(<LoginForm />);
    cy.get('button').contains('Login').click();
    cy.getErrorMessageFor('Username').should('be.visible');
    cy.getErrorMessageFor('Password').should('be.visible');
  });

  it('should NOT show validation messages if inputs have value and form is submitted', () => {
    cy.mount(<LoginForm />);

    cy.getInputFor('Username').type('testuser');
    cy.getInputFor('Password').type('testpassword');
    cy.get('button').contains('Login').click();

    cy.getErrorMessageFor('Username').should('not.be.visible');
    cy.getErrorMessageFor('Password').should('not.be.visible');
  });

  it('should show invalid username and password message when credentials are invalid', () => {
    cy.intercept('POST', '/auth', {
      statusCode: 401,
    });

    cy.mount(<LoginForm />);

    cy.getInputFor('Username').type('baduser');
    cy.getInputFor('Password').type('badpassword');
    cy.get('button').contains('Login').click();

    cy.contains('Bad username or password').should('be.visible');
  });

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
});
