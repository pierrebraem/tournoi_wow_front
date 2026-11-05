describe('Liste des personnages', () => {
    it("Vérifie que la liste fonctionne bien et affiche les bonnes informations", () => {
        cy.intercept('GET', 'http://localhost:3000/class', { fixture: 'classes/classes'}).as("getClasses");
        cy.intercept('GET', 'http://localhost:3000/characters', { fixture: 'characters/characters'}).as("getCharacters");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");

        cy.fixture("characters/characters").then((characters) => {
            cy.get(".p-datatable-tbody > tr")
                .should("have.length", characters.length)
                .each(($row, index) => {
                    const character = characters[index];

                    cy.wrap($row).find("td").eq(0).should("contain.text", character.name);
                    cy.wrap($row).find("td").eq(1).should("contain.text", character.class);
                    cy.wrap($row).find("td").eq(2).should("contain.text", character.role);
                    cy.wrap($row).find("td").eq(3).should("contain.text", String(character.ilvl));
                    cy.wrap($row).find("td").eq(4).should("contain.text", String(character.rio));
                });
        });
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500 côté characters", () => {
        cy.intercept('GET', 'http://localhost:3000/class', { fixture: 'classes/classes'}).as("getClasses");
        cy.intercept('GET', 'http://localhost:3000/characters', { statusCode: 500, fixture: '500'}).as("getCharacters");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500 côté classes", () => {
        cy.intercept('GET', 'http://localhost:3000/class', { statusCode: 500, fixture: '500'}).as("getClasses");
        cy.intercept('GET', 'http://localhost:3000/characters', { fixture: 'characters/characters'}).as("getCharacters");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});

describe("Détail d'un personnage", () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:3000/class', { fixture: 'classes/classes'}).as("getClasses");
        cy.intercept('GET', 'http://localhost:3000/characters', { fixture: 'characters/characters'}).as("getCharacters");
    });

    it("Vérifie que l'affichage des détails d'un personnage fonctionne bien et affiche les bonnes informations", () => {
        cy.intercept('GET', 'http://localhost:3000/characters/1', { fixture: 'characters/character' }).as("getCharacter");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");

        cy.get('button[name=Detail]:first').click();

        cy.wait("@getCharacter");

        cy.contains("Détail du personnage ");
        cy.contains("Nom : Mystic Cosmos");
        cy.contains("Classe : Prêtre");
        cy.contains("Rôle : Soigneur");
        cy.contains("ilvl : 10");
        cy.contains("rio : 1000");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 404", () => {
        cy.intercept('GET', 'http://localhost:3000/characters/1', { statusCode: 404, fixture: 'characters/404'}).as("getCharacter");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");

        cy.get('button[name=Detail]:first').click();

        cy.wait("@getCharacter");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("404 : Character not found");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500", () => {
        cy.intercept('GET', 'http://localhost:3000/characters/1', { statusCode: 500, fixture: '500'}).as("getCharacter");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");

        cy.get('button[name=Detail]:first').click();

        cy.wait("@getCharacter");

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});

describe("Ajouter un personnage", () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:3000/class', { fixture: 'classes/classes'}).as("getClasses");
        cy.intercept('GET', 'http://localhost:3000/characters', { fixture: 'characters/characters'}).as("getCharacters");
        cy.intercept('GET', 'http://localhost:3000/canbe/class/9', { fixture: 'canbe/class9'}).as("getRoles");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");
    });

    it("Ajouter un personnage en saisissant les bonnes informations", () => {
        cy.intercept('POST', 'http://localhost:3000/characters/', { statusCode: 201, fixture: '201'}).as("postCharacter");

        cy.get('button[name=Add]').click();

        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.wait('@postCharacter').then(({ request, response }) => {
            expect(request.body).to.include({
                name: "Mighty Eagle",
                class_id: 9,
                role_id: 2,
                ilvl: 15,
                rio: 100,
            });
            expect(response?.statusCode).to.equal(201);
        });
    });

    it("Essayer d'ajouter un personnage sans saisir le nom", () => {
        cy.intercept('POST', 'http://localhost:3000/characters/', { statusCode: 201, fixture: '201'}).as("postCharacter");

        cy.get('button[name=Add]').click();

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Ce champ est obligatoire.");
    });

    it("Essayer d'ajouter un personnage sans saisir la classe", () => {
        cy.intercept('POST', 'http://localhost:3000/characters/', { statusCode: 201, fixture: '201'}).as("postCharacter");

        cy.get('button[name=Add]').click();

        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Ce champ est obligatoire.");
    });

    it("Essayer d'ajouter un personnage sans saisir le rôle", () => {
        cy.intercept('POST', 'http://localhost:3000/characters/', { statusCode: 201, fixture: '201'}).as("postCharacter");

        cy.get('button[name=Add]').click();

        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Ce champ est obligatoire.");
    });

    it("Essayer d'ajouter un personnage en saissant un ilvl supérieur à 645", () => {
        cy.intercept('POST', 'http://localhost:3000/characters/', { statusCode: 201, fixture: '201'}).as("postCharacter");

        cy.get('button[name=Add]').click();

        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').type('650');
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Votre saisie doit être comprise entre 0 et 645.");
    });

    it("Essayer d'ajouter un personnage en saissant un rio supérieur à 4500", () => {
        cy.intercept('POST', 'http://localhost:3000/characters/', { statusCode: 201, fixture: '201'}).as("postCharacter");

        cy.get('button[name=Add]').click();

        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').type('5000');

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Votre saisie doit être comprise entre 0 et 4500.");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 400", () => {
        cy.intercept('POST', 'http://localhost:3000/characters/', { statusCode: 400, fixture: 'characters/400'}).as("postCharacter");
        
        cy.get('button[name=Add]').click();

        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.wait('@postCharacter');

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("400 : The field 'name' is required");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500", () => {
        cy.intercept('POST', 'http://localhost:3000/characters', { statusCode: 500, fixture: '500'}).as("postCharacter");
                
        cy.get('button[name=Add]').click();

        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.wait('@postCharacter');

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});

describe("Modifier un personnage", () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:3000/class', { fixture: 'classes/classes'}).as("getClasses");
        cy.intercept('GET', 'http://localhost:3000/characters', { fixture: 'characters/characters'}).as("getCharacters");
        cy.intercept('GET', 'http://localhost:3000/characters/1', { fixture: 'characters/character' }).as("getCharacter");
        cy.intercept('GET', 'http://localhost:3000/canbe/class/9', { fixture: 'canbe/class9'}).as("getRoles");
        cy.intercept('GET', 'http://localhost:3000/canbe/class/5', { fixture: 'canbe/class5'}).as("getRoles");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");
    });

    it("Vérifie que les informations du personnage sont bons", () => {
        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getCharacter");

        cy.get('input[name=Nom]').should('have.value', 'Mystic Cosmos');

        cy.get('#character-class > .p-dropdown-label').should('have.text', 'Prêtre');

        cy.get('#character-role > .p-dropdown-label').should('have.text', 'Soigneur');

        cy.get('input[name=ilvl]').should('have.value', '10');

        cy.get('input[name=rio]').should('have.value', '1 000');
    });

    it("Modifier un personnage en saisissant les bonnes informations", () => {
        cy.intercept('PUT', 'http://localhost:3000/characters/1', { statusCode: 200, fixture: '200update'}).as("putcharacter");

        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getCharacter");

        cy.get('input[name=Nom]').clear();
        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').clear();
        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').clear();
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.wait('@putcharacter').then(({ request, response }) => {
            expect(request.body).to.include({
                name: "Mighty Eagle",
                class_id: 9,
                role_id: 2,
                ilvl: 15,
                rio: 100,
            });
            expect(response?.statusCode).to.equal(200);
        });
    });

    it("Essayer de modifier un personnage sans saisir le nom", () => {
        cy.intercept('PUT', 'http://localhost:3000/characters/1', { statusCode: 200, fixture: '200update'}).as("putcharacter");

        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getCharacter");

        cy.get('input[name=Nom]').clear();

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').clear();
        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').clear();
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Ce champ est obligatoire.");
    });

    it("Essayer de modifier un personnage en saissant un ilvl supérieur à 645", () => {
        cy.intercept('PUT', 'http://localhost:3000/characters/1', { statusCode: 200, fixture: '200update'}).as("putcharacter");

        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getCharacter");

        cy.get('input[name=Nom]').clear();
        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').clear();
        cy.get('input[name=ilvl]').type('650');
        cy.get('input[name=rio]').clear();
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Votre saisie doit être comprise entre 0 et 645.");
    });

    it("Essayer de modifier un personnage en saissant un rio supérieur à 4500", () => {
        cy.intercept('PUT', 'http://localhost:3000/characters/1', { statusCode: 200, fixture: '200update'}).as("putcharacter");

        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getCharacter");

        cy.get('input[name=Nom]').clear();
        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').clear();
        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').clear();
        cy.get('input[name=rio]').type('5000');

        cy.get('button[name=ButtonDialog]').click();

        cy.contains("Votre saisie doit être comprise entre 0 et 4500.");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 400", () => {
        cy.intercept('PUT', 'http://localhost:3000/characters/1', { statusCode: 400, fixture: 'characters/400'}).as("putCharacter");
        
        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getCharacter");

        cy.get('input[name=Nom]').clear();
        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').clear();
        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').clear();
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.wait('@putCharacter');

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("400 : The field 'name' is required");
    });

    it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500", () => {
        cy.intercept('PUT', 'http://localhost:3000/characters/1', { statusCode: 500, fixture: '500'}).as("putCharacter");
        
        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Edit"]').click();

        cy.wait("@getCharacter");

        cy.get('input[name=Nom]').clear();
        cy.get('input[name=Nom]').type("Mighty Eagle");

        cy.get('#character-class > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_8').click();

        cy.wait("@getRoles");

        cy.get('#character-role > .p-dropdown-trigger').click();
        cy.get('#dropdownItem_1').click();

        cy.get('input[name=ilvl]').clear();
        cy.get('input[name=ilvl]').type('15');
        cy.get('input[name=rio]').clear();
        cy.get('input[name=rio]').type('100');

        cy.get('button[name=ButtonDialog]').click();

        cy.wait('@putCharacter');

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});

