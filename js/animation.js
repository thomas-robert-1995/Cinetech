
        window.addEventListener('DOMContentLoaded', () => {
            const intro = document.getElementById('introAnimation');
            const audio = document.getElementById('introSound');
    
            // Si l'utilisateur n'a pas encore vu l'intro pendant cette session
            if (!sessionStorage.getItem('introPlayed')) {
                // Jouer le son
                setTimeout(() => {
                    audio.play().catch(e => {
                        console.log("Impossible de jouer le son automatiquement :", e);
                    });
                }, 100);
    
                // Masquer l'animation après 5 secondes
                setTimeout(() => {
                    intro.classList.add('hide');
                }, 5000);
    
                // Marquer que l'intro a été jouée
                sessionStorage.setItem('introPlayed', 'true');
            } else {
                // Si déjà vue, cacher immédiatement l'intro
                intro.classList.add('hide');
            }
        });
    
