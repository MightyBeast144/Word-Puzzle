document.addEventListener("DOMContentLoaded", function() {
    const gridSize = 16; // Set grid size to 16x16
const answers = [
    { word: "CORAL", direction: "horizontal", startRow: 0, startCol: 0, clueIndex: 0 },    // Row 0
    { word: "COBALT", direction: "vertical", startRow: 0, startCol: 0, clueIndex: 1 },     // Column 1
    { word: "AMBER", direction: "horizontal", startRow: 2, startCol: 4, clueIndex: 2 },    // Row 2
    { word: "CHALK", direction: "diagonal", startRow: 0, startCol: 0, clueIndex: 3 },      // Column 4
    { word: "MARBLE", direction: "horizontal", startRow: 6, startCol: 0, clueIndex: 4 },   // Row 5
    { word: "BAMBOO", direction: "vertical", startRow: 0, startCol: 13, clueIndex: 5 },     // Starting at Row 1, Column 7
    { word: "OBSIDIAN", direction: "vertical", startRow: 0, startCol: 9, clueIndex: 6 },   // Column 9
    { word: "SAPPHIRE", direction: "horizontal", startRow: 7, startCol: 0, clueIndex: 7 }, // Row 7
    { word: "SLATE", direction: "vertical", startRow: 3, startCol: 15, clueIndex: 8 },     // Column 10
    { word: "QUARTZ", direction: "horizontal", startRow: 8, startCol: 1, clueIndex: 9 },   // Row 8
    { word: "TITANIUM", direction: "vertical", startRow: 8, startCol: 8, clueIndex: 10 },  // Column 8
    { word: "SANDSTONE", direction: "horizontal", startRow: 10, startCol: 3, clueIndex: 11 }, // Row 10
    { word: "WALL", direction: "horizontal", startRow: 11, startCol: 0, clueIndex: 12 },    // Row 11
];

    const gridLetters = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Function to place words in the grid
    answers.forEach(answer => {
        let row = answer.startRow;
        let col = answer.startCol;

        for (let i = 0; i < answer.word.length; i++) {
            gridLetters[row][col] = answer.word[i];

            if (answer.direction === "horizontal") {
                col++;
            } else if (answer.direction === "vertical") {
                row++;
            } else if (answer.direction === "diagonal") {
                row++;
                col++;
            }
        }
    });

    // Fill the remaining empty spaces with random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (gridLetters[row][col] === '') {
                gridLetters[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    // Display the grid in the table
    const wordGrid = document.getElementById('wordGrid');
    gridLetters.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((letter, colIndex) => {
            const td = document.createElement('td');
            td.textContent = letter;
            td.dataset.row = rowIndex;
            td.dataset.col = colIndex;
            tr.appendChild(td);
        });
        wordGrid.appendChild(tr);
    });

    // Variables for word selection
    let selectedCells = [];
    let isMouseDown = false;
    let tigerHealth = 14; // Initial health set to 6

    // Function to update the heart display
    function updateHearts() {
        const hearts = document.querySelectorAll(".heart");
        hearts.forEach((heart, index) => {
            if (index < tigerHealth) {
                heart.style.opacity = 1;
            } else {
                heart.style.opacity = 0.3;
                heart.classList.add("reduce-health"); // Add pulse animation class
                setTimeout(() => heart.classList.remove("reduce-health"), 300); // Remove class after animation
            }
        });
    
        if (tigerHealth === 0) {
            showTigerDefeatedModal(); // Show modal if the tiger's health reaches 0
        }
    }

    // Event listeners for selecting letters
    document.querySelectorAll("#wordGrid td").forEach(cell => {
        cell.addEventListener('mousedown', () => {
            isMouseDown = true;
            selectedCells = [cell];
            cell.classList.add("selected");
        });

        cell.addEventListener('mouseover', () => {
            if (isMouseDown) {
                selectedCells.push(cell);
                cell.classList.add("selected");
            }
        });

        cell.addEventListener('mouseup', () => {
            isMouseDown = false;
            checkSelection(selectedCells);
            selectedCells = [];
            document.querySelectorAll("#wordGrid td").forEach(cell => cell.classList.remove("selected"));
        });
    });

    // Check if selected cells match any of the answers
    function checkSelection(cells) {
        let selectedWord = cells.map(cell => cell.textContent).join('');
        let reverseWord = selectedWord.split('').reverse().join('');

        let foundAnswer = answers.find(answer => 
            selectedWord === answer.word || reverseWord === answer.word
        );

        if (foundAnswer) {
            cells.forEach(cell => cell.style.backgroundColor = "lightgreen");
            document.querySelectorAll("#clueList li")[foundAnswer.clueIndex].style.color = "green";
            
            // Deduct health from the tiger
            tigerHealth--;
            updateHearts(); // Update heart display
            checkVictory(); // Check for victory after each selection
        }
    }

    // Check if all words are found for victory
    function checkVictory() {
        const allCluesFound = Array.from(document.querySelectorAll("#clueList li")).every(li => li.style.color === "green");
        if (allCluesFound) {
            showVictoryModal(); // Show victory modal
        }
    }

    // Function to show victory modal
    function showVictoryModal() {
        const victoryModal = document.createElement("div");
        victoryModal.classList.add("modal");
        victoryModal.style.display = "flex";
        victoryModal.innerHTML = `
            <div class="modal-content">
                <h2>VICTORY!</h2>
                <p>You've found all the words!</p>
                <button id="homeVictoryBtn">Home</button>
                <button id="nextLevelVictoryBtn">Proceed to Next Stage</button>
            </div>
        `;
        document.body.appendChild(victoryModal);

        // Event listeners for the buttons inside the modal
        document.getElementById("homeVictoryBtn").addEventListener("click", () => {
            victoryModal.remove();
            window.location.href = "index.html"; // Navigate to home page
        });

        document.getElementById("nextLevelVictoryBtn").addEventListener("click", () => {
            victoryModal.remove();
            window.location.href = "play.html"; // Replace with your next level page
        });
    }

    // Function to show modal when tiger's health reaches 0
    function showTigerDefeatedModal() {
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.style.display = "flex";
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Tiger has lost!</h2>
                <p>The tiger has lost all its health!</p>
                <button id="homeTigerBtn">Home</button>
                <button id="nextLevelTigerBtn">Next Level</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Event listeners for buttons in the modal
        document.getElementById("homeTigerBtn").addEventListener("click", () => {
            modal.remove();
            window.location.href = "index.html"; // Navigate to home page
        });

        document.getElementById("nextLevelTigerBtn").addEventListener("click", () => {
            modal.remove();
            window.location.href = "play.html"; // Replace with your next level page
        });
    }

    // Timer functionality
    let timeLeft = 2000; // 2 minutes in seconds
    const timerDisplay = document.getElementById("timer");
    const timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            showModal(); // Show modal if time runs out
        }
    }, 1000);

    // Function to show modal when time runs out
    function showModal() {
        const modal = document.getElementById("timeOutModal");
        modal.style.display = "block";
    }

    // Event listeners for modal buttons
    document.getElementById("retryBtn").addEventListener("click", function() {
        location.reload(); // Reload the page to retry the level
    });

    document.getElementById("backBtn").addEventListener("click", function() {
        window.location.href = "level.html"; // Replace with your level menu page
    });

    document.getElementById("homeBtn").addEventListener("click", function() {
        window.location.href = "index.html"; // Replace with your home page
    });
    
});
function showSettings() {
    const modal = document.getElementById("settingsModal");
    modal.style.display = "block";
}
function removesettings() {
    const modal = document.getElementById("settingsModal");
    modal.style.display = "none";
}

function showRandomClues() {
    const clues = document.querySelectorAll('.clue');
    const randomIndices = [];
  
    while (randomIndices.length < 5) {
      const randomIndex = Math.floor(Math.random() * clues.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
  
    clues.forEach((clue, index) => {
      if (randomIndices.includes(index)) {
        clue.classList.remove('hidden');
      } else {
        clue.classList.add('hidden');
      }
    });
  }
  
setInterval(showRandomClues, 10000);