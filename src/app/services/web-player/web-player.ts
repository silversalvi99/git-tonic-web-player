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
  /** Duration signal */
  duration = signal<number>(0);
  /** Queue signal */
  queue = signal<Track[]>([]);
  /** Volume signal (0 to 1) */
  volume = signal<number>(1);

  /** Audio element reference */
  private audio = new Audio();

  constructor() {
    this.audio.ontimeupdate = () => {
      this.currentTime.set(this.audio.currentTime);
    };

    this.audio.onloadedmetadata = () => {
      console.log('Audio metadata loaded, duration:', this.audio.duration);
      this.duration.set(this.audio.duration);
    };

    this.audio.onerror = (e) => {
      console.error('Audio error:', e, this.audio.error);
    };

    this.audio.onplay = () => console.log('Audio playback started');
    this.audio.onpause = () => console.log('Audio playback paused');
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
