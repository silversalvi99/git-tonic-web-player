import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TracksList } from './tracks-list';
import { RestApi } from '../../services/api/rest-api';
import { WebPlayer } from '../../services/web-player/web-player';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('TracksListComponent', () => {
  let component: TracksList;
  let fixture: ComponentFixture<TracksList>;
  let mockRestApi: any;
  let mockPlayer: any;

  beforeEach(async () => {
    const mockResource = {
      hasValue: signal(true),
      value: signal([
        {
          id: '1',
          title: 'Test Song',
          artist: 'Test Artist',
          album: 'Test Album',
          duration: 120,
          coverThumb: 'test-url-thumb',
          coverFull: 'test-url-full',
          streamUrl: 'test-stream-url',
        },
      ]),
      isLoading: signal(false),
      error: signal(false),
    };

    mockRestApi = {
      tracks: signal(mockResource),
    };

    mockPlayer = {
      queue: signal([]),
      currentTrack: signal(null),
      isPlaying: signal(false),
      isSeeking: signal(false),
      currentTime: signal(0),
      duration: signal(0),
      volume: signal(1),
    };

    await TestBed.configureTestingModule({
      imports: [TracksList, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        { provide: RestApi, useValue: mockRestApi },
        { provide: WebPlayer, useValue: mockPlayer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TracksList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the tracks list when hasValue is true', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-track-item')).toBeTruthy();
  });

  it('should reflect loading state', async () => {
    const resource = mockRestApi.tracks();
    resource.hasValue.set(false);
    resource.isLoading.set(true);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.animate-pulse')).toBeTruthy();
  });
});
