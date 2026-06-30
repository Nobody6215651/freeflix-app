/**
 * PremiumFlix - Advanced Dynamic Player & Server Router
 * Fixes Black Screen and Loading issues by re-initializing the iframe securely
 */

function switchStreamingServer(serverName, event) {
    const playerContainer = document.querySelector('.player-container');
    const oldPlayer = document.getElementById('mainPlayer');
    if (!playerContainer || !oldPlayer) return;

    const currentSrc = oldPlayer.src;
    let tmdbId = '';
    let isTV = currentSrc.includes('/tv/') || currentSrc.includes('-1-1') || currentSrc.includes('/1/1');

    // Safe TMDB ID Extraction
    const match = currentSrc.match(/(?:movie\/|tv\/|tmdb\/)([0-9]+)/);
    if (match && match[1]) {
        tmdbId = match[1];
    } else {
        console.error("TMDB ID could not be retrieved from active stream.");
        return; 
    }

    // Generate accurate URLs based on Server Specifications
    let targetUrl = '';
    if (serverName === 'vidsrc') {
        targetUrl = isTV ? `https://vidsrc.me/embed/tv/${tmdbId}/1-1` : `https://vidsrc.me/embed/movie/${tmdbId}`;
    } else if (serverName === 'autoembed') {
        targetUrl = isTV ? `https://autoembed.to/tv/tmdb/${tmdbId}-1-1` : `https://autoembed.to/movie/tmdb/${tmdbId}`;
    } else if (serverName === 'embedsu') {
        targetUrl = isTV ? `https://embed.su/embed/tv/${tmdbId}/1/1` : `https://embed.su/embed/movie/${tmdbId}`;
    }

    if (targetUrl) {
        // POWERFUL FIX: Purane iframe ko delete karke naya sandbox-enabled iframe install karna
        playerContainer.innerHTML = ''; 
        
        const newPlayer = document.createElement('iframe');
        newPlayer.id = 'mainPlayer';
        newPlayer.src = targetUrl;
        newPlayer.setAttribute('allowfullscreen', 'true');
        newPlayer.setAttribute('frameborder', '0');
        newPlayer.setAttribute('scrolling', 'no');
        
        // Yeh permissions server 2 aur 3 ko smooth chalne par majboor karengi
        newPlayer.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation');
        newPlayer.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');

        // Container mein naya player daal dein
        playerContainer.appendChild(newPlayer);
        
        // Phir se load event listener attach karein taake reset logic chalti rahe
        attachPlayerLoadListener(newPlayer);
    }

    // Active Button State Handle
    const buttons = document.querySelectorAll('.srv-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function attachPlayerLoadListener(playerInstance) {
    if (!playerInstance) return;
    playerInstance.addEventListener('load', function() {
        if (this.src.includes('vidsrc.me')) {
            const buttons = document.querySelectorAll('.srv-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            if (buttons[0]) {
                buttons[0].classList.add('active');
            }
        }
    });
}

// Initial Core Hook
document.addEventListener('DOMContentLoaded', () => {
    const initialPlayer = document.getElementById('mainPlayer');
    if (initialPlayer) {
        // Default player par bhi dynamic sandbox apply kar dete hain taake start se secure rahe
        initialPlayer.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation');
        initialPlayer.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
        attachPlayerLoadListener(initialPlayer);
    }
});
