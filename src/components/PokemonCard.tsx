import React from 'react';
import { Pokemon } from '../types/pokemon';

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

interface PokemonCardProps {
  pokemon: Pokemon;
  isPlayer: boolean;
  isAttacking?: boolean;
  isHurt?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, isPlayer, isAttacking, isHurt }) => {
  const hpPercent = Math.max(0, (pokemon.hp / pokemon.maxHp) * 100);
  const hpColor =
    hpPercent > 50 ? 'bg-green-400' : hpPercent > 20 ? 'bg-yellow-400' : 'bg-red-500';

  return (
    <div
      className={`flex flex-col ${isPlayer ? 'items-start' : 'items-end'} gap-1 transition-transform duration-150
        ${isAttacking ? (isPlayer ? 'translate-x-8' : '-translate-x-8') : ''}
        ${isHurt ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {/* Info box */}
      <div className={`bg-white/90 rounded-xl px-4 py-2 shadow-lg w-52 ${isPlayer ? 'order-1' : 'order-1'}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-extrabold text-gray-800 text-base">{pokemon.name}</span>
          <span className={`text-xs text-white px-2 py-0.5 rounded-full font-semibold ${typeColors[pokemon.type] ?? 'bg-gray-500'}`}>
            {pokemon.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${hpColor}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-600 whitespace-nowrap">
            {Math.max(0, pokemon.hp)}/{pokemon.maxHp}
          </span>
        </div>
      </div>

      {/* Sprite */}
      <div className={`${isPlayer ? 'order-2' : 'order-2'}`}>
        <img
          src={isPlayer ? pokemon.backSprite : pokemon.sprite}
          alt={pokemon.name}
          className={`drop-shadow-xl object-contain ${isPlayer ? 'w-36 h-36' : 'w-28 h-28'}`}
          style={{ imageRendering: isPlayer ? 'pixelated' : 'auto' }}
        />
      </div>
    </div>
  );
};

export default PokemonCard;
