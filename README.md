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

## Créer un fichier .env
Afin de faire fonctionner le projet, vous devez avoir un fichier `.env` à la racine du projet.\
Vous pouvez soit renommez le fichier `.env.example` en `.env` ou créez un fichier `.env` en prenant comme modèle le fichier `.env.example`.

## Création du container front
Allez à la racine du projet et exécutez la commande suivante pour créer le container front :
```
docker compose up -d frontend
```
L'opération peu prendre un certains temps.

Si tous s'est bien passé, les containeurs devraient être opérationnels.

# Exécution des tests
## Exécution des tests avec interface graphique (local)
Tout d'abord, vous devez installer les dépendances du projet en local ex exécutant la commande suivante :
```
npm install
```
Une fois l'installation terminée, vérifiez que le container `frontend` est bien démarré et fonctionne correctement. Cette étape est indispensable au bon fonctionnement des tests.
Ensuite, lancez Cypress à l'aide de la commande suivante :
```
npx cypress open
```
Sélectionnez le navigateur de votre choix, puis choisissez le fichier de test que vous souhaitez exécuter.
## Exécution des tests en mode headless (Docker)
Pour exécutez les tests sur Firefox, tapez la commande suivante :
```
docker compose up -d cypress-firefox
```
Pour exécutez les tests sur Chrome, tapez la commande suivante :
```
docker compose up -d cypress-chrome
```
Pour exécutez les tests sur les deux navigateurs, tapez la commande suivante :
```
docker compose up -d cypress-chrome cypress-firefox
```
Si un test échoue, une capture d'écran est sauvegardée dans le dossier : `cypress/screenshots`
