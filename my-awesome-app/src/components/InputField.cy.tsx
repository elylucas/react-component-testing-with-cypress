import InputField from './InputField';

describe('InputField', () => {
  it('mounts', () => {
    cy.mount(
      <InputField name="test" label="Test" requiredMessage="Test is required" />
    );
  });

  it('should show error if field if is blank and form has been submitted', () => {
    cy.mount(
      <InputField
        name="name"
        label="Name"
        requiredMessage="Name is required"
        value={''}
        submitted={true}
      />
    );

    cy.contains('span', 'Name is required').should('be.visible');
  });

  it('should NOT show error if field if is blank and form has been submitted', () => {
    cy.mount(
      <InputField
        name="name"
        label="Name"
        requiredMessage="Name is required"
        value={''}
        submitted={false}
      />
    );

    cy.contains('span', 'Name is required').should('not.be.visible');
  });

  it('should NOT show error if there is a value and form has been submitted', () => {
    cy.mount(
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

  it('when input is modified, onChange should be called', () => {
    cy.mount(
      <InputField
        name="name"
        label="Name"
        requiredMessage="Name is required"
        submitted={false}
        onChange={cy.spy().as('onChangeSpy')}
      />
    );

    cy.get('input').type('abc123');

    cy.get('@onChangeSpy').should('have.been.calledWithMatch', {
      target: { value: 'abc123' },
    });
    cy.get('input').should('contain.value', 'abc123');
  });
});
