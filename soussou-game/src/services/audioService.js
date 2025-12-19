/**
 * Service de lecture audio pour les nombres en Soussou
 * Utilise les fichiers audio préenregistrés (1.wav à 9999.wav)
 */

class AudioService {
  constructor() {
    this.audioCache = new Map();
    this.currentAudio = null;
    this.isPlaying = false;
    this.baseUrl = '/audio'; // Chemin vers les fichiers audio
  }

  /**
   * Précharge un fichier audio dans le cache
   * @param {number} number - Le nombre à précharger
   * @returns {Promise<HTMLAudioElement>}
   */
  async preloadAudio(number) {
    if (this.audioCache.has(number)) {
      return this.audioCache.get(number);
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio(`${this.baseUrl}/${number}.wav`);

      audio.addEventListener('canplaythrough', () => {
        this.audioCache.set(number, audio);
        resolve(audio);
      }, { once: true });

      audio.addEventListener('error', (error) => {
        console.warn(`Failed to load audio for ${number}:`, error);
        reject(error);
      }, { once: true });

      // Commence le chargement
      audio.load();
    });
  }

  /**
   * Joue la prononciation d'un nombre
   * @param {number} number - Le nombre à prononcer (1-9999)
   * @returns {Promise<void>}
   */
  async playNumber(number) {
    // Vérifie que le nombre est dans la plage valide
    if (number < 1 || number > 9999) {
      console.warn(`Number ${number} is out of range (1-9999)`);
      return;
    }

    // Arrête l'audio en cours
    this.stop();

    try {
      // Précharge si nécessaire
      let audio = this.audioCache.get(number);
      if (!audio) {
        audio = await this.preloadAudio(number);
      }

      // Clone l'audio pour permettre plusieurs lectures simultanées
      const audioClone = audio.cloneNode();
      this.currentAudio = audioClone;
      this.isPlaying = true;

      // Gère la fin de lecture
      audioClone.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentAudio = null;
      }, { once: true });

      // Joue l'audio
      await audioClone.play();
    } catch (error) {
      console.error(`Error playing audio for ${number}:`, error);
      this.isPlaying = false;
      this.currentAudio = null;
    }
  }

  /**
   * Arrête la lecture en cours
   */
  stop() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlaying = false;
      this.currentAudio = null;
    }
  }

  /**
   * Précharge une plage de nombres
   * @param {number} start - Début de la plage
   * @param {number} end - Fin de la plage
   * @returns {Promise<void>}
   */
  async preloadRange(start, end) {
    const promises = [];
    for (let i = start; i <= end && i <= 9999; i++) {
      promises.push(
        this.preloadAudio(i).catch(() => {
          // Ignore les erreurs individuelles
        })
      );
    }
    await Promise.all(promises);
  }

  /**
   * Vide le cache audio
   */
  clearCache() {
    this.stop();
    this.audioCache.clear();
  }

  /**
   * Vérifie si un audio est en cours de lecture
   * @returns {boolean}
   */
  get playing() {
    return this.isPlaying;
  }
}

// Instance singleton
const audioService = new AudioService();

export default audioService;
