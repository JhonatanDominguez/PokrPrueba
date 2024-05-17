// Constantes
const MAX_POKEMON = 3; // Máximo número de Pokémon permitidos en el equipo
const POKE_API_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon/'; // Endpoint de la API de Pokémon
const POKE_CONTAINER_ID = 'poke-container'; // ID del contenedor de Pokémon
const ADD_POKEMON_BTN_ID = 'add-pokemon-btn'; // ID del botón para agregar Pokémon
const CLEAR_TEAM_BTN_ID = 'clear-team-btn'; // ID del botón para limpiar el equipo
const POKE_HISTORY_ID = 'poke-history'; // ID del contenedor del historial de equipos

// Variables para almacenar el equipo de Pokémon actual e historial
let pokemonTeam = []; // Array para almacenar el equipo de Pokémon actual
let pokemonHistory = []; // Array para almacenar el historial de equipos de Pokémon

/**
 * Funciones de renderización
 */

/**
 * Renderiza una tarjeta de Pokémon
 * @param {Object} pokeData Datos del Pokémon
 * @param {HTMLElement} container Contenedor donde se renderizará el Pokémon
 */
function renderPokemon(pokeData, container) {
  const pokeContainer = document.createElement('div'); // Crea un div para la tarjeta de Pokémon
  pokeContainer.className = 'poke-card'; // Asigna la clase 'poke-card' al div

  const pokeName = document.createElement('h4'); // Crea un elemento h4 para el nombre del Pokémon
  pokeName.innerText = pokeData.name; // Establece el texto del h4 como el nombre del Pokémon

  const pokeNumber = document.createElement('p'); // Crea un elemento p para el número del Pokémon
  pokeNumber.innerText = `#${pokeData.id}`; // Establece el texto del p como el ID del Pokémon

  const pokeTypes = document.createElement('ul'); // Crea un elemento ul para los tipos de Pokémon
  createTypes(pokeData.types, pokeTypes); // Llama a createTypes para llenar el ul con los tipos

  const pokeImage = document.createElement('img'); // Crea un elemento img para la imagen del Pokémon
  pokeImage.src = pokeData.sprites.front_default; // Establece la fuente de la imagen
  pokeImage.alt = `Pokemon ${pokeData.name} image`; // Establece el texto alternativo de la imagen

  pokeContainer.append(pokeImage, pokeName, pokeNumber, pokeTypes); // Añade los elementos al contenedor de la tarjeta
  container.appendChild(pokeContainer); // Añade la tarjeta de Pokémon al contenedor especificado
}

/**
 * Crea una lista de tipos de Pokémon
 * @param {Array<Object>} types Tipos de Pokémon
 * @param {HTMLUListElement} ul Elemento de lista
 */
function createTypes(types, ul) {
  types.forEach((type) => { // Itera sobre cada tipo en el array de tipos
    const li = document.createElement('li'); // Crea un elemento li para cada tipo
    li.innerText = type.type.name; // Establece el texto del li como el nombre del tipo
    ul.appendChild(li); // Añade el li al ul
  });
}

/**
 * Agrega un Pokémon al equipo
 * @param {string} pokemonName Nombre del Pokémon
 */
function addPokemonToTeam(pokemonName) {
  if (pokemonTeam.length < MAX_POKEMON) { // Verifica si el equipo aún no ha alcanzado el máximo permitido
    fetch(`${POKE_API_ENDPOINT}${pokemonName}/`) // Realiza una solicitud a la API para obtener datos del Pokémon
      .then((response) => {
        if (!response.ok) { // Si la respuesta no es OK, lanza un error
          throw new Error(`No se encontró el Pokémon: ${pokemonName}`);
        }
        return response.json(); // Convierte la respuesta en formato JSON
      })
      .then((data) => {
        pokemonTeam.push(data); // Añade los datos del Pokémon al equipo
        renderPokemon(data, document.getElementById(POKE_CONTAINER_ID)); // Renderiza la tarjeta del Pokémon en el contenedor principal
        if (pokemonTeam.length === MAX_POKEMON) { // Si el equipo ha alcanzado el máximo permitido
          updatePokemonHistory(pokemonTeam); // Actualiza el historial de equipos
        }
      })
      .catch((error) => {
        console.error(error); // Muestra el error en la consola
        alert(error.message); // Muestra una alerta con el mensaje de error
      });
  } else {
    alert(`No es posible agregar más pokémon. El equipo está completo.`); // Muestra una alerta si el equipo ya está completo
  }
}

/**
 * Actualiza el historial de Pokémon
 * @param {Array<Object>} team Equipo de Pokémon
 */
function updatePokemonHistory(team) {
  pokemonHistory.push([...team]); // Guarda una copia del equipo actual en el historial
  renderPokemonHistory(); // Renderiza el historial de equipos
}

/**
 * Renderiza el historial de Pokémon
 */
function renderPokemonHistory() {
  const historyContainer = document.getElementById(POKE_HISTORY_ID); // Obtiene el contenedor del historial
  if (!historyContainer) { // Verifica si el contenedor existe
    console.error(`No se encontró el contenedor del historial con el ID ${POKE_HISTORY_ID}`); // Muestra un error si el contenedor no existe
    return; // Sale de la función si no se encuentra el contenedor
  }
  historyContainer.innerHTML = ''; // Limpia el contenido previo del historial
  pokemonHistory.forEach((team, index) => { // Itera sobre cada equipo en el historial
    const teamContainer = document.createElement('div'); // Crea un div para cada equipo
    teamContainer.className = 'team-container'; // Asigna la clase 'team-container' al div

    const teamTitle = document.createElement('h5'); // Crea un elemento h5 para el título del equipo
    teamTitle.innerText = `Equipo ${index + 1}`; // Establece el texto del h5 como el número del equipo

    teamContainer.appendChild(teamTitle); // Añade el título al contenedor del equipo
    team.forEach((pokemon) => { // Itera sobre cada Pokémon en el equipo
      renderPokemon(pokemon, teamContainer); // Renderiza la tarjeta del Pokémon en el contenedor del equipo
    });
    historyContainer.appendChild(teamContainer); // Añade el contenedor del equipo al contenedor del historial
  });
}

/**
 * Limpia el equipo de Pokémon
 */
function clearTeam() {
  pokemonTeam = []; // Limpia el array del equipo de Pokémon
  document.getElementById(POKE_CONTAINER_ID).innerHTML = ''; // Limpia el contenido del contenedor principal
}

/**
 * Event listeners
 */
document.getElementById(ADD_POKEMON_BTN_ID).addEventListener('click', () => {
  const pokemonInput = document.getElementById('pokemon-input').value; // Obtiene el valor del input de Pokémon
  addPokemonToTeam(pokemonInput); // Llama a la función para agregar un Pokémon al equipo
});

document.getElementById(CLEAR_TEAM_BTN_ID).addEventListener('click', clearTeam); // Añade un listener para limpiar el equipo
