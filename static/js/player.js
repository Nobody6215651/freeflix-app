/**
 * PremiumFlix - Zero-Fail Explicit Router
 */

function switchStreamingServer(serverName, event) {
    const player = document.getElementById('mainPlayer');
    const dataContainer = document.getElementById('playerDataContainer');
    if (!player || !dataContainer) return;

    // Direct extraction from HTML attributes (100% accurate, no regex fails)
    let tmdbId = dataContainer.getAttribute('data-tmdb-id');
    let mediaType = dataContainer.getAttribute('data-media-type') || 'movie';

    // Fallback: Agar upar se ID khali mile toh current iframe URL se backup try karo
    if (!tmdbId) {
        const currentSrc = player.src;
        const match = currentSrc.match(/(?:movie\/|tv\/|tmdb\/)([0-9]+)/);
        if (match && match[1]) {
            tmdbId = match[1];
            mediaType = currentSrc.includes('/tv/') ? 'tv' : 'movie';
        }
    }

    if (!tmdbId) {
        console.error("TMDB ID missing.");
        return;
    }

    let isTV = (mediaType === 'tv' || mediaType === 'series');
    let targetUrl = '';

    // Precise URL Generation
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

    // Update active button classes
    const buttons = document.querySelectorAll('.srv-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Global click hook to capture when user clicks on a new movie card from home page
window.addEventListener('message', function(event) {
    // If your card click updates the iframe from another function, we dynamic sync here
    const player = document.getElementById('mainPlayer');
    if (player) {
        setTimeout(() => {
            const currentSrc = player.src;
            const dataContainer = document.getElementById('playerDataContainer');
            const match = currentSrc.match(/(?:movie\/|tv\/|tmdb\/)([0-9]+)/);
            if (match && match[1] && dataContainer) {
                dataContainer.setAttribute('data-tmdb-id', match[1]);
                dataContainer.setAttribute('data-media-type', currentSrc.includes('/tv/') ? 'tv' : 'movie');
            }
        }, 500);
    }
});
