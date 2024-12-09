document.addEventListener("DOMContentLoaded", function() {
    const numRows = 15; // Set the number of rows (15)
    const numCols = 15; // Set the number of columns (15)

    const answers = [
        { word: "VASE", direction: "horizontal", startRow: 0, startCol: 0, clueIndex: 0 },
        { word: "LADDER", direction: "vertical", startRow: 1, startCol: 6, clueIndex: 1 },
        { word: "TOWEL", direction: "horizontal", startRow: 1, startCol: 2, clueIndex: 2 },
        { word: "CABINET", direction: "vertical", startRow: 3, startCol: 9, clueIndex: 3 },
        { word: "STOVE", direction: "horizontal", startRow: 8, startCol: 5, clueIndex: 4 },
        { word: "RULER", direction: "diagonal", startRow: 6, startCol: 1, clueIndex: 5 },
        { word: "FRIDGE", direction: "horizontal", startRow: 4, startCol: 3, clueIndex: 6 },
        { word: "CAMERA", direction: "vertical", startRow: 5, startCol: 0, clueIndex: 7 },
        { word: "NAIL", direction: "horizontal", startRow: 7, startCol: 5, clueIndex: 8 },
        { word: "WALLET", direction: "vertical", startRow: 9, startCol: 8, clueIndex: 9 }
    ];

    // Create a 15x15 grid filled with empty strings
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
    let tigerHealth = 10; // Initial health set to 10

    // Function to update the heart display
    function updateHearts() {
        const hearts = document.querySelectorAll(".heart");
        hearts.forEach((heart, index) => {
            if (index < tigerHealth) {
                heart.style.opacity = 1;
            } else {
                heart.style.opacity = 0.3;
                heart.classList.add("reduce-health");
                setTimeout(() => heart.classList.remove("reduce-health"), 300);
            }
        });

        if (tigerHealth === 0) {
            showTigerDefeatedModal();
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

            // Add 10 seconds for correct word
            addTime(10);

            // Deduct health from the tiger
            tigerHealth--;
            updateHearts();
            checkVictory();
        } else {
            // Deduct 20 seconds for incorrect word
            subtractTime(20);
        }
    }

    // Add Time Function (adds specified seconds to the timer)
    function addTime(seconds) {
        timeLeft += seconds;
        if (timeLeft > 120) { // 120 seconds is equivalent to 2 minutes
            timeLeft = 120;
        }
        updateTimerDisplay();
    }

    // Subtract Time Function (deducts specified seconds from the timer)
    function subtractTime(seconds) {
        timeLeft -= seconds;
        if (timeLeft < 0) {
            timeLeft = 0;
        }
        updateTimerDisplay();
    }

    // Update Timer Display Function (refreshes the timer display on the page)
    function updateTimerDisplay() {
        const timerDisplay = document.getElementById("timer");
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    // Check if all words are found for victory
    function checkVictory() {
        const allCluesFound = Array.from(document.querySelectorAll("#clueList li")).every(li => li.style.color === "green");
        if (allCluesFound) {
            showVictoryModal();
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

        document.getElementById("homeVictoryBtn").addEventListener("click", () => {
            victoryModal.remove();
            window.location.href = "index.html";
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
                <h2>Game Over!</h2>
                <p>Your tiger has been defeated.</p>
                <button id="retryBtn">Retry</button>
                <button id="backBtn">Back to Level</button>
                <button id="homeBtn">Home</button>
            </div>`;
        document.body.appendChild(modal);

        document.getElementById("retryBtn").addEventListener("click", () => {
            location.reload(); // Reload the page to retry the level
        });

        document.getElementById("backBtn").addEventListener("click", () => {
            window.location.href = "level.html";
        });

        document.getElementById("homeBtn").addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    // Initial time setup
    let timeLeft = 120; // 2 minutes
    updateTimerDisplay();

    // Timer function to count down every second
    setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            showModal();
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
        window.location.href = "level.html";
    });

    document.getElementById("homeBtn").addEventListener("click", function() {
        window.location.href = "index.html";
    });
});

