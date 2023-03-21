import InputField from './InputField';

describe('InputField', () => {
  it('mounts', () => {
    cy.mount(
      <InputField
        name="username"
        label="Username"
        requiredMessage="Username is required"
        submitted={true}
      />
    );
  });

  it('should show error if field if is blank and form has been submitted', () => {
    cy.mount(
      <InputField
        name="username"
        label="Username"
        requiredMessage="Username is required"
        submitted={true}
      />
    );
    cy.getErrorMessageFor('Username').should(
      'contain.text',
      'Username is required'
    );
  });

  it('should NOT show error if there is no value and form has NOT been submitted', () => {
    cy.mount(
      <InputField
        name="Username"
        label="Username"
        requiredMessage="Username is required"
        value={''}
        submitted={false}
      />
    );
    cy.getErrorMessageFor('Username').should('not.be.visible');
  });

  it('should NOT show error if there is a value and form has been submitted', () => {
    cy.mount(
      <InputField
        name="username"
        label="Username"
        requiredMessage="Username is required"
        value={'abc123'}
        submitted={true}
      />
    );

    cy.getErrorMessageFor('Username').should('not.be.visible');
  });

  it('when input is modified, onChange should be called', () => {
    cy.mount(
      <InputField
        name="username"
        label="Username"
        requiredMessage="Username is required"
        value={'abc123'}
        submitted={false}
        onChange={cy.spy().as('onChangeSpy')}
      />
    );

    cy.getInputFor('Username').type('abc123');

    cy.get('@onChangeSpy').should((spy: any) => {
      const args = spy.getCall(0).args;
      expect(args[0].target.value).to.equal('abc123');
    });
    cy.getInputFor('Username').should('contain.value', 'abc123');
  });
});
