document.getElementById('play-button').addEventListener('click', function() {
    window.location.href = 'play.html';
});

// Handle settings icon click
document.getElementById('settings-icon').addEventListener('click', function() {
    document.getElementById('settings-modal').style.display = 'flex'; // Show the modal
});

// Handle close button click
document.getElementById('close-settings').addEventListener('click', function() {
    document.getElementById('settings-modal').style.display = 'none'; // Hide the modal
});

// Optional: Close the modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('settings-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

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