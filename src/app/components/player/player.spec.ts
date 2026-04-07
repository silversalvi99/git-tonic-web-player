import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Player as PlayerComponent } from './player';
import { WebPlayer as PlayerService } from '../../services/web-player/web-player';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MiniPlayer } from './components/mini-player/mini-player';
import { ExpandedPlayer } from './components/expanded-player/expanded-player';
import { TranslateModule } from '@ngx-translate/core';

describe('PlayerComponent Orchestration', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let mockPlayerService: any;

  beforeEach(async () => {
    mockPlayerService = {
      currentTrack: signal(null),
      isPlaying: signal(false),
      isOpenMode: signal(false),
      isSeeking: signal(false),
      currentTime: signal(0),
      duration: signal(0),
      volume: signal(1),
      queue: signal([]),
      playTrack: vi.fn(),
      togglePlay: vi.fn(),
      pause: vi.fn(),
      play: vi.fn(),
      nextTrack: vi.fn(),
      previousTrack: vi.fn(),
      setVolume: vi.fn(),
      seek: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PlayerComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show mini-player by default', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-mini-player')).toBeTruthy();
    expect(compiled.querySelector('app-expanded-player')).toBeFalsy();
  });

  it('should show expanded-player when isOpenMode is true', async () => {
    mockPlayerService.isOpenMode.set(true);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-mini-player')).toBeFalsy();
    expect(compiled.querySelector('app-expanded-player')).toBeTruthy();
  });

  it('should toggle isOpenMode signal on output emissions', () => {
    // Test toggleOpenMode from mini-player
    component.toggleOpenMode();
    expect(mockPlayerService.isOpenMode()).toBe(true);

    // Test toggleOpenMode again to start closing animation
    component.toggleOpenMode();
    // At this point isClosing should be true
    // Wait for the timeout (in real app) or check the signal
    // For unit testing the orchestrator, we just check if it calls the service or sets signals
  });
});
