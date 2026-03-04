import React from 'react';
import { Pokemon, Move } from '../types/pokemon';
import { pokemons } from '../data/pokemons';

interface SelectionScreenProps {
  onSelect: (player: Pokemon, opponent: Pokemon) => void;
}

type Step = 'pokemon' | 'moves';

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  const [step, setStep] = React.useState<Step>('pokemon');
  const [selected, setSelected] = React.useState<Pokemon | null>(null);
  const [selectedMoves, setSelectedMoves] = React.useState<Move[]>([]);

  const handleSelect = (pokemon: Pokemon) => {
    setSelected(pokemon);
    setSelectedMoves([]);
  };

  const handleGoToMoves = () => {
    if (!selected) return;
    // If the pokemon has 4 or fewer moves, skip the move selection step
    if (selected.moves.length <= 4) {
      handleStartWithMoves(selected.moves);
    } else {
      setStep('moves');
    }
  };

  const toggleMove = (move: Move) => {
    setSelectedMoves((prev) => {
      const already = prev.find((m) => m.name === move.name);
      if (already) return prev.filter((m) => m.name !== move.name);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, move];
    });
  };

  const handleStartWithMoves = (moves: Move[]) => {
    if (!selected) return;
    const others = pokemons.filter((p) => p.id !== selected.id);
    const opponent = others[Math.floor(Math.random() * others.length)];
    const cloneMove = (m: Move) => ({ ...m });
    const playerWithMoves: Pokemon = { ...selected, moves: moves.map(cloneMove) };
    const cloneP = (p: Pokemon): Pokemon => ({ ...p, moves: p.moves.map(cloneMove) });
    // Opponent keeps its first 4 moves (AI)
    const opponentClone: Pokemon = { ...cloneP(opponent), moves: opponent.moves.slice(0, 4).map(cloneMove) };
    onSelect(playerWithMoves, opponentClone);
  };

  const handleStart = () => {
    handleStartWithMoves(selectedMoves);
  };

  const handleBack = () => {
    setStep('pokemon');
    setSelectedMoves([]);
  };

  // ── Step 1: choose a Pokémon ──────────────────────────────────────────────
  if (step === 'pokemon') {
    return (
      <div className="selection">
        <h1 className="selection__title"> Pokémon Battle</h1>
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

        <div className={`selection__btn-wrapper${selected ? ' visible' : ''}`}>
          <button
            onClick={handleGoToMoves}
            disabled={!selected}
            className={`selection__btn ${selected ? 'ready' : 'disabled'}`}
          >
            {selected ? `⚔️ Choisir les attaques de ${selected.name} !` : 'Sélectionne un Pokémon'}
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2: choose 4 moves ────────────────────────────────────────────────
  return (
    <div className="selection selection--moves">
      <button className="selection__back-btn" onClick={handleBack}>← Retour</button>
      <div className="selection__moves-header">
        <img
          src={selected!.sprite}
          alt={selected!.name}
          className="selection__moves-sprite"
        />
        <div>
          <h1 className="selection__title">{selected!.name}</h1>
          <p className="selection__subtitle">
            Choisis <strong>4 attaques</strong> pour le combat&nbsp;
            <span className={`selection__moves-count${selectedMoves.length === 4 ? ' full' : ''}`}>
              ({selectedMoves.length}/4)
            </span>
          </p>
        </div>
      </div>

      <div className="moves-grid">
        {selected!.moves.map((move) => {
          const isChosen = selectedMoves.find((m) => m.name === move.name);
          const isDisabled = !isChosen && selectedMoves.length >= 4;
          return (
            <div
              key={move.name}
              onClick={() => !isDisabled && toggleMove(move)}
              className={`move-card${isChosen ? ' chosen' : ''}${isDisabled ? ' move-card--disabled' : ''}`}
            >
              <div className="move-card__name">{move.name}</div>
              <div className="move-card__info">
                <span className={`type-badge type-${move.type}`}>{move.type}</span>
                <span className="move-card__power">⚡ {move.power}</span>
                <span className="move-card__pp">PP: {move.pp}</span>
              </div>
              {isChosen && (
                <div className="move-card__check">✓</div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`selection__btn-wrapper${selectedMoves.length === 4 ? ' visible' : ''}`}>
        <button
          onClick={handleStart}
          disabled={selectedMoves.length !== 4}
          className={`selection__btn ${selectedMoves.length === 4 ? 'ready' : 'disabled'}`}
        >
          {selectedMoves.length === 4 ? ` Lancer le combat !` : `Sélectionne 4 attaques (${selectedMoves.length}/4)`}
        </button>
      </div>
    </div>
  );
};

export default SelectionScreen;
