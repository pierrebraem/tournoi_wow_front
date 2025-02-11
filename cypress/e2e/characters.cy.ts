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

  it('Essayer d\'ajouter un personnage avec un ilvl supérieur à 645', () => {
    cy.contains('Ajouter un personnage').click();

    cy.get('input[name=Nom]').type('Valiant Mystic');

    cy.get(':nth-child(2) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_1').click();

    cy.get(':nth-child(3) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_0 > .p-dropdown-item-label').contains('Tank');
    cy.get('#dropdownItem_1 > .p-dropdown-item-label').contains('Soigneur');
    cy.get('#dropdownItem_0').click();

    cy.get('input[name=ilvl]').type('1000');

    cy.get('input[name=rio]').type('1500');

    cy.get('button[name=AddButtonDialog]').click();
    
    cy.contains("The field 'ilvl' must be between 0 and 645")
  });

  it('Essayer d\'ajouter un personnage avec un ilvl inférieur à 0', () => {
    cy.contains('Ajouter un personnage').click();

    cy.get('input[name=Nom]').type('Valiant Mystic');

    cy.get(':nth-child(2) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_1').click();

    cy.get(':nth-child(3) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_0 > .p-dropdown-item-label').contains('Tank');
    cy.get('#dropdownItem_1 > .p-dropdown-item-label').contains('Soigneur');
    cy.get('#dropdownItem_0').click();

    cy.get('input[name=ilvl]').type('-5');

    cy.get('input[name=rio]').type('1500');

    cy.get('button[name=AddButtonDialog]').click();
    
    cy.contains("The field 'ilvl' must be between 0 and 645")
  });

  it('Essayer d\'ajouter un personnage avec un rio supérieur à 4500', () => {
    cy.contains('Ajouter un personnage').click();

    cy.get('input[name=Nom]').type('Valiant Mystic');

    cy.get(':nth-child(2) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_1').click();

    cy.get(':nth-child(3) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_0 > .p-dropdown-item-label').contains('Tank');
    cy.get('#dropdownItem_1 > .p-dropdown-item-label').contains('Soigneur');
    cy.get('#dropdownItem_0').click();

    cy.get('input[name=ilvl]').type('500');

    cy.get('input[name=rio]').type('5000');

    cy.get('button[name=AddButtonDialog]').click();
    
    cy.contains("The field 'rio' must be between 0 and 4500")
  });

  it('Essayer d\'ajouter un personnage avec un rio supérieur à 0', () => {
    cy.contains('Ajouter un personnage').click();

    cy.get('input[name=Nom]').type('Valiant Mystic');

    cy.get(':nth-child(2) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_1').click();

    cy.get(':nth-child(3) > .p-dropdown > .p-dropdown-trigger').click();
    cy.get('#dropdownItem_0 > .p-dropdown-item-label').contains('Tank');
    cy.get('#dropdownItem_1 > .p-dropdown-item-label').contains('Soigneur');
    cy.get('#dropdownItem_0').click();

    cy.get('input[name=ilvl]').type('500');

    cy.get('input[name=rio]').type('-10');

    cy.get('button[name=AddButtonDialog]').click();
    
    cy.contains("The field 'rio' must be between 0 and 4500")
  });
})