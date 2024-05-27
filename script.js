// script.js

let piles = [];
let currentPlayer = 1;
let selectedPileIndex = null;

function startGame() {
    const pileCount = parseInt(prompt("Enter the number of piles:"));
    piles = [];
    for (let i = 0; i < pileCount; i++) {
        const pileSize = parseInt(prompt(`Enter the number of items in pile ${i + 1}:`));
        piles.push(pileSize);
    }
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
        updateMessage();
    }
    selectedPileIndex = null;
    renderGameBoard();
}

function updateMessage(gameOver = false) {
    const message = document.getElementById("message");
    if (gameOver) {
        message.innerText = `Player ${currentPlayer === 1 ? 2 : 1} wins!`;
    } else {
        message.innerText = `Player ${currentPlayer}'s turn.`;
    }
}

startGame();