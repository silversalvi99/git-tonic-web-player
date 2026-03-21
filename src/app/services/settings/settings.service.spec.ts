import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { TranslateService } from '@ngx-translate/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SettingsService', () => {
  let service: SettingsService;
  let translateServiceMock: any;
  const STORAGE_KEY = 'gin_tonic_settings';

  beforeEach(() => {
    // Mock Translate
    translateServiceMock = {
      use: vi.fn(),
      setDefaultLang: vi.fn(),
      getBrowserLang: vi.fn().mockReturnValue('en'),
    };

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock localStorage pulito per ogni test
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        for (const key in store) delete store[key];
      }),
    });

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        SettingsService,
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });

    service = TestBed.inject(SettingsService);
  });

  it('should update language and persist', () => {
    service.updateLanguage('it');

    TestBed.tick();

    expect(service.settings().language).toBe('it');

    const storedData = localStorage.getItem(STORAGE_KEY);
    expect(storedData).not.toBeNull();

    const parsed = JSON.parse(storedData!);
    expect(parsed.language).toBe('it');
  });

  it('should update theme and persist', () => {
    service.updateTheme('light');

    TestBed.tick();

    expect(service.settings().theme).toBe('light');

    const storedData = localStorage.getItem(STORAGE_KEY);
    expect(storedData).not.toBeNull();

    const parsed = JSON.parse(storedData!);
    expect(parsed.theme).toBe('light');
  });
});
