import { Injectable, signal } from '@angular/core';
import { Track } from '../../models/track.model';

@Injectable({
  providedIn: 'root',
})
export class WebPlayer {
  /** Is playing signal */
  isPlaying = signal<boolean>(false);
  /** Current track signal */
  currentTrack = signal<Track | null>(null);
  /** Current time signal */
  currentTime = signal<number>(0);
  /** Is seeking signal */
  isSeeking = signal<boolean>(false);
  /** Duration signal */
  duration = signal<number>(0);
  /** Queue signal */
  queue = signal<Track[]>([]);
  /** Volume signal (0 to 1) */
  volume = signal<number>(1);
  /** Open mode signal */
  isOpenMode = signal<boolean>(false);
  /**  */

  /** Audio element reference */
  /** Audio element reference */
  private _audio?: HTMLAudioElement;

  /** Lazy getter for audio element */
  private get audio(): HTMLAudioElement {
    if (!this._audio) {
      this._audio = new Audio();
      this.setupAudioListeners();
    }
    return this._audio;
  }

  private setupAudioListeners(): void {
    if (!this._audio) return;

    this._audio.ontimeupdate = () => {
      if (!this.isSeeking()) {
        this.currentTime.set(this._audio!.currentTime);
      }
    };

    this._audio.onloadedmetadata = () => {
      this.duration.set(this._audio!.duration);
    };

    this._audio.onplay = () => this.isPlaying.set(true);
    this._audio.onpause = () => this.isPlaying.set(false);
  }

  constructor() {
    // Audio is initialized lazily when first accessed
  }

  /**
   * Play a track
   * @param track - The track to play
   */
  playTrack(track: Track): void {
    console.log('Playing track:', track.title, 'URL:', track.streamUrl);
    this.currentTrack.set(track);
    this.audio.src = track.streamUrl;
    this.audio.load(); // Explicitly load
    this.audio.play().catch((err) => {
      console.error('Error starting playback:', err);
    });
    this.isPlaying.set(true);
  }

  /**
   * Toggle play/pause
   */
  togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Pause the current track
   */
  pause(): void {
    this.audio.pause();
    this.isPlaying.set(false);
  }

  /**
   * Play the current track
   */
  play(): void {
    if (this.currentTrack()) {
      this.audio.play();
      this.isPlaying.set(true);
    }
  }

  /**
   * Seek to a specific time in the current track
   * @param time - The time to seek
   */
  seek(time: number): void {
    this.audio.currentTime = time;
    this.currentTime.set(time);
  }

  /**
   * Go to next track
   */
  nextTrack(): void {
    const queue = this.queue();
    const currentTrack = this.currentTrack();
    if (currentTrack) {
      const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);
      if (currentIndex < queue.length - 1) {
        this.playTrack(queue[currentIndex + 1]);
      }
    }
  }

  /**
   * Go to previous track
   */
  previousTrack(): void {
    const queue = this.queue();
    const currentTrack = this.currentTrack();
    if (currentTrack) {
      const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);
      if (currentIndex > 0) {
        this.playTrack(queue[currentIndex - 1]);
      }
    }
  }

  /**
   * Set volume
   * @param volume - The volume to set
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.audio.volume = clampedVolume;
    this.volume.set(clampedVolume);
  }
}
