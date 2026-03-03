import React, { useState, useCallback } from 'react';
import './App.css';
import SelectionScreen from './components/SelectionScreen';
import PokemonCard from './components/PokemonCard';
import GameLog from './components/GameLog';
import { Pokemon, Move } from './types/pokemon';

// Type effectiveness table (attacker type -> defender type -> multiplier)
const typeChart: Record<string, Record<string, number>> = {
  Fire:     { Grass: 2, Ice: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
  Water:    { Fire: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
  Grass:    { Water: 2, Rock: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Dragon: 0.5 },
  Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5 },
  Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5 },
  Fighting: { Normal: 2, Rock: 2, Ice: 2, Psychic: 0.5 },
  Ice:      { Grass: 2, Dragon: 2, Water: 0.5, Ice: 0.5 },
  Dragon:   { Dragon: 2 },
  Normal:   {},
  Rock:     { Fire: 2, Ice: 2, Flying: 2, Fighting: 0.5 },
};

function getEffectiveness(moveType: string, defenderType: string): number {
  return typeChart[moveType]?.[defenderType] ?? 1;
}

function calcDamage(attacker: Pokemon, defender: Pokemon, move: Move): number {
  const base = ((2 * 50) / 5 + 2) * move.power * (attacker.attack / defender.defense) / 50 + 2;
  const effectiveness = getEffectiveness(move.type, defender.type);
  const randomFactor = 0.85 + Math.random() * 0.15;
  return Math.max(1, Math.round(base * effectiveness * randomFactor));
}

type GamePhase = 'selection' | 'battle' | 'gameover';

const moveTypeColors: Record<string, string> = {
  Fire: 'bg-orange-500 hover:bg-orange-400',
  Water: 'bg-blue-500 hover:bg-blue-400',
  Grass: 'bg-green-500 hover:bg-green-400',
  Electric: 'bg-yellow-400 hover:bg-yellow-300 text-gray-900',
  Psychic: 'bg-pink-500 hover:bg-pink-400',
  Normal: 'bg-gray-500 hover:bg-gray-400',
  Fighting: 'bg-red-700 hover:bg-red-600',
  Rock: 'bg-yellow-700 hover:bg-yellow-600',
  Ice: 'bg-cyan-400 hover:bg-cyan-300 text-gray-900',
  Dragon: 'bg-indigo-700 hover:bg-indigo-600',
};

