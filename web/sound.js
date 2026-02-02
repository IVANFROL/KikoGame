// Sound management
class SoundManager {
    constructor() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.clickSound = document.getElementById('clickSound');
        this.hitSound = document.getElementById('hitSound');
        this.healSound = document.getElementById('healSound');
        this.musicPaused = false;
    }

    playMusic() {
        try {
            this.backgroundMusic.play().catch(e => {
                console.log('Music play failed:', e);
            });
        } catch (e) {
            console.log('Music not available');
        }
    }

    pauseMusic() {
        if (this.backgroundMusic && !this.musicPaused) {
            this.backgroundMusic.pause();
            this.musicPaused = true;
        }
    }

    resumeMusic() {
        if (this.backgroundMusic && this.musicPaused) {
            this.backgroundMusic.play().catch(e => {
                console.log('Music resume failed:', e);
            });
            this.musicPaused = false;
        }
    }

    playClick() {
        try {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(e => {});
        } catch (e) {}
    }

    playHit() {
        try {
            // Сброс звука в начало и перезапуск (как в Python: hit_cometa.play())
            // В Python версии каждый раз создается новый Sound объект, поэтому звук всегда играет
            const sound = this.hitSound.cloneNode(); // Создаем копию для одновременного воспроизведения
            sound.currentTime = 0;
            sound.play().catch(e => {});
            // Удаляем копию после окончания воспроизведения
            sound.onended = () => sound.remove();
        } catch (e) {
            // Fallback на обычное воспроизведение
            try {
                this.hitSound.currentTime = 0;
                this.hitSound.play().catch(e => {});
            } catch (e2) {}
        }
    }

    playHeal() {
        try {
            this.healSound.currentTime = 0;
            this.healSound.play().catch(e => {});
        } catch (e) {}
    }
}


