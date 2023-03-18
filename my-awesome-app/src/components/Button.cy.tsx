import Button from './Button';

describe('Button', () => {
  it('uses custom text for the button label', () => {
    cy.mount(<Button>Click me!</Button>);
    cy.get('button').should('contains.text', 'Click me!');
  });
});
