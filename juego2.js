let timer = 10;
let countdown;
const timerElement = document.getElementById('timer');
const board = document.getElementById('board');
const clickCounts = [];
const botCount = 39;
const playerSelections = {};
let selectedCellIndex = null;

function createBoard() {
    for (let i = 1; i <= 16; i++) { // Cambiado a 1 a 16
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        clickCounts.push(0);
    }
}

function startCountdown() {
    countdown = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer === 0) {
            clearInterval(countdown);
            endRound();
        }
    }, 1000);
}

function resetGame() {
    clearInterval(countdown);
    timer = 10;
    timerElement.textContent = timer;
    clickCounts.fill(0);
    selectedCellIndex = null;
    Object.keys(playerSelections).forEach(key => playerSelections[key] = null);
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('selected');
        cell.textContent = '';
    });
    document.getElementById('winner-list').innerHTML = '';
    startCountdown();
    startBots();
}

function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;
    if (selectedCellIndex !== null) {
        document.querySelector(`.cell[data-index='${selectedCellIndex}']`).classList.remove('selected');
    }
    if (selectedCellIndex === cellIndex) {
        selectedCellIndex = null;
        playerSelections['yo'] = null;
    } else {
        selectedCellIndex = cellIndex;
        playerSelections['yo'] = cellIndex;
        clickCounts[cellIndex - 1]++; // Ajustado índice
        event.target.classList.add('selected');
    }
}

function botSelectCell(botNumber) {
    const randomIndex = Math.floor(Math.random() * 16) + 1; // Ajustado a 1-16
    clickCounts[randomIndex - 1]++;
    playerSelections[`bot${botNumber}`] = randomIndex;
}

function endRound() {
    // Filtrar las casillas con al menos una selección
    const selectedCells = clickCounts.map((count, index) => ({ index: index + 1, count })).filter(cell => cell.count > 0);

    // Encontrar el mínimo número de clics entre las casillas seleccionadas
    const minClicks = Math.min(...selectedCells.map(cell => cell.count));

    // Mostrar el número de clics en cada casilla
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = clickCounts[index];
    });

    // Determinar qué jugadores han seleccionado las casillas mínimas
    const winningPlayers = [];
    for (const [player, cellIndex] of Object.entries(playerSelections)) {
        if (cellIndex && clickCounts[cellIndex - 1] === minClicks && minClicks > 0) {
            winningPlayers.push(player === 'yo' ? 'Tú' : `Bot ${player.replace('bot', '')}`);
        }
    }

    // Mostrar los ganadores en la lista a la derecha
    const winnerList = document.getElementById('winner-list');
    winnerList.innerHTML = '';
    if (winningPlayers.length > 0) {
        winningPlayers.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = player;
            winnerList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'No hay ganadores en esta ronda.';
        winnerList.appendChild(listItem);
    }
}

document.getElementById('reset-button').addEventListener('click', resetGame);

function startBots() {
    for (let i = 1; i <= botCount; i++) {
        setTimeout(() => botSelectCell(i), Math.random() * 10000);
    }
}

createBoard();
startCountdown();
startBots();


