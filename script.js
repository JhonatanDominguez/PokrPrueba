// Sugierencias y mejoras:

// 1. Constantes: Mueva las constantes al principio del archivo para una mejor organización.
// 2. Funciones: Agrupe las funciones relacionadas con la renderización y la lógica de negocio.
// 3. Manejo de errores: Utilice un solo bloque catch para manejar todos los errores.
// 4. Mejora la legibilidad: Utilice nombres de variables y funciones descriptivos.

const MAX_POKEMON = 3;
const POKE_API_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon/';
const POKE_CONTAINER_ID = 'poke-container';
const ADD_POKEMON_BTN_ID = 'add-pokemon-btn';
const CLEAR_TEAM_BTN_ID = 'clear-team-btn';

let pokemonTeam = [];

/**
 * Funciones de renderización
 */

/**
 * Renderiza una tarjeta de Pokémon
 * @param {Object} pokeData Datos del Pokémon
 */
function renderPokemon(pokeData) {
  const allPokemonContainer = document.getElementById(POKE_CONTAINER_ID);
  const pokeContainer = document.createElement('div');
  pokeContainer.className = 'poke-card';
  const pokeName = document.createElement('h4');
  pokeName.innerText = pokeData.name;
  const pokeNumber = document.createElement('p');
  pokeNumber.innerText = `#${pokeData.id}`;
  const pokeTypes = document.createElement('ul');
  createTypes(pokeData.types, pokeTypes);
  pokeContainer.append(pokeName, pokeNumber, pokeTypes);
  allPokemonContainer.appendChild(pokeContainer);
  let pokeImage = document.createElement('img');
  pokeImage.src = pokeData.sprites.front_default;
  pokeImage.alt = `Pokemon ${pokeData.name} image`;
  pokeContainer.append(pokeImage, pokeName, pokeNumber, pokeTypes);
}

/**
 * Crea una lista de tipos de Pokémon
 * @param {Array<Object>} types Tipos de Pokémon
 * @param {HTMLUListElement} ul Elemento de lista
 */
function createTypes(types, ul) {
  types.forEach((type) => {
    const li = document.createElement('li');
    li.innerText = type.type.name;
    ul.appendChild(li);
  });
}

/**
 * Funciones de lógica de negocio
 */

/**
 * Agrega un Pokémon al equipo
 * @param {string} pokemonName Nombre del Pokémon
 */
function addPokemonToTeam(pokemonName) {
  if (pokemonTeam.length < MAX_POKEMON) {
    fetch(`${POKE_API_ENDPOINT}${pokemonName}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se encontró el Pokémon: ${pokemonName}`);
          
        }
        return response.json();
      })
      .then((data) => {
        pokemonTeam.push(data);
        renderPokemon(data);
        return fetch(data.sprites.front_default);
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  } else {
    alert(`No es posible agregar más pokémon. El equipo está completo.`);
  }
}

/**
 * Limpia el equipo de Pokémon
 */
function clearTeam() {
  pokemonTeam = [];
  document.getElementById(POKE_CONTAINER_ID).innerHTML = '';
}

/**
 * Event listeners
 */

document.getElementById(ADD_POKEMON_BTN_ID).addEventListener('click', () => {
  const pokemonInput = document.getElementById('pokemon-input').value;
  addPokemonToTeam(pokemonInput);
});

document.getElementById(CLEAR_TEAM_BTN_ID).addEventListener('click', clearTeam);