# ⚡ Pokémon Battle — React

Un jeu de combat Pokémon au tour par tour développé avec **React**, **TypeScript** et **CSS classique**.

---

## 🎮 Fonctionnalités

- **Écran de sélection** : choisissez votre Pokémon parmi 19 disponibles
- **Combat au tour par tour** : utilisez l'une de vos 4 attaques pour affronter un adversaire choisi aléatoirement
- **Système de types** : faiblesses et résistances prises en compte (super efficace, peu efficace…)
- **IA adversaire** : l'adversaire choisit aléatoirement une attaque disponible à chaque tour
- **Animations** : effets visuels lors des attaques et des dégâts reçus
- **Journal de combat** : suivi en temps réel des actions et des dégâts infligés
- **Barre de HP** : change de couleur selon les points de vie restants (vert → jaune → rouge)
- **Pokédex** : page dédiée affichant tous les Pokémon avec leurs stats et attaques
- **Page d'inscription** : formulaire de création de compte dresseur

---

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

---

## 🖼️ Images des Pokémon — PokéAPI Sprites

Toutes les images des Pokémon proviennent du dépôt GitHub open source **[PokeAPI/sprites](https://github.com/PokeAPI/sprites)**, accessible gratuitement via des URLs publiques.

### Formats disponibles

| Type d'image | URL |
|---|---|
| Artwork officiel (face) | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png` |
| Sprite dos (combat joueur) | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/{id}.png` |
| Sprite face (combat adverse) | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png` |

### Comment trouver l'ID d'un Pokémon ?

Chaque Pokémon a un **numéro unique** dans le Pokédex national. Par exemple :
- Pikachu → `id: 25` → `https://raw.githubusercontent.com/.../25.png`
- Mewtwo → `id: 150` → `https://raw.githubusercontent.com/.../150.png`
- Rayquaza → `id: 384` → `https://raw.githubusercontent.com/.../384.png`

Tu peux trouver l'ID de n'importe quel Pokémon sur [https://pokeapi.co](https://pokeapi.co) ou [https://bulbapedia.bulbagarden.net](https://bulbapedia.bulbagarden.net).

### Ajouter un nouveau Pokémon

Pour ajouter un Pokémon dans le jeu, ouvre `src/data/pokemons.ts` et ajoute une entrée comme ceci :

```typescript
{
  id: 25,                  // ← numéro du Pokédex
  name: 'Pikachu',
  type: 'Electric',
  hp: 110,
  maxHp: 110,
  attack: 55,
  defense: 40,
  speed: 110,
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
  moves: [
    { name: 'Thunderbolt', power: 90, type: 'Electric', pp: 15, maxPp: 15 },
    { name: 'Quick Attack', power: 40, type: 'Normal',   pp: 30, maxPp: 30 },
    { name: 'Thunder',      power: 110, type: 'Electric', pp: 10, maxPp: 10 },
    { name: 'Iron Tail',    power: 100, type: 'Steel',    pp: 15, maxPp: 15 },
  ],
},
```

> ⚠️ Le champ `type` doit correspondre à l'un des types définis dans `src/types/pokemon.ts`.  
> Si tu utilises un nouveau type, pense à l'ajouter dans le type `PokemonType` **et** dans les fichiers CSS (`src/styles/global.css`).

---

## 🗂️ Structure du projet

```
src/
├── App.tsx                        # Point d'entrée — routing React Router
├── index.css                      # Importe tous les fichiers CSS
├── components/
│   ├── SelectionScreen.tsx        # Écran de sélection du Pokémon
│   ├── PokemonCard.tsx            # Carte d'un Pokémon (sprite + barre HP)
│   ├── GameLog.tsx                # Journal des actions de combat
│   └── Layout/
│       ├── Layout.tsx             # Mise en page avec NavBar
│       └── NaveBar.tsx            # Barre de navigation
├── pages/
│   ├── HomePage.tsx               # Page de combat
│   ├── PokedexPage.tsx            # Page Pokédex
│   └── RegisterPage.tsx          # Page d'inscription
├── data/
│   └── pokemons.ts                # Données des 19 Pokémon disponibles
├── hooks/
│   └── useBattle.ts               # Logique du combat (hook personnalisé)
├── styles/
│   ├── global.css                 # Reset, couleurs de types et attaques
│   ├── navbar.css                 # Barre de navigation
│   ├── selection.css              # Écran de sélection
│   ├── pokemoncard.css            # Carte Pokémon en combat
│   ├── gamelog.css                # Journal de combat
│   ├── home.css                   # Page de combat
│   ├── pokedex.css                # Page Pokédex
│   └── register.css               # Page d'inscription
└── types/
    └── pokemon.ts                 # Types TypeScript (Pokemon, Move, PokemonType…)
```

---

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|---|---|
| [React 19](https://react.dev/) | Interface utilisateur |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique |
| [React Router v6](https://reactrouter.com/) | Navigation entre les pages |
| CSS classique | Styles et mise en page (pas de framework CSS) |
| [PokéAPI Sprites](https://github.com/PokeAPI/sprites) | Images des Pokémon (open source, GitHub) |

---

## 📖 Comment jouer ?

1. **Choisissez votre Pokémon** sur l'écran de sélection (19 disponibles)
2. Cliquez sur **"Combat avec [Nom] !"** pour lancer le combat
3. Sélectionnez une **attaque** parmi les 4 disponibles à chaque tour
4. Battez le Pokémon adverse avant de tomber à 0 HP
5. En fin de partie, cliquez sur **"Rejouer"** pour recommencer

---

## 🗺️ Pages de l'application

| Route | Page | Description |
|---|---|---|
| `/` | 🏠 Home | Sélection et combat Pokémon |
| `/pokedex` | 📖 Pokédex | Tous les Pokémon avec leurs stats |
| `/register` | 🎮 S'inscrire | Formulaire de création de compte |
