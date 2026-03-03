export type PokemonType =
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Psychic'
  | 'Normal'
  | 'Fighting'
  | 'Rock'
  | 'Ice'
  | 'Dragon'
  | 'Ghost'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Bug'
  | 'Steel'
  | 'Dark';

export interface Move {
  name: string;
  power: number;
  type: PokemonType;
  pp: number;
  maxPp: number;
}

export interface Pokemon {
  id: number;
  name: string;
  type: PokemonType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  sprite: string;
  backSprite: string;
  moves: Move[];
}
