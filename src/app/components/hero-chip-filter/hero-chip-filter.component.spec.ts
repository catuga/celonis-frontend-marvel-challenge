import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroChipFilterComponent } from './hero-chip-filter.component';

describe('HeroChipFilterComponent', () => {
  let component: HeroChipFilterComponent;
  let fixture: ComponentFixture<HeroChipFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroChipFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroChipFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
