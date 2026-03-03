import { useState, useCallback } from 'react';
import { Pokemon, Move } from '../types/pokemon';

// ─── Type chart ──────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getEffectiveness(moveType: string, defenderType: string): number {
  return typeChart[moveType]?.[defenderType] ?? 1;
}

function calcDamage(attacker: Pokemon, defender: Pokemon, move: Move): number {
  const base =
    (((2 * 50) / 5 + 2) * move.power * (attacker.attack / defender.defense)) / 50 + 2;
  const effectiveness = getEffectiveness(move.type, defender.type);
  const randomFactor = 0.85 + Math.random() * 0.15;
  return Math.max(1, Math.round(base * effectiveness * randomFactor));
}

function effectivenessText(multiplier: number): string {
  if (multiplier > 1) return " Vous infligez des dégâts supplémentaires car le type de l'ennemi est vulnérable !";
  if (multiplier < 1) return "Mon reuf c'est pas très efficace...";
  return '';
}

function pickAiMove(pokemon: Pokemon): Move {
  const available = pokemon.moves.filter((m) => m.pp > 0);
  const pool = available.length > 0 ? available : pokemon.moves;
  return pool[Math.floor(Math.random() * pool.length)];
}

function spendPp(pokemon: Pokemon, moveName: string): Pokemon {
  return {
    ...pokemon,
    moves: pokemon.moves.map((m) =>
      m.name === moveName ? { ...m, pp: m.pp - 1 } : m
    ),
  };
}

function applyDamage(pokemon: Pokemon, dmg: number): Pokemon {
  return { ...pokemon, hp: Math.max(0, pokemon.hp - dmg) };
}

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type GamePhase = 'selection' | 'battle' | 'gameover';

export interface BattleState {
  phase: GamePhase;
  player: Pokemon | null;
  opponent: Pokemon | null;
  logs: string[];
  isBusy: boolean;
  winner: 'player' | 'opponent' | null;
  playerAttacking: boolean;
  opponentAttacking: boolean;
  playerHurt: boolean;
  opponentHurt: boolean;
}

export interface BattleActions {
  startBattle: (player: Pokemon, opponent: Pokemon) => void;
  handleMove: (move: Move) => void;
  restart: () => void;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useBattle(): BattleState & BattleActions {
  const [phase, setPhase] = useState<GamePhase>('selection');
  const [player, setPlayer] = useState<Pokemon | null>(null);
  const [opponent, setOpponent] = useState<Pokemon | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [opponentAttacking, setOpponentAttacking] = useState(false);
  const [playerHurt, setPlayerHurt] = useState(false);
  const [opponentHurt, setOpponentHurt] = useState(false);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  // ── Start ──────────────────────────────────────────────────────────────────
  const startBattle = useCallback((p: Pokemon, o: Pokemon) => {
    setPlayer(p);
    setOpponent(o);
    setLogs([`Un ${o.name} sauvage apparaît !`, `Allez ! ${p.name} !`]);
    setPhase('battle');
    setWinner(null);
    setIsBusy(false);
  }, []);
  // ── Player turn ───────────────────────────────────────────────────────────
  const handleMove = useCallback(
    async (move: Move) => {
      if (!player || !opponent || isBusy) return;
      if (move.pp <= 0) { addLog('Plus de PP pour cette attaque !'); return; }
      setIsBusy(true);

      // 1. Player attacks
      const attackingPlayer = spendPp(player, move.name);
      setPlayer(attackingPlayer);

      const playerDmg = calcDamage(attackingPlayer, opponent, move);
      const effMultiplier = getEffectiveness(move.type, opponent.type);

      setPlayerAttacking(true);
      await delay(300);
      setPlayerAttacking(false);
      setOpponentHurt(true);

      const damagedOpponent = applyDamage(opponent, playerDmg);
      setOpponent(damagedOpponent);
      addLog(`${attackingPlayer.name} utilise ${move.name} ! (${playerDmg} dégâts)${effectivenessText(effMultiplier)}`);
      await delay(400);
      setOpponentHurt(false);

      // 2. Check opponent fainted
      if (damagedOpponent.hp <= 0) {
        addLog(`${damagedOpponent.name} est K.O. ! Vous avez gagné ! 🎉`);
        setWinner('player');
        setPhase('gameover');
        setIsBusy(false);
        return;
      }

      // 3. Opponent turn (AI)
      await delay(600);
      const aiMove = pickAiMove(damagedOpponent);
      const attackingOpponent = spendPp(damagedOpponent, aiMove.name);
      setOpponent(attackingOpponent);

      const opponentDmg = calcDamage(attackingOpponent, attackingPlayer, aiMove);
      const aiEffMultiplier = getEffectiveness(aiMove.type, attackingPlayer.type);

      setOpponentAttacking(true);
      await delay(300);
      setOpponentAttacking(false);
      setPlayerHurt(true);

      const damagedPlayer = applyDamage(attackingPlayer, opponentDmg);
      setPlayer(damagedPlayer);
      addLog(`${attackingOpponent.name} utilise ${aiMove.name} ! (${opponentDmg} dégâts)${effectivenessText(aiEffMultiplier)}`);
      await delay(400);
      setPlayerHurt(false);

      // 4. Check player fainted
      if (damagedPlayer.hp <= 0) {
        addLog(`${damagedPlayer.name} est K.O. ! Vous avez perdu... 😢`);
        setWinner('opponent');
        setPhase('gameover');
      }

      setIsBusy(false);
    },
    [player, opponent, isBusy]
  );

  // ── Restart ───────────────────────────────────────────────────────────────
  const restart = useCallback(() => {
    setPhase('selection');
    setPlayer(null);
    setOpponent(null);
    setLogs([]);
    setWinner(null);
    setIsBusy(false);
  }, []);

  return {
    phase, player, opponent, logs, isBusy, winner,
    playerAttacking, opponentAttacking, playerHurt, opponentHurt,
    startBattle, handleMove, restart,
  };
}
