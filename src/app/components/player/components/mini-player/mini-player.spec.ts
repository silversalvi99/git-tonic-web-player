import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniPlayer as MiniPlayerComponent } from './mini-player';
import { WebPlayer as PlayerService } from '../../../../services/web-player/web-player';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { Track } from '../../../../models/track.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('MiniPlayerComponent', () => {
  let component: MiniPlayerComponent;
  let fixture: ComponentFixture<MiniPlayerComponent>;
  let mockPlayerService: any;

  beforeEach(async () => {
    mockPlayerService = {
      currentTrack: signal<Track | null>({
        id: '1',
        title: 'Test Title',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 120,
        coverThumb: 'test-url-thumb',
        coverFull: 'test-url-full',
        streamUrl: 'test-stream-url',
      }),
      isPlaying: signal(false),
      currentTime: signal(0),
      duration: signal(120),
      volume: signal(1),
      isSeeking: signal(false),
      repeatMode: signal('all'),
      previousTrack: vi.fn(),
      nextTrack: vi.fn(),
      togglePlay: vi.fn(),
      toggleRepeatMode: vi.fn(),
      seek: vi.fn(),
      setVolume: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MiniPlayerComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniPlayerComponent);
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

    const prevBtn = compiled.querySelector('[data-testid="player-prev"]') as HTMLButtonElement;
    const nextBtn = compiled.querySelector('[data-testid="player-next"]') as HTMLButtonElement;
    const playBtn = compiled.querySelector(
      '[data-testid="player-play-pause"]',
    ) as HTMLButtonElement;

    prevBtn.click();
    expect(mockPlayerService.previousTrack).toHaveBeenCalled();

    playBtn.click();
    expect(mockPlayerService.togglePlay).toHaveBeenCalled();

    nextBtn.click();
    expect(mockPlayerService.nextTrack).toHaveBeenCalled();
  });

  it('should handle volume changes', () => {
    const volumeInput = fixture.nativeElement.querySelector(
      '[data-testid="player-volume"]',
    ) as HTMLInputElement;
    volumeInput.value = '0.5';
    volumeInput.dispatchEvent(new Event('input'));
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(0.5);
  });

  it('should toggle mute', () => {
    const muteBtn = fixture.nativeElement.querySelector(
      '[data-testid="player-mute"]',
    ) as HTMLButtonElement;

    muteBtn.click();
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(0);

    mockPlayerService.volume.set(0);
    fixture.detectChanges();

    muteBtn.click();
    expect(mockPlayerService.setVolume).toHaveBeenCalledWith(1);
  });

  it('should emit toggleOpenMode when artwork/track info or expand handle is clicked', () => {
    const emitSpy = vi.spyOn(component.toggleOpenMode, 'emit');

    // Test track info area click (which contains artwork)
    const trackInfo = fixture.nativeElement.querySelector(
      '[data-testid="mini-player-track-info"]',
    ) as HTMLDivElement;
    trackInfo.click();
    expect(emitSpy).toHaveBeenCalledTimes(1);

    // Test expand handle click
    const expandHandle = fixture.nativeElement.querySelector(
      '[data-testid="mini-player-expand"]',
    ) as HTMLDivElement;
    expect(expandHandle).toBeTruthy();
    expandHandle.click();
    expect(emitSpy).toHaveBeenCalledTimes(2);
  });

  it('should toggle repeat mode when repeat button is clicked', () => {
    const repeatBtn = fixture.nativeElement.querySelector(
      '[data-testid="player-repeat"]',
    ) as HTMLButtonElement;
    repeatBtn.click();
    expect(mockPlayerService.toggleRepeatMode).toHaveBeenCalled();
  });
});
