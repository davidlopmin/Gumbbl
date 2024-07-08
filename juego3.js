let leftPrediction = null;
let rightPrediction = null;
let leftSelectionConfirmed = false;
let rightSelectionConfirmed = false;
let timerInterval;

function startTimer() {
    let seconds = 30;
    const timerElement = document.getElementById('timer');

    timerInterval = setInterval(() => {
        seconds--;
        timerElement.textContent = `Time remaining: ${seconds} seconds`;

        if (seconds <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = `Time's up!`;

            disablePredictionFields();
            disableMoveButtons('left');
            disableMoveButtons('right');

            alert('Time is up! You must make your prediction and move the pieces faster.');
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

    if (!isValidPrediction(predictionValue)) {
        alert('Please enter a number between 0 and 6.');
        return;
    }

    if (isDuplicatePrediction(player, predictionValue)) {
        alert(`The ${player === 'left' ? 'right' : 'left'} player has already chosen this number. Please choose a different number.`);
        return;
    }

    if (player === 'left') {
        leftPrediction = predictionValue;
    } else {
        rightPrediction = predictionValue;
    }

    predictionInput.disabled = true;
    predictionInput.style.backgroundColor = '#000';

    checkMoveButtons(player);
}

function isValidPrediction(value) {
    return !isNaN(value) && value >= 0 && value <= 6;
}

function isDuplicatePrediction(player, value) {
    return (player === 'left' && value === rightPrediction) || (player === 'right' && value === leftPrediction);
}

function moveToCenter(player, count) {
    if ((player === 'left' && !leftSelectionConfirmed && leftPrediction !== null) ||
        (player === 'right' && !rightSelectionConfirmed && rightPrediction !== null)) {

        const piecesContainer = document.querySelector(`.player.${player} .pieces-container`);
        const centerCircle = document.querySelector('.center-circle');

        movePieces(piecesContainer, centerCircle, count, player);

        if (player === 'left') {
            leftSelectionConfirmed = true;
        } else {
            rightSelectionConfirmed = true;
        }

        disableMoveButtons(player);

        if (leftSelectionConfirmed && rightSelectionConfirmed) {
            stopTimer();
            declareWinner();
        }
    }
}

function movePieces(sourceContainer, targetContainer, count, player) {
    for (let i = 0; i < count; i++) {
        const piece = sourceContainer.querySelector('.piece');
        if (piece) {
            const clonedPiece = piece.cloneNode(true);
            clonedPiece.classList.add(`moved-${player}`);
            targetContainer.appendChild(clonedPiece);
            sourceContainer.removeChild(piece);
        }
    }
}

function checkMoveButtons(player) {
    const maxPieces = 3;
    const piecesContainer = document.querySelector(`.player.${player} .pieces-container`);
    const piecesCount = piecesContainer.children.length;

    for (let i = 0; i <= maxPieces; i++) {
        const btn = document.getElementById(`${player}-btn-${i}`);
        if (btn) {
            btn.disabled = i > piecesCount || leftSelectionConfirmed || rightSelectionConfirmed;
        }
    }
}

function disableMoveButtons(player) {
    const maxPieces = 3;
    for (let i = 0; i <= maxPieces; i++) {
        const btn = document.getElementById(`${player}-btn-${i}`);
        if (btn) {
            btn.disabled = true;
        }
    }
}

function declareWinner() {
    const piecesInCenter = document.querySelectorAll('.center-circle .piece').length;
    let resultMessage = `Pieces in the center: ${piecesInCenter}. `;

    if (leftPrediction === piecesInCenter && rightPrediction === piecesInCenter) {
        resultMessage += "It's a tie!";
        setTimeout(resetGame, 2000);
    } else if (leftPrediction === piecesInCenter) {
        resultMessage += "Left player wins!";
    } else if (rightPrediction === piecesInCenter) {
        resultMessage += "Right player wins!";
    } else {
        resultMessage += "No player guessed correctly, it's a tie!";
        setTimeout(resetGame, 2000);
    }

    document.getElementById('result').textContent = resultMessage;
}

function resetGame() {
    leftPrediction = null;
    rightPrediction = null;
    leftSelectionConfirmed = false;
    rightSelectionConfirmed = false;

    resetPredictionFields();
    resetPieces();
    document.getElementById('result').textContent = '';

    stopTimer();
    startTimer();
}

function resetPredictionFields() {
    const leftPredictionInput = document.getElementById('left-prediction');
    const rightPredictionInput = document.getElementById('right-prediction');

    [leftPredictionInput, rightPredictionInput].forEach(input => {
        input.value = '';
        input.disabled = false;
        input.style.backgroundColor = '#fff';
    });
}

function disablePredictionFields() {
    const leftPredictionInput = document.getElementById('left-prediction');
    const rightPredictionInput = document.getElementById('right-prediction');

    [leftPredictionInput, rightPredictionInput].forEach(input => {
        input.disabled = true;
        input.style.backgroundColor = '#000';
    });
}

function resetPieces() {
    const leftPiecesContainer = document.querySelector('.player.left .pieces-container');
    const rightPiecesContainer = document.querySelector('.player.right .pieces-container');
    const centerCircle = document.querySelector('.center-circle');

    [leftPiecesContainer, rightPiecesContainer, centerCircle].forEach(container => {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    });

    for (let i = 0; i < 3; i++) {
        const pieceLeft = document.createElement('div');
        pieceLeft.classList.add('piece');
        pieceLeft.style.backgroundColor = 'red';
        leftPiecesContainer.appendChild(pieceLeft);

        const pieceRight = document.createElement('div');
        pieceRight.classList.add('piece');
        pieceRight.style.backgroundColor = 'blue';
        rightPiecesContainer.appendChild(pieceRight);
    }
}

// Initialize the pieces for both players
resetGame();
