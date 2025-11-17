// Setup file for Jest
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Initialize Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    hostname: 'localhost',
    href: 'http://localhost:4200',
    origin: 'http://localhost:4200',
    protocol: 'http:',
    host: 'localhost:4200',
    pathname: '/',
    search: '',
    hash: ''
  }
});
