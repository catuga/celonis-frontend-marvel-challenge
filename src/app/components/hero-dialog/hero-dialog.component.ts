import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Hero } from '../../models/interfaces';
import { Gender, Citizenship, Skill, Occupation, MemberOf, Creator } from '../../models/enums';

@Component({
  selector: 'app-hero-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './hero-dialog.component.html'
})
export class HeroDialogComponent {
  genderOptions = Object.values(Gender);
  citizenshipOptions = Object.values(Citizenship);
  skillOptions = Object.values(Skill);
  occupationOptions = Object.values(Occupation);
  memberOfOptions = Object.values(MemberOf);
  creatorOptions = Object.values(Creator);

  private dialogRef = inject(MatDialogRef<HeroDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as Hero & { isEdit: boolean };

  hero: Hero = {
    ...this.data,
    skillsLabel: Array.isArray(this.data.skillsLabel) ? this.data.skillsLabel : []
  };
  isEdit: boolean = this.data.isEdit;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.hero);
  }
}
