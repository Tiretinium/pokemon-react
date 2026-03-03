/**
 * Script to fetch Pokemon data from PokeAPI and generate pokemons.ts
 * Usage: node scripts/fetchPokemons.mjs
 *
 * You can edit POKEMON_IDS to fetch any pokemon you want!
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✏️ Change this number to fetch more or fewer Pokemon (max: 1025)
const POKEMON_LIMIT = 1025; // e.g. 151 = Gen 1, 251 = Gen 1+2, 1025 = all

// Valid types in our app
const VALID_TYPES = new Set([
  'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Normal',
  'Fighting', 'Rock', 'Ice', 'Dragon', 'Ghost', 'Poison',
  'Ground', 'Flying', 'Bug', 'Steel', 'Dark',
]);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function mapType(apiType) {
  const capitalized = capitalize(apiType);
  // Map types not in our union to 'Normal'
  return VALID_TYPES.has(capitalized) ? capitalized : 'Normal';
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function fetchMoveDetails(moveUrl) {
  const data = await fetchJSON(moveUrl);
  const power = data.power ?? 50; // default power if null (status moves)
  const pp = data.pp ?? 10;
  const type = mapType(data.type.name);  const name = data.names?.find(n => n.language.name === 'fr')?.name
    ?? data.names?.find(n => n.language.name === 'en')?.name
    ?? data.name.split('-').map(capitalize).join(' ');
  return { name, power, type, pp };
}

async function fetchPokemon(idOrName) {
  console.log(`Fetching pokemon #${idOrName}...`);
  const data = await fetchJSON(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);

  // Pick the primary type
  const primaryType = mapType(data.types[0].type.name);

  // Stats
  const getstat = (statName) =>
    data.stats.find(s => s.stat.name === statName)?.base_stat ?? 50;

  const hp = getstat('hp');
  const attack = getstat('attack');
  const defense = getstat('defense');
  const speed = getstat('speed');

  // Pick up to 4 moves that have actual power (attacking moves)
  // Filter: moves with power > 0, sort by power descending, take top 4
  const movesWithPower = data.moves
    .filter(m => m.version_group_details.length > 0)
    .slice(0, 20); // limit API calls – check first 20 moves

  const moveDetails = [];
  for (const moveEntry of movesWithPower) {
    if (moveDetails.length >= 4) break;
    try {
      const detail = await fetchMoveDetails(moveEntry.move.url);
      if (detail.power > 0) {
        moveDetails.push({
          name: detail.name,
          power: detail.power,
          type: detail.type,
          pp: detail.pp,
          maxPp: detail.pp,
        });
      }
    } catch (e) {
      // skip broken move
    }
  }

  // Fallback if not enough moves found
  while (moveDetails.length < 4) {
    moveDetails.push({ name: 'Tackle', power: 40, type: 'Normal', pp: 35, maxPp: 35 });
  }
  // French name (fallback: English, then raw name)
  const speciesData = await fetchJSON(data.species.url);
  const frenchName = speciesData.names.find(n => n.language.name === 'fr')?.name
    ?? speciesData.names.find(n => n.language.name === 'en')?.name
    ?? capitalize(data.name);

  return {
    id: data.id,
    name: frenchName,
    type: primaryType,
    hp,
    maxHp: hp,
    attack,
    defense,
    speed,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
    backSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${data.id}.png`,
    moves: moveDetails,
  };
}

function generateTypeScriptFile(pokemons) {
  const lines = [
    `import { Pokemon } from '../types/pokemon';`,
    ``,
    `export const pokemons: Pokemon[] = [`,
  ];

  for (const p of pokemons) {
    lines.push(`  {`);
    lines.push(`    id: ${p.id},`);
    lines.push(`    name: '${p.name}',`);
    lines.push(`    type: '${p.type}',`);
    lines.push(`    hp: ${p.hp},`);
    lines.push(`    maxHp: ${p.maxHp},`);
    lines.push(`    attack: ${p.attack},`);
    lines.push(`    defense: ${p.defense},`);
    lines.push(`    speed: ${p.speed},`);
    lines.push(`    sprite: '${p.sprite}',`);
    lines.push(`    backSprite: '${p.backSprite}',`);
    lines.push(`    moves: [`);
    for (const m of p.moves) {
      lines.push(`      { name: '${m.name}', power: ${m.power}, type: '${m.type}', pp: ${m.pp}, maxPp: ${m.maxPp} },`);
    }
    lines.push(`    ],`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  return lines.join('\n');
}

async function main() {
  console.log(`\n🚀 Fetching the first ${POKEMON_LIMIT} Pokemon from PokeAPI...\n`);

  // Fetch the full list from the API (no manual IDs needed!)
  const listData = await fetchJSON(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}&offset=0`);
  const pokemonList = listData.results; // [{ name, url }, ...]

  console.log(`📋 Found ${pokemonList.length} Pokemon to fetch.\n`);

  const pokemons = [];
  for (let i = 0; i < pokemonList.length; i++) {
    const { name } = pokemonList[i];
    try {
      const pokemon = await fetchPokemon(name);
      pokemons.push(pokemon);
      console.log(`  [${i + 1}/${pokemonList.length}] ✅ ${pokemon.name} (${pokemon.type}) - ${pokemon.moves.map(m => m.name).join(', ')}`);
    } catch (e) {
      console.error(`  [${i + 1}/${pokemonList.length}] ❌ Failed to fetch ${name}:`, e.message);
    }
  }

  const outputPath = path.resolve(__dirname, '../src/data/pokemons.ts');
  const content = generateTypeScriptFile(pokemons);
  fs.writeFileSync(outputPath, content, 'utf-8');

  console.log(`\n✨ Done! Generated ${pokemons.length} Pokemon.`);
  console.log(`📄 File written to: ${outputPath}\n`);
}

main();
