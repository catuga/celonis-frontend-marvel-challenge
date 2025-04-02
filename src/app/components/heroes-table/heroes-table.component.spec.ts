import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesTableComponent } from './heroes-table.component';
import { HeroesService } from '../../services/heroes.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HeroesTableComponent', () => {
  let component: HeroesTableComponent;
  let fixture: ComponentFixture<HeroesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesTableComponent],
      providers: [
        HeroesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
