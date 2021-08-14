describe('ui', () => {
  beforeEach(() => cy.visit('/'));

  it('load directory after a repo path has been entered', () => {
    cy.get('input[data-testid="github-repo-input"]').type(
      'microsoft/vscode/main'
    );
  });
});
