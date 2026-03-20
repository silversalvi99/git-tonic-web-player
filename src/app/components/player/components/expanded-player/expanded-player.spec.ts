import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpandedPlayer as ExpandedPlayerComponent } from './expanded-player';
import { WebPlayer as PlayerService } from '../../../../services/web-player/web-player';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { Track } from '../../../../models/track.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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
      previousTrack: vi.fn(),
      nextTrack: vi.fn(),
      togglePlay: vi.fn(),
      seek: vi.fn(),
      setVolume: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExpandedPlayerComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandedPlayerComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('currentColors', ['#111', '#222', '#333']);
    fixture.componentRef.setInput('isLightBackground', false);
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
    // Find the paragraph with data-testid or text content
    const artist = compiled.querySelector('[data-testid="expanded-player-artist"]');
    expect(artist?.textContent?.trim()).toBe('Expanded Test Artist');
  });

  it('should apply correct color classes for dark background', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector(
      '[data-testid="expanded-player-title"]',
    ) as HTMLElement;
    expect(title.classList.contains('text-zinc-950')).toBe(false);
  });

  it('should apply correct color classes for light background', async () => {
    fixture.componentRef.setInput('isLightBackground', true);
    await fixture.whenStable();
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector(
      '[data-testid="expanded-player-title"]',
    ) as HTMLElement;
    expect(title.classList.contains('text-zinc-950')).toBe(true);
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

  it('should handle seeker changes', () => {
    const seeker = fixture.nativeElement.querySelector(
      '[data-testid="player-seek"]',
    ) as HTMLInputElement;
    seeker.value = '100';
    seeker.dispatchEvent(new Event('change'));
    expect(mockPlayerService.seek).toHaveBeenCalledWith(100);
  });

  it('should handle volume changes', () => {
    const volume = fixture.nativeElement.querySelector(
      '[data-testid="player-volume"]',
    ) as HTMLInputElement;
    volume.value = '0.5';
    volume.dispatchEvent(new Event('input'));
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(0.5);
  });
});
