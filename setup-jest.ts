import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

setupZoneTestEnv();

TestBed.configureTestingModule({
  imports: [HttpClientModule]
});