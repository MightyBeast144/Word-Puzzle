document.addEventListener("DOMContentLoaded", function() {
    const numRows = 15; // Set the number of rows (14)
    const numCols = 15; // Set the number of columns (15)

    const answers = [
        { word: "OXYGEN", direction: "horizontal", startRow: 0, startCol: 0, clueIndex: 0 },
        { word: "SCENT", direction: "vertical", startRow: 1, startCol: 6, clueIndex: 1 },
        { word: "AIR", direction: "horizontal", startRow: 1, startCol: 2, clueIndex: 2 },
        { word: "SMOKE", direction: "vertical", startRow: 3, startCol: 9, clueIndex: 3 },
        { word: "STEAM", direction: "horizontal", startRow: 8, startCol: 5, clueIndex: 4 },
        { word: "BREATH", direction: "diagonal", startRow: 6, startCol: 1, clueIndex: 5 }
    ];

    // Create a 14x15 grid filled with empty strings
    const gridLetters = Array.from({ length: numRows }, () => Array(numCols).fill(''));

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
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (gridLetters[row][col] === '') {
                gridLetters[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    // Display the grid in the table
    const wordGrid = document.getElementById('wordGrid');
    // Ensure the table has rows and columns
    gridLetters.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((letter, colIndex) => {
            const td = document.createElement('td');
            td.textContent = letter; // Add the letter in the cell
            td.dataset.row = rowIndex;
            td.dataset.col = colIndex;
            tr.appendChild(td);
        });
        wordGrid.appendChild(tr);
    });

    // Variables for word selection
    let selectedCells = [];
    let isMouseDown = false;
    let tigerHealth = 10; // Initial health set to 10

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
        victoryModal.innerHTML = 
            `<div class="modal-content">
                <h2>VICTORY!</h2>
                <p>You've found all the words!</p>
                <button id="homeVictoryBtn">Home</button>
                <button id="nextLevelVictoryBtn">Next Level</button>
            </div>`;
        document.body.appendChild(victoryModal);

        // Event listeners for the buttons inside the modal
        document.getElementById("homeVictoryBtn").addEventListener("click", () => {
            victoryModal.remove();
            window.location.href = "index.html"; // Navigate to home page
        });

        document.getElementById("nextLevelVictoryBtn").addEventListener("click", () => {
            victoryModal.remove();
            window.location.href = "/Solid/GameplayLVL4.html"; // Replace with your next level page
        });
    }

    // Function to show modal when tiger's health reaches 0
    function showTigerDefeatedModal() {
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.style.display = "flex";
        modal.innerHTML = 
            `<div class="modal-content">
                <h2>Tiger has lost!</h2>
                <p>The tiger has lost all its health!</p>
                <button id="homeTigerBtn">Home</button>
                <button id="nextLevelTigerBtn">Next Level</button>
            </div>`;
        document.body.appendChild(modal);

        // Event listeners for buttons in the modal
        document.getElementById("homeTigerBtn").addEventListener("click", () => {
            modal.remove();
            window.location.href = "index.html"; // Navigate to home page
        });

        document.getElementById("nextLevelTigerBtn").addEventListener("click", () => {
            modal.remove();
            window.location.href = "/Solid/GameplayLVL3.html"; // Replace with your next level page
        });
    }

    // Timer functionality
    let timeLeft = 120; // 2 minutes in seconds
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
        modal.style.display = "flex";
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
