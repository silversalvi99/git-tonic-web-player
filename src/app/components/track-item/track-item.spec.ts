import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackItem } from './track-item';
import { WebPlayer } from '../../services/web-player/web-player';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('TrackItemComponent', () => {
  let component: TrackItem;
  let fixture: ComponentFixture<TrackItem>;
  let playerServiceSpy: any;

  beforeEach(async () => {
    playerServiceSpy = {
      playTrack: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TrackItem],
      providers: [{ provide: WebPlayer, useValue: playerServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackItem);
    component = fixture.componentInstance;

    // Set required inputs
    const mockTrack = {
      id: '1',
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 120,
      coverThumb: 'test-url-thumb',
      coverFull: 'test-url-full',
      streamUrl: 'test-stream-url',
    };
    fixture.componentRef.setInput('track', mockTrack);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display track info', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Song');
    expect(compiled.textContent).toContain('Test Artist');
  });

  it('should call playTrack on click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const div = compiled.querySelector('div.group') as HTMLElement;
    div.click();
    expect(playerServiceSpy.playTrack).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });
});
