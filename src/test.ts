import '@analogjs/vite-plugin-angular/setup-vitest';
import { vi } from 'vitest';

// Mock Audio
const mockAudio = {
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
};

vi.stubGlobal('Audio', vi.fn(() => mockAudio));
