# ⚡ Pokémon Battle — React

Un jeu de combat Pokémon au tour par tour développé avec **React**, **TypeScript** et **Tailwind CSS**.

## 🎮 Fonctionnalités

- **Écran de sélection** : choisissez votre Pokémon 
- **Combat au tour par tour** : utilisez l'une de vos 4 attaques pour affronter un adversaire choisi aléatoirement
- **Système de types** : les faiblesses et résistances sont prises en compte (super efficace, peu efficace…)
- **IA adversaire** : l'adversaire choisit aléatoirement une attaque disponible à chaque tour
- **Animations** : effets visuels lors des attaques et des dégâts reçus
- **Journal de combat** : suivi en temps réel des actions et des dégâts infligés
- **Barre de HP** : change de couleur selon les points de vie restants (vert → jaune → rouge)

## 🚀 Lancer le projet

### Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- npm

### Installation

```bash
npm install
```

### Démarrer en mode développement

```bash
npm start
```

L'application s'ouvre automatiquement sur [http://localhost:3000](http://localhost:3000).  
La page se recharge automatiquement à chaque modification du code.

### Construire pour la production

```bash
npm run build
```

Génère une version optimisée dans le dossier `build/`, prête à être déployée.

### Lancer les tests

```bash
npm test
```

## 🗂️ Structure du projet

```
src/
├── App.tsx                  # Composant principal + logique de combat
├── components/
│   ├── SelectionScreen.tsx  # Écran de sélection du Pokémon
│   ├── PokemonCard.tsx      # Carte d'un Pokémon (sprite + barre HP)
│   └── GameLog.tsx          # Journal des actions de combat
├── data/
│   └── pokemons.ts          # Données des 8 Pokémon disponibles
└── types/
    └── pokemon.ts           # Types TypeScript (Pokemon, Move…)
```

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|---|---|
| [React 19](https://react.dev/) | Interface utilisateur |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique |
| [Tailwind CSS 3](https://tailwindcss.com/) | Styles et mise en page |
| [PokéAPI Sprites](https://github.com/PokeAPI/sprites) | Images des Pokémon |

## 📖 Comment jouer ?

1. **Choisissez votre Pokémon** sur l'écran de sélection
2. Cliquez sur **"Fight with [Nom] !"** pour lancer le combat
3. Sélectionnez une **attaque** parmi les 4 disponibles à chaque tour
4. Battez le Pokémon adverse avant de tomber à 0 HP
5. En fin de partie, cliquez sur **"Play Again"** pour recommencer
