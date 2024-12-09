document.addEventListener('DOMContentLoaded', function () {
    const leavesContainer = document.getElementById('leaves-container');
    const solidButton = document.getElementById('solid-button');
    const liquidButton = document.getElementById('liquid-button');
    const gasButton = document.getElementById('gas-button');

    // Mock completion tracker
    const completionStatus = {
        solid: false,
        liquid: false,
        gas: false,
    };

    // Unlock the next level and update the lock icon
    function unlockNextLevel(currentLevel) {
        if (currentLevel === 'solid') {
            completionStatus.solid = true;
            liquidButton.disabled = false;
            liquidButton.classList.remove('locked');
        } else if (currentLevel === 'liquid') {
            completionStatus.liquid = true;
            gasButton.disabled = false;
            gasButton.classList.remove('locked');
        }
    }

    // Add event listeners to buttons
    solidButton.addEventListener('click', function () {
        // Simulate completing Solid level
        setTimeout(() => {
            alert('Solid level completed!');
            unlockNextLevel('solid');
        }, 1000);
    });

    liquidButton.addEventListener('click', function () {
        // Simulate completing Liquid level
        setTimeout(() => {
            alert('Liquid level completed!');
            unlockNextLevel('liquid');
        }, 1000);
    });

    gasButton.addEventListener('click', function () {
        // Simulate completing Gas level
        setTimeout(() => {
            alert('Gas level completed!');
        }, 1000);
    });

    // Falling leaves animation
    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.animationDuration = Math.random() * 3 + 2 + 's'; // Random fall duration between 5s and 10s
        leaf.style.animationDelay = Math.random() * 1 + 's'; // Random delay
        leavesContainer.appendChild(leaf);

        // Remove the leaf after the animation ends to prevent overflow
        setTimeout(() => {
            leaf.remove();
        }, 10000);
    }

    // Generate leaves every second
    setInterval(createLeaf, 1000);
});
