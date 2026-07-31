# Présentation
Projet de gestion de tournois WOW côté front.\
Vous trouverez le côté back [ici](https://github.com/pierrebraem/tournoi_wow_back)

# Installation
## Télécharger Docker
Pour pouvoir faire l'installation du front, vous devez avoir Docker installer sur votre ordinateur.\
Vous pouvez le télécharger [à cette adresse](https://www.docker.com/)

## Cloner le projet
Une fois fait, clonez le projet :
```
git clone https://github.com/pierrebraem/tournoi_wow_front.git
```

## Création des containers
Allez à la racine du projet et exécutez la commande suivante pour créer le container front :
```
docker compose up -d
```
L'opération peu prendre un certains temps.

Si tous s'est bien passé, les containeurs devraient être opérationnels.

# Exécution des tests
Pour exécuter les tests, vous devez ouvrir Cypress avec la commande :
```
npx cypress open
```
Puis, cliquez sur `E2E Testing`.\
Selectionnez le navigateur.\
Selectionnez un fichier de tests (les fichiers en .spec.ts).\
**ATTENTION : le projet doit tourner en arrière plan**
