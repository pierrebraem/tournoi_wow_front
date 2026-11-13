describe('Liste des groupes', () => {
    it("Vérifie que la liste fonctionne bien et affiche les bonnes informations", () => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties'}, { fixture: 'parties/parties'}).as("getParties");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/characters'}, { fixture: 'characters/characters'}).as("getCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");

        cy.fixture("parties/parties").then((parties) => {
            cy.get(".p-datatable-tbody > tr")
                .should("have.length", parties.length)
                .each(($row, index) => {
                    const party = parties[index];

                    cy.wrap($row).find("td").eq(0).should("contain.text", party.name);
                });
        });
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500 côté parties", () => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties'}, { statusCode: 500, fixture: '500'}).as("getParties");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/characters'}, { fixture: 'characters/characters'}).as("getCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500 côté characters", () => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties'}, { fixture: 'parties/parties'}).as("getParties");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/characters'}, { statusCode: 500, fixture: '500'}).as("getCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});

describe("Détail d'un groupe", () => {
    beforeEach(() => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties'}, { fixture: 'parties/parties'}).as("getParties");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/characters'}, { fixture: 'characters/characters'}).as("getCharacters");
    });

    it("Vérifie que l'affichage des détails d'un groupe fonctionne bien et affiche les bonnes informations", () => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties/1'}, { fixture: 'parties/party'}).as("getParty");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/compose/1'}, { fixture: 'compose/party1'}).as("getLinkedCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");

        cy.get('button[name=Detail]:first').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.contains("Détail du groupe Groupe 1");
        cy.contains("Id : 1");
        cy.contains("Nom : Groupe 1");
        cy.contains("Liste des personnages :");
        cy.contains("Id : 5");
        cy.contains("Nom : Savage Fire");
        cy.contains("Classe : Guerrier");
        cy.contains("Rôle : Spécialiste des dégâts");
        cy.contains("Id : 7");
        cy.contains("Nom : Resolute Oracle");
        cy.contains("Classe : Mage");
        cy.contains("Rôle : Dégâts");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 404 côté party", () => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties/1'}, { statusCode: 404, fixture: 'parties/404'}).as("getParty");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/compose/1'}, { fixture: 'compose/party1'}).as("getLinkedCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");

        cy.get('button[name=Detail]:first').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("404 : Party not found");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 404 côté compose", () => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties/1'}, { fixture: 'parties/party'}).as("getParty");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/compose/1'}, { statusCode: 404, fixture: 'compose/404'}).as("getLinkedCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");

        cy.get('button[name=Detail]:first').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("404 : Party not found");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500 côté party", () => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties/1'}, { statusCode: 500, fixture: '500'}).as("getParty");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/compose/1'}, { fixture: 'compose/party1'}).as("getLinkedCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");

        cy.get('button[name=Detail]:first').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500 côté compose", () => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties/1'}, { fixture: 'parties/party'}).as("getParty");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/compose/1'}, { statusCode: 500, fixture: '500'}).as("getLinkedCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");

        cy.get('button[name=Detail]:first').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});

