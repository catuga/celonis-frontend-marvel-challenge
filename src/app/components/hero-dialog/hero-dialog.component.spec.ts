import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDialogComponent } from './hero-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { Citizenship, Creator, Gender, MemberOf, Occupation, Skill } from '../../models/enums';
import { Hero } from '../../models/interfaces';

describe('HeroDialogComponent', () => {
  let component: HeroDialogComponent;
  let fixture: ComponentFixture<HeroDialogComponent>;
  const mockHero: Hero = {
    nameLabel: "Black Panther",
    genderLabel: Gender.Male,
    citizenshipLabel: Citizenship.Wakanda,
    skillsLabel: [Skill.EnergyBlasts, Skill.Photokinesis],
    occupationLabel: Occupation.Psychologist,
    memberOfLabel: MemberOf.HellfireClub,
    creatorLabel: Creator.JimLee
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: DialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { ...mockHero, isEdit: true } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
