/**
 * PremiumFlix - Real-time Source Hook Router
 */

function switchStreamingServer(serverName, event) {
    const player = document.getElementById('mainPlayer');
    if (!player) {
        console.error("Player iframe not found.");
        return;
    }

    const currentSrc = player.src;
    let tmdbId = '';
    
    // Check if it's a TV series by looking at common URL patterns
    let isTV = currentSrc.includes('/tv/') || currentSrc.includes('-1-1') || currentSrc.includes('/1/1');

    // POWERFUL REGEX: Extracts numbers (TMDB ID) regardless of the domain structure
    const match = currentSrc.match(/(?:movie\/|tv\/|tmdb\/)([0-9]+)/);
    
    if (match && match[1]) {
        tmdbId = match[1];
    } else {
        // Fallback: Agar upar se na mile toh url ke aakhri numbers nikaalo
        const fallbackMatch = currentSrc.match(/\/([0-9]+)(?:\?|$)/);
        if (fallbackMatch && fallbackMatch[1]) {
            tmdbId = fallbackMatch[1];
        }
    }

    // Agar phir bhi ID na mile toh user ko alert ya console block karein
    if (!tmdbId || tmdbId === '') {
        console.error("Could not extract TMDB ID from: " + currentSrc);
        return; 
    }

    let targetUrl = '';
    if (serverName === 'vidsrc') {
        targetUrl = isTV ? `https://vidsrc.me/embed/tv/${tmdbId}/1-1` : `https://vidsrc.me/embed/movie/${tmdbId}`;
    } else if (serverName === 'autoembed') {
        targetUrl = isTV ? `https://autoembed.to/tv/tmdb/${tmdbId}-1-1` : `https://autoembed.to/movie/tmdb/${tmdbId}`;
    } else if (serverName === 'embedsu') {
        targetUrl = isTV ? `https://embed.su/embed/tv/${tmdbId}/1/1` : `https://embed.su/embed/movie/${tmdbId}`;
    }

    if (targetUrl) {
        player.src = targetUrl;
    }

    // Handle Active Button UI Color switching
    const buttons = document.querySelectorAll('.srv-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Global Lifecycle Monitor: Handles reset when new movie card triggers
document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('mainPlayer');
    if (player) {
        player.addEventListener('load', function() {
            if (this.src.includes('vidsrc.me')) {
                const buttons = document.querySelectorAll('.srv-btn');
                buttons.forEach(btn => btn.classList.remove('active'));
                if (buttons[0]) {
                    buttons[0].classList.add('active');
                }
            }
        });
    }
});
