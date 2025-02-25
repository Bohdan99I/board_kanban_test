import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

class URLMock {
  pathname: string;
  constructor(url: string) {
    this.pathname = new URL(url).pathname;
  }
}

global.URL = URLMock as typeof URL;

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.clear.mockReset();
  localStorageMock.removeItem.mockReset();
  localStorageMock.key.mockReset();
});