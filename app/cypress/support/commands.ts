/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      getErrorMessageFor: typeof getErrorMessageFor;
      getInputFor: typeof getInputFor;
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
    return cy
      .get('@input')
      .invoke('attr', 'aria-errormessage')
      .then((value) => {
        return cy.get(`#${value}`);
      });
  });
}

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

export {};
