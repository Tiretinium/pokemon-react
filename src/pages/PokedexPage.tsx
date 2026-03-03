import React from 'react';
import { pokemons } from '../data/pokemons';

export default function PokedexPage() {
  return (
    <div className="pokedex-page">
      <h1 className="pokedex-page__title">Pokédex</h1>
      <div className="pokedex-grid">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokedex-card">
            <span className="pokedex-card__id">#{String(pokemon.id).padStart(3, '0')}</span>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <h2 className="pokedex-card__name">{pokemon.name}</h2>
            <span className={`type-badge type-${pokemon.type}`}>{pokemon.type}</span>

            <div className="pokedex-card__stats">
              <div className="pokedex-card__stat-row"><span> HP</span><span>{pokemon.maxHp}</span></div>
              <div className="pokedex-card__stat-row"><span> ATK</span><span>{pokemon.attack}</span></div>
              <div className="pokedex-card__stat-row"><span> DEF</span><span>{pokemon.defense}</span></div>
              <div className="pokedex-card__stat-row"><span> SPD</span><span>{pokemon.speed}</span></div>
            </div>

            <div className="pokedex-card__moves">
              <p className="pokedex-card__moves-label">Attaques :</p>
              <div className="pokedex-card__moves-list">
                {pokemon.moves.map((move) => (
                  <span key={move.name} className={`pokedex-card__move-tag type-${move.type}`}>
                    {move.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
