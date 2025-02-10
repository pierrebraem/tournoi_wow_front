describe('Tests characters', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/characters', { fixture: 'characters' });
    cy.intercept('GET', 'http://localhost:3000/characters/1', { fixture: 'characters' });
    cy.intercept('GET', 'http://localhost:3000/class', { fixture: 'classes' });
    cy.intercept('GET', 'http://localhost:3000/role', { fixture: 'roles' });

    cy.visit('http://localhost:5173/characters');
  });
  
  it("Voir les détails d'un personnage", () => {
    cy.get('button[name=Detail]').click();

    cy.contains("Détail du personnage Mystic Raven");
    cy.contains("Nom : Mystic Raven");
    cy.contains("Classe : Druide");
    cy.contains("Rôle : Soigneur");
    cy.contains("ilvl : 100");
    cy.contains("rio : 1450");
  });

  it("Supprimer un personnage", () => {
    cy.get('button[name=Delete]').click();

    cy.contains("Suppression");
    cy.contains("Etes-vous sur de supprimer le personnage Mystic")

    cy.contains('Yes').click();
  });

  it('Ajouter un personnage', () => { 
    cy.visit('http://localhost:5173/characters');

    cy.contains('Ajouter un personnage').click();

    cy.get('input[name=Nom]').type('Valiant Mystic');

    cy.get(':nth-child(2) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_1').click();

    cy.get(':nth-child(3) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_0 > .p-dropdown-item-label').contains('Tank');
    cy.get('#dropdownItem_1 > .p-dropdown-item-label').contains('Soigneur');
    cy.get('#dropdownItem_0').click();

    cy.get('input[name=ilvl]').type('500');

    cy.get('input[name=rio]').type('1500');

    cy.get('button[name=AddButtonDialog]').click();
  });
})