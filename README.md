# Présentation
Projet de gestion de tournois WOW côté front.\
Vous trouverez le côté back [ici](https://github.com/pierrebraem/tournoi_wow_back)

# Installation du projet en local
Tout d'abord, vous devez cloner le projet avec cette commande :
```
git clone https://github.com/pierrebraem/tournoi_wow_front.git
```
Ensuite, allez à la racine du projet et tapez la commande suivante :
```
npm install
```
Pour lancer le projet, tapez la commande :
```
npm run dev
```

# Exécution des tests
Pour exécuter les tests, vous devez ouvrir Cypress avec la commande :
```
npx cypress open
```
Puis, cliquez sur `E2E Testing`.\
Selectionnez le navigateur.\
Selectionnez un fichier de tests (les fichiers en .spec.ts).\
**ATTENTION : le projet doit tourner en arrière plan**
