import React from 'react';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  isPlayer: boolean;
  isAttacking?: boolean;
  isHurt?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, isPlayer, isAttacking, isHurt }) => {
  const hpPercent = Math.max(0, (pokemon.hp / pokemon.maxHp) * 100);
  const hpFillClass =
    hpPercent > 50 ? 'pcard__hp-fill--high'
    : hpPercent > 20 ? 'pcard__hp-fill--medium'
    : 'pcard__hp-fill--low';

  const cardClass = [
    'pcard',
    isPlayer ? 'pcard--player' : 'pcard--opponent',
    isAttacking ? (isPlayer ? 'pcard--attacking-player' : 'pcard--attacking-opponent') : '',
    isHurt ? 'pcard--hurt' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      <div className="pcard__info">
        <div className="pcard__header">
          <span className="pcard__name">{pokemon.name}</span>
          <span className={`type-badge type-${pokemon.type}`}>{pokemon.type}</span>
        </div>
        <div className="pcard__hp-bar-wrap">
          <div className="pcard__hp-track">
            <div
              className={`pcard__hp-fill ${hpFillClass}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="pcard__hp-text">
            {Math.max(0, pokemon.hp)}/{pokemon.maxHp}
          </span>
        </div>
      </div>
      <div className={`pcard__sprite ${isPlayer ? 'pcard__sprite--player' : 'pcard__sprite--opponent'}`}>
        <img
          src={isPlayer ? pokemon.backSprite : pokemon.sprite}
          alt={pokemon.name}
        />
      </div>
    </div>
  );
};

export default PokemonCard;
