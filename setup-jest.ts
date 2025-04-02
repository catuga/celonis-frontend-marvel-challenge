import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe(target: Element): void {}
  unobserve(target: Element): void {}
  disconnect(): void {}
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function() {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (_x: number, _y: number, _w: number, _h: number): ImageData => ({
        data: new Uint8ClampedArray(_w * _h * 4),
        width: _w,
        height: _h,
        colorSpace: 'srgb'
      }),
      putImageData: () => {},
      setTransform: () => {},
      resetTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 } as TextMetrics),
      transform: () => {},
      rect: () => {},
      clip: () => {},
      canvas: this,
      width: 100,
      height: 100,
      style: {},
      getTransform: () => ({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0
      })
    };
  }
});

// Setup Zone.js test environment
setupZoneTestEnv();

TestBed.configureTestingModule({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting()
  ]
});