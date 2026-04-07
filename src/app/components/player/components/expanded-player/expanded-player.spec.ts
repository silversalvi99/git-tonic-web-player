import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpandedPlayer as ExpandedPlayerComponent } from './expanded-player';
import { WebPlayer as PlayerService } from '../../../../services/web-player/web-player';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { Track } from '../../../../models/track.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('ExpandedPlayerComponent', () => {
  let component: ExpandedPlayerComponent;
  let fixture: ComponentFixture<ExpandedPlayerComponent>;
  let mockPlayerService: any;

  beforeEach(async () => {
    mockPlayerService = {
      currentTrack: signal<Track | null>({
        id: '1',
        title: 'Expanded Test Title',
        artist: 'Expanded Test Artist',
        album: 'Expanded Test Album',
        duration: 240,
        coverThumb: 'test-url-thumb',
        coverFull: 'test-url-full',
        streamUrl: 'test-stream-url',
      }),
      isPlaying: signal(false),
      currentTime: signal(0),
      duration: signal(240),
      volume: signal(0.8),
      isSeeking: signal(false),
      queue: signal<Track[]>([]),
      previousTrack: vi.fn(),
      nextTrack: vi.fn(),
      togglePlay: vi.fn(),
      seek: vi.fn(),
      setVolume: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExpandedPlayerComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandedPlayerComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('currentColors', ['#111', '#222', '#333']);
    fixture.componentRef.setInput('isClosing', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display detailed track information', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('[data-testid="expanded-player-title"]')?.textContent?.trim(),
    ).toBe('Expanded Test Title');
    const artist = compiled.querySelector('[data-testid="expanded-player-artist"]');
    expect(artist?.textContent?.trim()).toBe('Expanded Test Artist');
  });

  it('should emit toggleClose when chevron down button is clicked', () => {
    const emitSpy = vi.spyOn(component.toggleClose, 'emit');
    const closeBtn = fixture.nativeElement.querySelector(
      '[data-testid="expanded-player-close"]',
    ) as HTMLButtonElement;
    closeBtn.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle large controls correctly', () => {
    // Mock queue to have tracks otherwise they are disabled
    mockPlayerService.queue.set([{ id: '1' } as Track, { id: '2' } as Track]);
    fixture.detectChanges();

    const prevBtn = fixture.nativeElement.querySelector(
      '[data-testid="player-prev"]',
    ) as HTMLButtonElement;
    prevBtn.click();
    expect(mockPlayerService.previousTrack).toHaveBeenCalled();

    const nextBtn = fixture.nativeElement.querySelector(
      '[data-testid="player-next"]',
    ) as HTMLButtonElement;
    nextBtn.click();
    expect(mockPlayerService.nextTrack).toHaveBeenCalled();

    const playBtn = fixture.nativeElement.querySelector(
      '[data-testid="player-play-pause"]',
    ) as HTMLButtonElement;
    playBtn.click();
    expect(mockPlayerService.togglePlay).toHaveBeenCalled();
  });

  it('should disable navigation buttons when queue is empty or has only one track', () => {
    // Case 1: Empty queue
    mockPlayerService.queue.set([]);
    fixture.detectChanges();

    const prevBtn = fixture.nativeElement.querySelector(
      '[data-testid="player-prev"]',
    ) as HTMLButtonElement;
    const nextBtn = fixture.nativeElement.querySelector(
      '[data-testid="player-next"]',
    ) as HTMLButtonElement;

    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(true);

    // Case 2: One track
    mockPlayerService.queue.set([{ id: '1' } as Track]);
    fixture.detectChanges();

    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(true);

    // Case 3: Multiple tracks
    mockPlayerService.queue.set([{ id: '1' } as Track, { id: '2' } as Track]);
    fixture.detectChanges();

    expect(prevBtn.disabled).toBe(false);
    expect(nextBtn.disabled).toBe(false);
  });

  it('should return the correct display time when dragging', () => {
    const seeker = fixture.nativeElement.querySelector(
      '[data-testid="player-seek"]',
    ) as HTMLInputElement;

    // Simulate drag (input event)
    seeker.value = '50';
    seeker.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Check displayTime indirectly via template if possible, or directly from component
    // displayTime is protected, but in TS we can access it for testing or check internal state
    expect((component as any).displayTime()).toBe(50);
    expect(mockPlayerService.isSeeking()).toBe(true);

    // Simulate end drag (change event)
    seeker.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(mockPlayerService.seek).toHaveBeenCalledWith(50);
  });

  it('should handle volume changes', () => {
    const volume = fixture.nativeElement.querySelector(
      '[data-testid="player-volume"]',
    ) as HTMLInputElement;
    volume.value = '0.5';
    volume.dispatchEvent(new Event('input'));
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(0.5);
  });

  it('should toggle mute/unmute', () => {
    mockPlayerService.volume.set(0.8);
    component.toggleMute();
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(0);

    mockPlayerService.volume.set(0);
    component.toggleMute();
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(1);
  });
});
