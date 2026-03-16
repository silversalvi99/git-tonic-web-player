import { TestBed } from '@angular/core/testing';
import { WebPlayer } from './web-player';
import { Track } from '../../models/track.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('WebPlayer', () => {
  let service: WebPlayer;
  let mockAudio: any;

  const mockTrack: Track = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    coverUrl: 'test-cover',
    streamUrl: 'test-stream',
  };

  beforeEach(() => {
    // Mock Audio
    mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      load: vi.fn(),
      src: '',
      volume: 1,
      currentTime: 0,
      duration: 0,
    };

    // Replace global Audio constructor
    vi.stubGlobal(
      'Audio',
      vi.fn(function () {
        return mockAudio;
      }),
    );

    TestBed.configureTestingModule({});
    service = TestBed.inject(WebPlayer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should play a track', () => {
    service.playTrack(mockTrack);
    expect(service.currentTrack()).toEqual(mockTrack);
    expect(mockAudio.src).toBe(mockTrack.streamUrl);
    expect(mockAudio.play).toHaveBeenCalled();
    expect(service.isPlaying()).toBe(true);
  });

  it('should toggle play/pause', () => {
    service.currentTrack.set(mockTrack);

    // Initially playing
    service.isPlaying.set(true);
    service.togglePlay();
    expect(service.isPlaying()).toBe(false);
    expect(mockAudio.pause).toHaveBeenCalled();

    // Now paused
    service.togglePlay();
    expect(service.isPlaying()).toBe(true);
    expect(mockAudio.play).toHaveBeenCalled();
  });

  it('should set volume correctly', () => {
    service.setVolume(0.5);
    expect(service.volume()).toBe(0.5);
    expect(mockAudio.volume).toBe(0.5);

    // Clamping
    service.setVolume(1.5);
    expect(service.volume()).toBe(1);
    expect(mockAudio.volume).toBe(1);

    service.setVolume(-0.5);
    expect(service.volume()).toBe(0);
    expect(mockAudio.volume).toBe(0);
  });

  it('should manage queue and navigate', () => {
    const tracks: Track[] = [mockTrack, { ...mockTrack, id: '2', title: 'Next Song' }];
    service.queue.set(tracks);
    service.currentTrack.set(tracks[0]);

    service.nextTrack();
    expect(service.currentTrack()?.id).toBe('2');

    service.previousTrack();
    expect(service.currentTrack()?.id).toBe('1');
  });

  it('should seek to time', () => {
    service.seek(45);
    expect(mockAudio.currentTime).toBe(45);
  });
});
