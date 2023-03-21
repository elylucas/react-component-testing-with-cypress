import Button from './Button';

describe('Button', () => {
  it('mounts', () => {
    cy.mount(<Button />);
  });

  it('uses custom text for the button label', () => {
    cy.mount(<Button>Click me!</Button>);
    cy.get('button').should('contain.text', 'Click me!');
  });

  it('when button is clicked, onClick should be called', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    cy.mount(<Button onClick={onClickSpy}>Click me!</Button>);
    cy.get('button').click();
    cy.get('@onClickSpy').should('have.been.called');
  });
});
