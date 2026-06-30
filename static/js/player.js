/**
 * PremiumFlix - UI Layer Real-Time Lifecycle Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader');
    
    // DYNAMIC HEADER FADE ACTIVE SCHEDULER
    const handleHeaderScrollFade = () => {
        if (window.scrollY > 30) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    };

    // Attach passive scroll frame triggers to avoid UI rendering lags
    window.addEventListener('scroll', handleHeaderScrollFade, { passive: true });

    // Core log tracking
    console.log("PremiumFlix Cinematic UX Engine initialized successfully.");
});
