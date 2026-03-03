import React from 'react';
import { Pokemon } from '../types/pokemon';
import { pokemons } from '../data/pokemons';

const typeColors: Record<string, string> = {
  Fire: 'bg-orange-500',
  Water: 'bg-blue-500',
  Grass: 'bg-green-500',
  Electric: 'bg-yellow-400',
  Psychic: 'bg-pink-500',
  Normal: 'bg-gray-400',
  Fighting: 'bg-red-700',
  Rock: 'bg-yellow-700',
  Ice: 'bg-cyan-300',
  Dragon: 'bg-indigo-700',
};

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
    // Deep copy to avoid shared state
    const cloneMove = (m: any) => ({ ...m });
    const cloneP = (p: Pokemon): Pokemon => ({ ...p, moves: p.moves.map(cloneMove) });
    onSelect(cloneP(selected), cloneP(opponent));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wider drop-shadow-lg">
        ⚡ Pokémon Battle
      </h1>
      <p className="text-red-200 mb-8 text-lg">Choose your Pokémon to fight!</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mb-8">
        {pokemons.map((pokemon) => {
          const isSelected = selected?.id === pokemon.id;
          return (
            <div
              key={pokemon.id}
              onClick={() => handleSelect(pokemon)}
              className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center transition-all duration-200
                ${isSelected
                  ? 'bg-white ring-4 ring-yellow-400 scale-105 shadow-2xl'
                  : 'bg-white/20 hover:bg-white/40 hover:scale-105 shadow-lg'
                }`}
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="w-20 h-20 object-contain drop-shadow-md"
              />
              <span className="text-white font-bold text-sm mt-1">{pokemon.name}</span>
              <span
                className={`text-xs text-white mt-1 px-2 py-0.5 rounded-full font-semibold ${typeColors[pokemon.type] ?? 'bg-gray-500'}`}
              >
                {pokemon.type}
              </span>
              <div className="text-xs text-red-100 mt-1">HP: {pokemon.maxHp}</div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleStart}
        disabled={!selected}
        className={`px-10 py-3 rounded-full text-lg font-extrabold tracking-wide shadow-xl transition-all duration-200
          ${selected
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-105 cursor-pointer'
            : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-60'
          }`}
      >
        {selected ? `Fight with ${selected.name}!` : 'Select a Pokémon'}
      </button>
    </div>
  );
};

export default SelectionScreen;
