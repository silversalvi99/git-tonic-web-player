import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TracksList } from './tracks-list';
import { RestApi } from '../../services/api/rest-api';
import { WebPlayer } from '../../services/web-player/web-player';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TracksListComponent', () => {
  let component: TracksList;
  let fixture: ComponentFixture<TracksList>;
  let mockRestApi: any;
  let mockPlayer: any;

  beforeEach(async () => {
    mockRestApi = {
      randomTracksResource: {
        hasValue: signal(true),
        value: signal([
          {
            id: '1',
            title: 'Test Song',
            artist: 'Test Artist',
            album: 'Test Album',
            duration: 120,
            coverUrl: 'test-url',
            streamUrl: 'test-stream-url'
          }
        ]),
        isLoading: signal(false),
        error: signal(false)
      }
    };

    mockPlayer = {
      queue: signal([])
    };

    await TestBed.configureTestingModule({
      imports: [TracksList],
      providers: [
        provideZonelessChangeDetection(),
        { provide: RestApi, useValue: mockRestApi },
        { provide: WebPlayer, useValue: mockPlayer }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TracksList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the tracks list when hasValue is true', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-track-item')).toBeTruthy();
  });

  it('should reflect loading state', () => {
    mockRestApi.randomTracksResource.hasValue.set(false);
    mockRestApi.randomTracksResource.isLoading.set(true);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.animate-pulse')).toBeTruthy();
  });
});
