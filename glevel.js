document.addEventListener('DOMContentLoaded', function() {
    const leavesContainer = document.getElementById('leaves-container');

    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        leaf.style.left = Math.random() * 100 + 'vw'; // Random horizontal position
        leaf.style.animationDuration = Math.random() * 3 + 2 + 's'; // Random duration between 2s and 5s
        leaf.style.animationDelay = Math.random() * 1 + 's'; // Random delay
        leavesContainer.appendChild(leaf);

        // Remove the leaf after the animation ends to prevent overflow
        setTimeout(() => {
            leaf.remove();
        }, 10000); // Matches the longest animation duration
    }

    // Generate leaves every second
    setInterval(createLeaf, 1000);
});