function switchStreamingServer(serverName, event) {
    const player = document.getElementById('mainPlayer');
    if (!player) return;

    const currentSrc = player.src;
    let tmdbId = '';
    let isTV = currentSrc.includes('/tv/') || currentSrc.includes('-1-1') || currentSrc.includes('/1/1');

    const match = currentSrc.match(/(?:movie\/|tv\/|tmdb\/)([0-9]+)/);
    if (match && match[1]) {
        tmdbId = match[1];
    } else {
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

    const buttons = document.querySelectorAll('.srv-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

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