function App() {
  const [phase, setPhase] = useState<GamePhase>('selection');
  const [player, setPlayer] = useState<Pokemon | null>(null);
  const [opponent, setOpponent] = useState<Pokemon | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [opponentAttacking, setOpponentAttacking] = useState(false);
  const [playerHurt, setPlayerHurt] = useState(false);
  const [opponentHurt, setOpponentHurt] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, msg]);

  const handleStart = useCallback((p: Pokemon, o: Pokemon) => {
    setPlayer(p);
    setOpponent(o);
    setLogs([`A wild ${o.name} appeared!`, `Go! ${p.name}!`]);
    setPhase('battle');
    setWinner(null);
    setIsBusy(false);
  }, []);

  const handleMove = useCallback(
    async (move: Move) => {
      if (!player || !opponent || isBusy) return;
      if (move.pp <= 0) { addLog("No PP left for that move!"); return; }
      setIsBusy(true);

      // --- Player attacks ---
      const updatedPlayer = { ...player, moves: player.moves.map(m => m.name === move.name ? { ...m, pp: m.pp - 1 } : m) };
      setPlayer(updatedPlayer);

      const playerDmg = calcDamage(updatedPlayer, opponent, move);
      const effectiveness = getEffectiveness(move.type, opponent.type);
      let effText = '';
      if (effectiveness > 1) effText = ' It\'s super effective!';
      else if (effectiveness < 1) effText = ' It\'s not very effective...';

      setPlayerAttacking(true);
      await delay(300);
      setPlayerAttacking(false);
      setOpponentHurt(true);

      const newOpponentHp = Math.max(0, opponent.hp - playerDmg);
      const updatedOpponent = { ...opponent, hp: newOpponentHp };
      setOpponent(updatedOpponent);
      addLog(`${updatedPlayer.name} used ${move.name}! (${playerDmg} dmg)${effText}`);
      await delay(400);
      setOpponentHurt(false);

      if (newOpponentHp <= 0) {
        addLog(`${updatedOpponent.name} fainted! You win! 🎉`);
        setWinner('player');
        setPhase('gameover');
        setIsBusy(false);
        return;
      }

      // --- Opponent attacks (AI: pick random move with PP) ---
      await delay(600);
      const availableMoves = updatedOpponent.moves.filter(m => m.pp > 0);
      const aiMove = availableMoves.length > 0
        ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
        : updatedOpponent.moves[0];

      const updatedOpponentAfterAI = {
        ...updatedOpponent,
        moves: updatedOpponent.moves.map(m => m.name === aiMove.name ? { ...m, pp: m.pp - 1 } : m),
      };
      setOpponent(updatedOpponentAfterAI);

      const opponentDmg = calcDamage(updatedOpponentAfterAI, updatedPlayer, aiMove);
      const aiEffectiveness = getEffectiveness(aiMove.type, updatedPlayer.type);
      let aiEffText = '';
      if (aiEffectiveness > 1) aiEffText = ' It\'s super effective!';
      else if (aiEffectiveness < 1) aiEffText = ' It\'s not very effective...';

      setOpponentAttacking(true);
      await delay(300);
      setOpponentAttacking(false);
      setPlayerHurt(true);

      const newPlayerHp = Math.max(0, updatedPlayer.hp - opponentDmg);
      const finalPlayer = { ...updatedPlayer, hp: newPlayerHp };
      setPlayer(finalPlayer);
      addLog(`${updatedOpponentAfterAI.name} used ${aiMove.name}! (${opponentDmg} dmg)${aiEffText}`);
      await delay(400);
      setPlayerHurt(false);

      if (newPlayerHp <= 0) {
        addLog(`${finalPlayer.name} fainted! You lose... 😢`);
        setWinner('opponent');
        setPhase('gameover');
      }

      setIsBusy(false);
    },
    [player, opponent, isBusy]
  );

  const handleRestart = () => {
    setPhase('selection');
    setPlayer(null);
    setOpponent(null);
    setLogs([]);
    setWinner(null);
    setIsBusy(false);
  };

  if (phase === 'selection') {
    return <SelectionScreen onSelect={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-green-300 to-green-600 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
        {/* Battle field */}
        <div className="flex justify-between items-end px-4 min-h-52">
          {/* Opponent */}
          <div className="flex flex-col items-start">
            {opponent && (
              <PokemonCard
                pokemon={opponent}
                isPlayer={false}
                isAttacking={opponentAttacking}
                isHurt={opponentHurt}
              />
            )}
          </div>
          {/* Player */}
          <div className="flex flex-col items-end">
            {player && (
              <PokemonCard
                pokemon={player}
                isPlayer={true}
                isAttacking={playerAttacking}
                isHurt={playerHurt}
              />
            )}
          </div>
        </div>

        {/* Game log */}
        <GameLog messages={logs} />

        {/* Moves or Game Over */}
        {phase === 'gameover' ? (
          <div className="flex flex-col items-center gap-3">
            <div className={`text-2xl font-extrabold ${winner === 'player' ? 'text-yellow-300' : 'text-red-300'}`}>
              {winner === 'player' ? '🏆 Victory!' : '💀 Defeat!'}
            </div>
            <button
              onClick={handleRestart}
              className="px-8 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {player?.moves.map((move) => (
              <button
                key={move.name}
                onClick={() => handleMove(move)}
                disabled={isBusy || move.pp <= 0}
                className={`rounded-xl px-4 py-3 text-white font-bold text-sm text-left transition-all duration-150 shadow-md
                  ${move.pp > 0 && !isBusy
                    ? moveTypeColors[move.type] ?? 'bg-gray-600 hover:bg-gray-500'
                    : 'bg-gray-600 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span>{move.name}</span>
                  <span className="text-xs opacity-75">{move.pp}/{move.maxPp}</span>
                </div>
                <div className="text-xs opacity-75 mt-0.5">
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

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default App;
