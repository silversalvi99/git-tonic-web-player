import { Injectable, signal } from '@angular/core';
import { Track } from '../../models/track.model';

export type RepeatMode = 'none' | 'one' | 'all';

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
  /** Repeat mode signal */
  repeatMode = signal<RepeatMode>('none');

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
      this.updateMediaPositionState();
    };

    this._audio.onplay = () => {
      this.isPlaying.set(true);
      this.updateMediaPlaybackState();
    };

    this._audio.onpause = () => {
      this.isPlaying.set(false);
      this.updateMediaPlaybackState();
    };

    this._audio.onended = () => {
      if (this.repeatMode() === 'one') {
        this.playTrack(this.currentTrack()!);
      } else if (this.repeatMode() === 'all') {
        this.nextTrack();
      } else {
        this.pause();
      }
    };

    this.setupMediaSessionHandlers();
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
    this.updateMediaMetadata(track);
    this.updateMediaPlaybackState();
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
    this.updateMediaPositionState();
  }

  /**
   * Go to next track
   */
  nextTrack(): void {
    const queue = this.queue();
    if (queue.length === 0) return;

    const index = queue.findIndex((t) => t.id === this.currentTrack()?.id);

    if (index !== -1) {
      const nextIndex = index + 1;
      if (nextIndex < queue.length) {
        this.playTrack(queue[nextIndex]);
      } else if (this.repeatMode() === 'all') {
        this.playTrack(queue[0]);
      } else {
        // If 'none' and reached the end, stop playback
        this.pause();
      }
    } else {
      // If current track is not in queue, start from the first one
      this.playTrack(queue[0]);
    }
  }

  /**
   * Go to previous track
   */
  previousTrack(): void {
    const queue = this.queue();
    if (queue.length === 0) return;

    const index = queue.findIndex((t) => t.id === this.currentTrack()?.id);

    if (index !== -1) {
      this.playTrack(queue[(index - 1 + queue.length) % queue.length]);
    } else {
      // If current track is not in queue, start from the last one
      this.playTrack(queue[queue.length - 1]);
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

  /**
   * Toggle repeat mode
   */
  toggleRepeatMode(): void {
    const current = this.repeatMode();

    if (current === 'none') {
      this.repeatMode.set('all');
    } else if (current === 'all') {
      this.repeatMode.set('one');
    } else {
      this.repeatMode.set('none');
    }
  }

  /**
   * Setup Media Session handlers
   */
  private setupMediaSessionHandlers(): void {
    if (!('mediaSession' in navigator)) return;

    const ms = navigator.mediaSession;
    ms.setActionHandler('play', () => this.play());
    ms.setActionHandler('pause', () => this.pause());
    ms.setActionHandler('previoustrack', () => this.previousTrack());
    ms.setActionHandler('nexttrack', () => this.nextTrack());
    ms.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        this.seek(details.seekTime);
      }
    });
    ms.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset || 10;
      this.seek(Math.max(0, this.audio.currentTime - skipTime));
    });
    ms.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 10;
      this.seek(Math.min(this.audio.duration, this.audio.currentTime + skipTime));
    });
    ms.setActionHandler('stop', () => this.pause());
  }

  /**
   * Update Media Session Metadata
   */
  private updateMediaMetadata(track: Track): void {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [
        { src: track.coverThumb, sizes: '96x96', type: 'image/png' },
        { src: track.coverThumb, sizes: '128x128', type: 'image/png' },
        { src: track.coverThumb, sizes: '192x192', type: 'image/png' },
        { src: track.coverThumb, sizes: '256x256', type: 'image/png' },
        { src: track.coverFull, sizes: '384x384', type: 'image/png' },
        { src: track.coverFull, sizes: '512x512', type: 'image/png' },
      ],
    });
  }

  /**
   * Update Media Session Playback State
   */
  private updateMediaPlaybackState(): void {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = this.isPlaying() ? 'playing' : 'paused';
  }

  /**
   * Update Media Session Position State
   */
  private updateMediaPositionState(): void {
    if (!('mediaSession' in navigator) || !('setPositionState' in navigator.mediaSession)) return;

    try {
      navigator.mediaSession.setPositionState({
        duration: this.audio.duration || 0,
        playbackRate: this.audio.playbackRate,
        position: this.audio.currentTime || 0,
      });
    } catch (e) {
      console.error('Error updating position state:', e);
    }
  }
}
