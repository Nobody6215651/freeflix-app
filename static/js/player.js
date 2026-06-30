/**
 * PremiumFlix - Smooth Dynamic Playback Router
 */

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader');
    
    // Header transition logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    }, { passive: true });
});

// Jab user kisi card par click karega toh player automatic badal jayega
function loadMovie(embedUrl) {
    const player = document.getElementById('mainPlayer');
    if (player && embedUrl) {
        player.src = embedUrl;
        scrollToPlayer();
    }
}

// Screen ko smoothly video player par le jaane ke liye
function scrollToPlayer() {
    const playerContainer = document.querySelector('.player-container');
    if (playerContainer) {
        playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
