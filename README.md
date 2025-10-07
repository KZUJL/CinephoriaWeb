# 🎬 Cinephoria Front-end (Vue.js + Vite)

Cinephoria Front-end est l’interface utilisateur web de la plateforme Cinephoria.  
Elle permet aux utilisateurs de consulter les films, gérer les réservations et accéder aux informations liées aux utilisateurs et employés.  

---

## 🚀 Prérequis

- [Node.js](https://nodejs.org/) (version 18+ recommandée)  
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)  
- Cinephoria Back-end en local ou accessible en ligne  

---

## 📂 Installation

### Cloner le dépôt

```bash
git clone https://github.com/KZUJL/CinephoriaWeb.git
cd CinephoriaWeb

### Installer les dépendances

npm install

### Configuration de l’API

Le front communique avec le back via l’URL définie dans le fichier .env.

Créer un fichier .env à la racine du projet (si non présent) :
# URL du back-end
VITE_API_URL=https://apicinephoria-bf9xgq.fly.dev
⚠️ Pour utiliser le back local, changer l’URL pour pointer vers votre instance locale du back :
VITE_API_URL=https://localhost:7121

### Lancer le front en développement

npm run dev
Puis ouvrir le navigateur à l’adresse indiquée (ex : http://localhost:5173)

### Tests unitaires

npm run test:unit

# Autres dépôts du projet Cinephoria

- [Cinephoria Front-end (Vue.js)](https://github.com/KZUJL/CinephoriaWeb)
- [Cinephoria Back-end (C# .NET)](https://github.com/KZUJL/ApiCinephoria)
- [Cinephoria Mobile (Flutter)](https://github.com/KZUJL/CinephoriaMobileApp)
- [Cinephoria Desktop (C#)](https://github.com/KZUJL/CinephoriaDesktop)

