document.addEventListener('DOMContentLoaded', function() {
    const leavesContainer = document.getElementById('leaves-container');

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
        }, 10000); // Match the longest animation duration
    }

    // Generate leaves every second
    setInterval(createLeaf, 1000);
});