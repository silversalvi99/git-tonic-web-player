import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Player as PlayerComponent } from './player';
import { WebPlayer as PlayerService } from '../../services/web-player/web-player';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { Track } from '../../models/track.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let mockPlayerService: any;

  beforeEach(async () => {
    mockPlayerService = {
      currentTrack: signal<Track | null>({
        id: '1',
        title: 'Test Title',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 120,
        coverUrl: 'test-url',
        streamUrl: 'test-stream-url',
      }),
      isPlaying: signal(false),
      currentTime: signal(0),
      duration: signal(120),
      volume: signal(1),
      previousTrack: vi.fn(),
      nextTrack: vi.fn(),
      togglePlay: vi.fn(),
      seek: vi.fn(),
      setVolume: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PlayerComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current track information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Title');
    expect(compiled.textContent).toContain('Test Artist');
  });

  it('should call playerService methods on control clicks', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // buttons: prev, play/pause, next
    const prevBtn = compiled.querySelector(
      'button[aria-label="Previous track"]',
    ) as HTMLButtonElement;
    const nextBtn = compiled.querySelector('button[aria-label="Next track"]') as HTMLButtonElement;
    const playBtn = compiled.querySelector('button[aria-label*="Play"]') as HTMLButtonElement;

    prevBtn.click();
    expect(mockPlayerService.previousTrack).toHaveBeenCalled();

    playBtn.click();
    expect(mockPlayerService.togglePlay).toHaveBeenCalled();

    nextBtn.click();
    expect(mockPlayerService.nextTrack).toHaveBeenCalled();
  });

  it('should handle volume changes', () => {
    const volumeInput = fixture.nativeElement.querySelector(
      'input[aria-label="Volume"]',
    ) as HTMLInputElement;
    volumeInput.value = '0.5';
    volumeInput.dispatchEvent(new Event('input'));
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(0.5);
  });

  it('should toggle mute', () => {
    const muteBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Mute/Unmute"]',
    ) as HTMLButtonElement;

    // Initial volume is 1
    muteBtn.click();
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(0);

    // Mock volume update to 0
    mockPlayerService.volume.set(0);
    fixture.detectChanges();

    muteBtn.click();
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(1);
  });
});
