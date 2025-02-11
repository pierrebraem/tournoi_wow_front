describe('Tests parties', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:3000/parties', { fixture: 'parties' });
        cy.intercept('GET', 'http://localhost:3000/characters', { fixture: 'characters' });
        cy.intercept('GET', 'http://localhost:3000/compose/1', { fixture: 'compose' }); 
        cy.intercept('GET', 'http://localhost:3000/parties/1', { fixture: 'parties' });
        cy.visit('http://localhost:5173/parties');
    });

    it("Voir les détails d'un groupe", () => {
        cy.get('button[name=Detail]').click();

        cy.contains('Id : 1');
        cy.contains('Nom : Groupe 1');;

        cy.contains('Id : 2');
        cy.contains('Nom : Personnage 1');
        cy.contains('Classe : Chasseur');
        cy.contains('Rôle : Soigneur');

        cy.contains('Id : 5');
        cy.contains('Nom : Personnage 2');
        cy.contains('Classe : Druide');
        cy.contains('Rôle : Tank');

        cy.contains('Id : 8');
        cy.contains('Nom : Personnage 3');
        cy.contains('Classe : Prêtre');
        cy.contains('Rôle : Soins');
    });

    it("Supprimer un groupe", () => {
        cy.get('button[name=Delete]').click();

        cy.contains("Suppression");
        cy.contains("Etes-vous sûr de supprimer le groupe Groupe 1");

        cy.contains('Yes').click();
    });

    it("Ajouter un groupe", () => {
        cy.contains('Ajouter un groupe').click();

        cy.get('input[name=Nom]').type('Groupe 2');
        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox').click();

        cy.get('button[name=AddButtonDialog]').click();
    });
});