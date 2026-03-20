import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Mock Audio to return a fresh instance each time
export const createMockAudio = () => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  src: '',
  volume: 1,
  currentTime: 0,
  duration: 0,
  ontimeupdate: null,
  onloadedmetadata: null,
  onerror: null,
  onplay: null,
  onpause: null,
});

// Setup global Audio mock using Vitest's stubGlobal
vi.stubGlobal(
  'Audio',
  vi.fn(() => createMockAudio()),
);

// Initialize the Angular testing environment if not already initialized
try {
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
} catch {
  // Environment already initialized or error during init
}
