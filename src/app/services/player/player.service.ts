import { inject, Injectable, resource, signal } from '@angular/core';
import { Track } from '../../models/track.model';
import { RestApi } from '../api/rest-api';

@Injectable({
  providedIn: 'root',
})
export class Player {
  private readonly restApi = inject(RestApi);

  /** Is playing signal */
  isPlaying = signal<boolean>(false);
  /** Current track signal */
  currentTrack = signal<Track | null>(null);
  /** Current time signal */
  currentTime = signal<number>(0);
  /** Duration signal */
  duration = signal<number>(0);

  /** Audio element reference */
  private audio = new Audio();

  constructor() {
    this.audio.ontimeupdate = () => {
      this.currentTime.set(this.audio.currentTime);
    };

    this.audio.onloadedmetadata = () => {
      this.duration.set(this.audio.duration);
    };
  }

  /**
   * Play a track
   * @param track - The track to play
   */
  playTrack(track: Track): void {
    this.currentTrack.set(track);
    this.audio.src = track.streamUrl;
    this.audio.play();
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
    // To be implemented with a playlist service
    console.log('Next track');
  }

  /**
   * Go to previous track
   */
  previousTrack(): void {
    // To be implemented with a playlist service
    console.log('Previous track');
  }
}
