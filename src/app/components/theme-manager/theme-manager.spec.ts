import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeManagerComponent } from './theme-manager';
import { SettingsService } from '../../services/settings/settings.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signal } from '@angular/core';

describe('ThemeManagerComponent', () => {
  let component: ThemeManagerComponent;
  let fixture: ComponentFixture<ThemeManagerComponent>;
  let settingsServiceMock: any;
  let mockMatchMedia: any;

  beforeEach(async () => {
    settingsServiceMock = {
      settings: signal({ language: 'en', theme: 'dark' }),
    };

    mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.stubGlobal('matchMedia', mockMatchMedia);

    await TestBed.configureTestingModule({
      imports: [ThemeManagerComponent],
      providers: [{ provide: SettingsService, useValue: settingsServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply dark class by default if service theme is dark', () => {
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class if service theme is light', () => {
    settingsServiceMock.settings.set({ language: 'en', theme: 'light' });
    fixture.detectChanges();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should handle system theme', () => {
    // Mock system preference as light
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: light)',
      addEventListener: vi.fn(),
    }));

    settingsServiceMock.settings.set({ language: 'en', theme: 'system' });
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
