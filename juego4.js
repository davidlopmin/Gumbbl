document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const playButton = document.getElementById('playButton');
    const fichasElement = document.getElementById('fichas');

    let playerRole;
    let playerChoice;
    let botChoice;
    let timer;
    let fichas = 100;

    const initializeGame = () => {
        playerRole = Math.random() < 0.5 ? 1 : 2;
        playerChoice = null;
        botChoice = null;

        message.textContent = `You are Player ${playerRole}.`;
        updateCellColors();
        cells.forEach(cell => cell.addEventListener('click', handleClick));
        playButton.style.display = 'none';

        timer = setTimeout(() => {
            if (playerChoice === null) {
                message.textContent = 'Time\'s up! LOSE';
                updateFichas(false);
                endGame();
            }
        }, 10000);
    };

    const updateCellColors = () => {
        cells.forEach(cell => cell.classList.remove('blue', 'red', 'half-blue-half-red'));

        if (playerRole === 1) {
            cells[0].classList.add('blue');
            cells[1].classList.add('red');
        } else {
            cells[0].classList.add('half-blue-half-red');
            cells[1].classList.add('half-blue-half-red');
        }
    };

    const handleClick = (event) => {
        if (playerChoice === null) {
            playerChoice = event.target.id === 'cell1' ? 1 : 2;
            highlightCell(event.target);
            checkWinner();
        }
    };

    const highlightCell = (cell) => {
        cell.classList.add('chosen');
    };

    const checkWinner = () => {
        clearTimeout(timer);

        if (playerRole === 1) {
            botChoice = Math.random() < 0.5 ? 1 : 2; // Simular elección aleatoria del bot
            highlightCell(cells[botChoice - 1]); // Marcar la casilla elegida por el bot
            if (playerChoice === botChoice) {
                message.textContent = 'WIN';
                updateFichas(true);
            } else {
                message.textContent = 'LOSE';
                updateFichas(false);
            }
        } else {
            botChoice = playerChoice === 1 ? 2 : 1; // Simular elección contraria al jugador
            highlightCell(cells[botChoice - 1]); // Marcar la casilla elegida por el bot
            if (playerChoice !== botChoice) {
                message.textContent = 'WIN';
                updateFichas(true);
            } else {
                message.textContent = 'LOSE';
                updateFichas(false);
            }
        }
        endGame();
    };

    const updateFichas = (won) => {
        fichas = won ? fichas + 1 : fichas - 1;
        fichasElement.textContent = fichas;
    };

    const endGame = () => {
        cells.forEach(cell => cell.removeEventListener('click', handleClick));
        playButton.style.display = 'inline-block';
    };

    playButton.addEventListener('click', () => {
        cells.forEach(cell => {
            cell.classList.remove('chosen');
        });
        initializeGame();
    });

    initializeGame();
});
