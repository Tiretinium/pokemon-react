import React from 'react';
import SelectionScreen from '../components/SelectionScreen';
import PokemonCard from '../components/PokemonCard';
import GameLog from '../components/GameLog';
import { useBattle } from '../hooks/useBattle';

export default function HomePage() {
  const {
    phase, player, opponent, logs, isBusy, winner,
    playerAttacking, opponentAttacking, playerHurt, opponentHurt,
    startBattle, handleMove, restart,
  } = useBattle();

  if (phase === 'selection') {
    return <SelectionScreen onSelect={startBattle} />;
  }

  return (
    <div className="battle-page">
      <div className="battle-arena">

        {/* Terrain de combat */}
        <div className="battle-field">
          <div>
            {opponent && (
              <PokemonCard pokemon={opponent} isPlayer={false}
                isAttacking={opponentAttacking} isHurt={opponentHurt} />
            )}
          </div>
          <div>
            {player && (
              <PokemonCard pokemon={player} isPlayer={true}
                isAttacking={playerAttacking} isHurt={playerHurt} />
            )}
          </div>
        </div>

        {/* Journal de combat */}
        <GameLog messages={logs} />

        {/* Attaques ou Game Over */}
        {phase === 'gameover' ? (
          <div className="gameover">
            <div className={`gameover__title ${winner === 'player' ? 'gameover__title--win' : 'gameover__title--lose'}`}>
              {winner === 'player' ? '🏆 Victoire !' : '💀 Défaite !'}
            </div>
            <button onClick={restart} className="gameover__btn">
              Rejouer
            </button>
          </div>
        ) : (
          <div className="battle-moves">
            {player?.moves.map((move) => (
              <button
                key={move.name}
                onClick={() => handleMove(move)}
                disabled={isBusy || move.pp <= 0}
                className={`move-btn move-${move.type}`}
              >
                <div className="move-btn__header">
                  <span>{move.name}</span>
                  <span className="move-btn__pp">{move.pp}/{move.maxPp}</span>
                </div>
                <div className="move-btn__meta">
                  {move.type} · PWR {move.power}
                </div>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
