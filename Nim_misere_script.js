let piles = [];
let currentPlayer = 1;
let selectedPileIndex = null;
let difficulty = 'medium'; // Default difficulty

function startGame() {
    const pileCount = parseInt(prompt("Enter the number of piles:"));
    piles = [];
    for (let i = 0; i < pileCount; i++) {
        const pileSize = parseInt(prompt(`Enter the number of items in pile ${i + 1}:`));
        piles.push(pileSize);
    }
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    difficulty = selectedDifficulty;
    currentPlayer = 1;
    selectedPileIndex = null;
    renderGameBoard();
    updateMessage();
}

function renderGameBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    piles.forEach((pile, index) => {
        const pileDiv = document.createElement("div");
        pileDiv.className = "pile";
        pileDiv.innerHTML = `<h3>Pile ${index + 1}</h3>`;
        for (let i = 0; i < pile; i++) {
            const span = document.createElement("span");
            span.innerText = i + 1;
            span.onclick = () => selectTile(index, i);
            pileDiv.appendChild(span);
        }
        gameBoard.appendChild(pileDiv);
    });
}

function selectTile(pileIndex, tileIndex) {
    if (selectedPileIndex !== null && selectedPileIndex !== pileIndex) {
        clearSelection();
    }
    selectedPileIndex = pileIndex;

    const pile = document.querySelectorAll(`.pile:nth-child(${pileIndex + 1}) span`);
    pile.forEach((tile, index) => {
        if (index >= tileIndex) {
            tile.classList.add("selected");
            tile.dataset.pileIndex = pileIndex;
        } else {
            tile.classList.remove("selected");
            delete tile.dataset.pileIndex;
        }
    });
}

function clearSelection() {
    document.querySelectorAll(".pile span.selected").forEach(tile => {
        tile.classList.remove("selected");
        delete tile.dataset.pileIndex;
    });
}

function removeSelected() {
    const selectedTiles = document.querySelectorAll(".pile span.selected");
    if (selectedTiles.length === 0) {
        alert("Please select tiles to remove.");
        return;
    }

    const toRemove = {};
    selectedTiles.forEach(tile => {
        const pileIndex = tile.dataset.pileIndex;
        if (!toRemove[pileIndex]) {
            toRemove[pileIndex] = 0;
        }
        toRemove[pileIndex]++;
    });

    for (let pileIndex in toRemove) {
        piles[pileIndex] -= toRemove[pileIndex];
    }

    if (piles.every(pile => pile === 0)) {
        updateMessage(true);
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        if (currentPlayer === 2) {
            updateMessage(false, true);
            setTimeout(computerMove, 1000); 
        } else {
            updateMessage();
        }
    }
    selectedPileIndex = null;
    renderGameBoard();
}

function computerMove() {
    if (difficulty === 'easy') {
        randomMove();
    } else if (difficulty === 'medium') {
        if (Math.random() < 0.5) {
            randomMove();
        } else {
            optimalMove();
        }
    } else {
        optimalMove();
    }
}

function randomMove() {
    let pileIndex = Math.floor(Math.random() * piles.length);
    while (piles[pileIndex] === 0) {
        pileIndex = Math.floor(Math.random() * piles.length);
    }
    const removeCount = Math.floor(Math.random() * piles[pileIndex]) + 1;
    animateRemoval(pileIndex, removeCount);
}

function optimalMove() {
    let nimSum = 0;
    piles.forEach(pile => {
        nimSum ^= pile;
    });

    if (nimSum === 0) {
        randomMove();
    } else {
        let pileIndex;
        let removeCount;
        let largerThanOneCount = 0;
        let equalOneCount = 0;

        piles.forEach((pile, index) => {
            if (pile > 1) {
                largerThanOneCount++;
                pileIndex = index;
            } else if (pile === 1) {
                equalOneCount++;
            }
        });

        if (largerThanOneCount === 1) {
            if (equalOneCount % 2 === 0) {
                removeCount = piles[pileIndex] - 1;
            } else {
                removeCount = piles[pileIndex];
            }
            animateRemoval(pileIndex, removeCount);
        } else {
            for (let i = 0; i < piles.length; i++) {
                const tempXor = nimSum ^ piles[i];
                if (tempXor < piles[i]) {
                    removeCount = piles[i] - tempXor;
                    animateRemoval(i, removeCount);
                    break;
                }
            }
        }
    }
}

function animateRemoval(pileIndex, removeCount) {
    const pile = document.querySelectorAll(`.pile:nth-child(${pileIndex + 1}) span`);
    for (let i = pile.length - 1; i >= pile.length - removeCount; i--) {
        pile[i].classList.add("fade-out");
    }
    setTimeout(() => {
        piles[pileIndex] -= removeCount;
        if (piles.every(pile => pile === 0)) {
            updateMessage(true);
        } else {
            currentPlayer = 1;
            updateMessage();
        }
        renderGameBoard();
    }, 2000); // 2 seconds for smoother fade-out
}

function updateMessage(gameOver = false, computerTurn = false) {
    const message = document.getElementById("message");
    if (gameOver) {
        if (currentPlayer === 1) {
            message.innerText = `Computer wins!`;
        } else {
            message.innerText = `Player wins!`;
        }
    } else if (computerTurn) {
        message.innerText = `Computer's move...`;
    } else {
        message.innerText = `Player's turn.`;
    }
}

startGame();