describe("Ajouter un groupe", () => {
    beforeEach(() => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties'}, { fixture: 'parties/parties'}).as("getParties");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/characters'}, { fixture: 'characters/characters'}).as("getCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");
    });

    it("Ajouter un groupe en saisissant les bonnes informations", () => {
        cy.intercept({ method: 'POST', port: 3000, pathname: '/parties'}, { statusCode: 201, fixture: '201'}).as("postParty");

        cy.get('button[aria-label="Ajouter un groupe"]').click();

        cy.get('input[name=Nom]').type("Groupe 4");

        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox > .p-checkbox > .p-checkbox-input').first().click();

        cy.get('button[name=ButtonDialog]').click();

        cy.wait('@postParty').then(({ request, response }) => {
            expect(request.body).to.include({ name: "Groupe 4" });
            expect(request.body.characters).to.have.length(1);
            expect(request.body.characters[0]).to.include({
                id: 1,
                name: "Mystic Cosmos",
                class: "Prêtre",
                role: "Soigneur",
                ilvl: 10,
                rio: 1000
            });
            expect(response?.statusCode).to.equal(201);
        });
    });

    it("Essayer d'ajouter un groupe sans saisir le nom", () => {
        cy.get('button[aria-label="Ajouter un groupe"]').click();

        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox > .p-checkbox > .p-checkbox-input').first().click();

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Ce champ est obligatoire.");
    });

    it("Essayer d'ajouter un groupe sans saisir de personnages", () => {
        cy.get('button[aria-label="Ajouter un groupe"]').click();

        cy.get('input[name=Nom]').type("Groupe 4");

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Vous devez saisir au moins un personnage.");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 400", () => {
        cy.intercept({ method: 'POST', port: 3000, pathname: '/parties/'}, { statusCode: 400, fixture: 'parties/400'}).as("postParty");

        cy.get('button[aria-label="Ajouter un groupe"]').click();

        cy.get('input[name=Nom]').type("Groupe 4");

        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox > .p-checkbox > .p-checkbox-input').first().click();

        cy.get('button[name=ButtonDialog]').click();

        cy.wait("@postParty");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("400 : The field 'name' is required");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500", () => {
        cy.intercept({ method: 'POST', port: 3000, pathname: '/parties/'}, { statusCode: 500, fixture: '500'}).as("postParty");

        cy.get('button[aria-label="Ajouter un groupe"]').click();

        cy.get('input[name=Nom]').type("Groupe 4");

        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox > .p-checkbox > .p-checkbox-input').first().click();

        cy.get('button[name=ButtonDialog]').click();

        cy.wait("@postParty");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});

describe("Modifier un groupe", () => {
    beforeEach(() => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties'}, { fixture: 'parties/parties'}).as("getParties");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties/1'}, { fixture: 'parties/party'}).as("getParty");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/compose/1'}, { fixture: 'compose/party1'}).as("getLinkedCharacters");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/characters'}, { fixture: 'characters/characters'}).as("getCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");
    });

    it("Vérifie que les informations du groupe sont bons", () => {
        cy.get(':nth-child(1) > :nth-child(2) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.get('input[name=Nom]').should('have.value', 'Groupe 1');

        cy.contains(':nth-child(1) > .p-multiselect-token-label', /^Savage Fire$/);
        cy.contains(':nth-child(2) > .p-multiselect-token-label', /^Resolute Oracle$/);
    });

    it("Modifier un groupe en saisissant les bonnes informations", () => {
        cy.intercept({ method: 'PUT', port: 3000, pathname: '/parties/1'}, { statusCode: 200, fixture: '200update'}).as("putParty");

        cy.get(':nth-child(1) > :nth-child(2) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.get('input[name=Nom]').clear();
        cy.get('input[name=Nom]').type("Groupe 4");

        cy.get(':nth-child(2) > .p-multiselect-token-icon').click();
        cy.get(':nth-child(1) > .p-multiselect-token-icon').click();

        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox > .p-checkbox > .p-checkbox-input').first().click();

        cy.get('button[name=ButtonDialog]').click();

        cy.wait('@putParty').then(({ request, response }) => {
            expect(request.body).to.include({ name: "Groupe 4" });
            expect(request.body.characters).to.have.length(1);
            expect(request.body.characters[0]).to.include({
                id: 1,
                name: "Mystic Cosmos",
                class: "Prêtre",
                role: "Soigneur",
                ilvl: 10,
                rio: 1000
            });
            expect(response?.statusCode).to.equal(200);
        });
    });

    it("Essayer de modifier un groupe sans saisir le nom", () => {
        cy.get(':nth-child(1) > :nth-child(2) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.get('input[name=Nom]').clear();

        cy.get(':nth-child(2) > .p-multiselect-token-icon').click();
        cy.get(':nth-child(1) > .p-multiselect-token-icon').click();
        
        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox > .p-checkbox > .p-checkbox-input').first().click();

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Ce champ est obligatoire.");
    });

    it("Essayer de modifier un groupe sans saisir de personnages", () => {
        cy.get(':nth-child(1) > :nth-child(2) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.get('input[name=Nom').clear();
        cy.get('input[name=Nom]').type("Groupe 4");

        cy.get(':nth-child(2) > .p-multiselect-token-icon').click();
        cy.get(':nth-child(1) > .p-multiselect-token-icon').click();

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Vous devez saisir au moins un personnage.");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 400", () => {
        cy.intercept({ method: 'PUT', port: 3000, pathname: '/parties/1'}, { statusCode: 400, fixture: 'parties/400'}).as("putParty");

        cy.get(':nth-child(1) > :nth-child(2) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.get('input[name=Nom]').clear();
        cy.get('input[name=Nom]').type("Groupe 4");

        cy.get(':nth-child(2) > .p-multiselect-token-icon').click();
        cy.get(':nth-child(1) > .p-multiselect-token-icon').click();

        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox > .p-checkbox > .p-checkbox-input').first().click();

        cy.get('button[name=ButtonDialog]').click();

        cy.wait("@putParty");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("400 : The field 'name' is required");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500", () => {
        cy.intercept({ method: 'PUT', port: 3000, pathname: '/parties/1'}, { statusCode: 500, fixture: '500'}).as("putParty");

        cy.get(':nth-child(1) > :nth-child(2) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getParty");
        cy.wait("@getLinkedCharacters");

        cy.get('input[name=Nom]').clear();
        cy.get('input[name=Nom]').type("Groupe 4");

        cy.get(':nth-child(2) > .p-multiselect-token-icon').click();
        cy.get(':nth-child(1) > .p-multiselect-token-icon').click();

        cy.get('.p-multiselect-trigger').click();
        cy.get('.p-multiselect-checkbox > .p-checkbox > .p-checkbox-input').first().click();

        cy.get('button[name=ButtonDialog]').click();

        cy.wait("@putParty");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});

describe("Supprimer un groupe", () => {
    beforeEach(() => {
        cy.intercept({ method: 'GET', port: 3000, pathname: '/parties'}, { fixture: 'parties/parties'}).as("getParties");
        cy.intercept({ method: 'GET', port: 3000, pathname: '/characters'}, { fixture: 'characters/characters'}).as("getCharacters");
        cy.visit('/parties');

        cy.wait("@getParties");
        cy.wait("@getCharacters");
    });

    it("Vérifie que le groupe se supprime normalement", () => {
        cy.intercept({ method: 'DELETE', port: 3000, pathname: '/parties/1'}, { statusCode: 200, fixture: '200delete'}).as("deleteParty");

        cy.get(':nth-child(1) > :nth-child(2) > .spacing-between-buttons > [name="Delete"]').click();

        cy.get('.p-confirm-dialog-accept').click();

        cy.wait('@deleteParty').then(({ response }) => {
            expect(response?.statusCode).to.equal(200);
        });
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500", () => {
        cy.intercept({ method: 'DELETE', port: 3000, pathname: '/parties/1' }, { statusCode: 500, fixture: '500'}).as("deleteParty");
    
        cy.get(':nth-child(1) > :nth-child(2) > .spacing-between-buttons > [name="Delete"]').click();

        cy.get('.p-confirm-dialog-accept').click();

        cy.wait('@deleteParty');

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});