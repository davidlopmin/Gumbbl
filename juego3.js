let leftPrediction = null;
let rightPrediction = null;
let leftSelectionConfirmed = false;
let rightSelectionConfirmed = false;
let timerInterval;

// Function to start the 30-second timer
function startTimer() {
    let seconds = 30;
    const timerElement = document.getElementById('timer');

    timerInterval = setInterval(() => {
        seconds--;
        timerElement.textContent = `Time remaining: ${seconds} seconds`;

        if (seconds <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = `Time's up!`;

            // Disable prediction inputs and move buttons
            document.getElementById('left-prediction').disabled = true;
            document.getElementById('right-prediction').disabled = true;
            disableMoveButtons('left');
            disableMoveButtons('right');

            // Show time's up alert
            alert('Time\'s up! You need to make your prediction and move pieces faster.');
            declareWinner();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function submitPrediction(player) {
    const predictionInput = document.getElementById(`${player}-prediction`);
    const predictionValue = parseInt(predictionInput.value);

    if (isNaN(predictionValue) || predictionValue < 0 || predictionValue > 6) {
        alert('Please enter a number between 0 and 6.');
        return;
    }

    if (player === 'left') {
        if (predictionValue === rightPrediction) {
            alert('The right player has already chosen this number. Please choose a different number.');
            return;
        }
        leftPrediction = predictionValue;
    } else if (player === 'right') {
        if (predictionValue === leftPrediction) {
            alert('The left player has already chosen this number. Please choose a different number.');
            return;
        }
        rightPrediction = predictionValue;
    }

    predictionInput.disabled = true;
    predictionInput.style.backgroundColor = '#eee';

    checkMoveButtons(player);
}

function moveToCenter(player, count) {
    if (player === 'left' && leftPrediction !== null && !leftSelectionConfirmed) {
        const playerElement = document.querySelector(`.player.${player}`);
        const piecesContainer = playerElement.querySelector('.pieces-container');
        const centerCircle = document.querySelector('.center-circle');

        // Move the specified number of pieces to the center with the corresponding color
        for (let i = 0; i < count; i++) {
            const piece = piecesContainer.querySelector('.piece');
            if (piece) {
                piece.style.backgroundColor = '#FFFF00'; // Yellow for left player
                centerCircle.appendChild(piece);
            }
        }

        leftSelectionConfirmed = true;
        disableMoveButtons(player);
    } else if (player === 'right' && rightPrediction !== null && !rightSelectionConfirmed) {
        const playerElement = document.querySelector(`.player.${player}`);
        const piecesContainer = playerElement.querySelector('.pieces-container');
        const centerCircle = document.querySelector('.center-circle');

        // Move the specified number of pieces to the center with the corresponding color
        for (let i = 0; i < count; i++) {
            const piece = piecesContainer.querySelector('.piece');
            if (piece) {
                piece.style.backgroundColor = '#FF69B4'; // Pink for right player
                centerCircle.appendChild(piece);
            }
        }

        rightSelectionConfirmed = true;
        disableMoveButtons(player);
    }

    // Check if both players have confirmed their selection
    if (leftSelectionConfirmed && rightSelectionConfirmed) {
        stopTimer();
        declareWinner();
    }
}

function checkMoveButtons(player) {
    const maxPieces = 3; // Maximum number of pieces that can be moved
    const playerElement = document.querySelector(`.player.${player}`);
    const piecesContainer = playerElement.querySelector('.pieces-container');

    for (let i = 0; i <= maxPieces; i++) {
        const btn = document.getElementById(`${player}-btn-${i}`);
        if (btn) {
            btn.disabled = i > piecesContainer.children.length || leftSelectionConfirmed || rightSelectionConfirmed;
        }
    }
}

function disableMoveButtons(player) {
    const maxPieces = 3; // Maximum number of pieces that can be moved

    for (let i = 0; i <= maxPieces; i++) {
        const btn = document.getElementById(`${player}-btn-${i}`);
        if (btn) {
            btn.disabled = true;
        }
    }
}

function declareWinner() {
    const centerCircle = document.querySelector('.center-circle');
    const piecesInCenter = centerCircle.querySelectorAll('.piece').length;

    let resultMessage = `Pieces in the center: ${piecesInCenter}. `;
    if (leftPrediction === piecesInCenter && rightPrediction === piecesInCenter) {
        resultMessage += "It's a tie!";
        setTimeout(resetGame, 2000); // Automatically reset in case of a tie
    } else if (leftPrediction === piecesInCenter) {
        resultMessage += "Left player wins!";
    } else if (rightPrediction === piecesInCenter) {
        resultMessage += "Right player wins!";
    } else {
        resultMessage += "No player guessed correctly, it's a tie!";
        setTimeout(resetGame, 2000); // Automatically reset in case of a tie
    }

    document.getElementById('result').textContent = resultMessage;
}

function resetGame() {
    leftPrediction = null;
    rightPrediction = null;
    leftSelectionConfirmed = false;
    rightSelectionConfirmed = false;
    document.getElementById('left-prediction').value = '';
    document.getElementById('right-prediction').value = '';
    document.getElementById('left-prediction').disabled = false;
    document.getElementById('right-prediction').disabled = false;
    document.getElementById('left-prediction').style.backgroundColor = '#fff';
    document.getElementById('right-prediction').style.backgroundColor = '#fff';
    disableMoveButtons('left');
    disableMoveButtons('right');
    document.getElementById('result').textContent = '';

    // Reset the timer to 30 seconds and reset pieces for both players
    stopTimer(); // First stop the current timer if it's running
    startTimer(); // Then start a new timer

    // Return pieces to their initial position (three pieces on each side)
    const leftPiecesContainer = document.querySelector('.player.left .pieces-container');
    const rightPiecesContainer = document.querySelector('.player.right .pieces-container');
    const centerCircle = document.querySelector('.center-circle');

    // Remove all pieces from the center area
    const piecesInCenter = centerCircle.querySelectorAll('.piece');
    piecesInCenter.forEach(piece => {
        centerCircle.removeChild(piece);
    });

    // Remove all pieces in player containers
    while (leftPiecesContainer.firstChild) {
        leftPiecesContainer.removeChild(leftPiecesContainer.firstChild);
    }
    while (rightPiecesContainer.firstChild) {
        rightPiecesContainer.removeChild(rightPiecesContainer.firstChild);
    }

    // Add three pieces in each player container
    for (let i = 0; i < 3; i++) {
        const pieceLeft = document.createElement('div');
        pieceLeft.classList.add('piece');
        pieceLeft.style.backgroundColor = '#FFFF00'; // Yellow for left player by default
        leftPiecesContainer.appendChild(pieceLeft);

        const pieceRight = document.createElement('div');
        pieceRight.classList.add('piece');
        pieceRight.style.backgroundColor = '#FF69B4'; // Pink for right player by default
        rightPiecesContainer.appendChild(pieceRight);
    }
}

// Initialize pieces for both players
resetGame();