describe("Supprimer un personnage", () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:3000/class', { fixture: 'classes/classes'}).as("getClasses");
        cy.intercept('GET', 'http://localhost:3000/characters', { fixture: 'characters/characters'}).as("getCharacters");
        cy.visit('http://localhost:5173/characters');

        cy.wait("@getCharacters");
        cy.wait("@getClasses");
    });

    it("Vérifie que le personnage se supprime normalement", () => {
        cy.intercept('DELETE', 'http://localhost:3000/characters/1', { statusCode: 200, fixture: '200delete'}).as("deleteCharacter");

        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Delete"]').click();

        cy.get('.p-confirm-dialog-accept').click();

        cy.wait('@deleteCharacter').then(({ response }) => {
            expect(response?.statusCode).to.equal(200);
        });
    });

        it("Vérifie que la modal d'erreur s'affiche en cas d'erreur 500", () => {
        cy.intercept('DELETE', 'http://localhost:3000/characters/1', { statusCode: 500, fixture: '500'}).as("deleteCharacter");
    
        cy.get(':nth-child(1) > :nth-child(6) > .spacing-between-buttons > [name="Delete"]').click();

        cy.get('.p-confirm-dialog-accept').click();

        cy.wait('@deleteCharacter');

        cy.contains("Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes");
        cy.contains("500 : Internal Server Error");
    });
});