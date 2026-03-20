import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { WebPlayer } from './services/web-player/web-player';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let mockWebPlayer: any;

  beforeEach(async () => {
    mockWebPlayer = {
      currentTrack: signal(null),
      isPlaying: signal(false),
      currentTime: signal(0),
      duration: signal(0),
      volume: signal(1),
    };

    await TestBed.configureTestingModule({
      imports: [App, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: WebPlayer, useValue: mockWebPlayer },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
