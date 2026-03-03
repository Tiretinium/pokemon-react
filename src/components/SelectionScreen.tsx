import React from 'react';
import { Pokemon } from '../types/pokemon';
import { pokemons } from '../data/pokemons';

interface SelectionScreenProps {
  onSelect: (player: Pokemon, opponent: Pokemon) => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  const [selected, setSelected] = React.useState<Pokemon | null>(null);

  const handleSelect = (pokemon: Pokemon) => {
    setSelected(pokemon);
  };

  const handleStart = () => {
    if (!selected) return;
    const others = pokemons.filter((p) => p.id !== selected.id);
    const opponent = others[Math.floor(Math.random() * others.length)];
    const cloneMove = (m: any) => ({ ...m });
    const cloneP = (p: Pokemon): Pokemon => ({ ...p, moves: p.moves.map(cloneMove) });
    onSelect(cloneP(selected), cloneP(opponent));
  };

  return (
    <div className="selection">
      <h1 className="selection__title">⚡ Pokémon Battle</h1>
      <p className="selection__subtitle">Choisis ton Pokémon pour combattre !</p>

      <div className="selection__grid">
        {pokemons.map((pokemon) => {
          const isSelected = selected?.id === pokemon.id;
          return (
            <div
              key={pokemon.id}
              onClick={() => handleSelect(pokemon)}
              className={`pokemon-card-select${isSelected ? ' selected' : ''}`}
            >
              <img src={pokemon.sprite} alt={pokemon.name} />
              <span className="pokemon-card-select__name">{pokemon.name}</span>
              <span className={`type-badge type-${pokemon.type}`}>{pokemon.type}</span>
              <div className="pokemon-card-select__hp">HP: {pokemon.maxHp}</div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleStart}
        disabled={!selected}
        className={`selection__btn ${selected ? 'ready' : 'disabled'}`}
      >
        {selected ? `Combat avec ${selected.name} !` : 'Sélectionne un Pokémon'}
      </button>
    </div>
  );
};

export default SelectionScreen;
