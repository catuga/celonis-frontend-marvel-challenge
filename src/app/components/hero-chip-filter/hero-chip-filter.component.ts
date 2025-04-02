import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-chip-filter',
  standalone: true,
  imports: [
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './hero-chip-filter.component.html'
})
export class HeroChipFilterComponent {
  @Input() selectedHeroes: string[] = [];
  @Output() selectedHeroesChange = new EventEmitter<string[]>();

  addChip(event: MatChipInputEvent): void {
    const value = event.value.trim();
    if (value && !this.selectedHeroes.includes(value)) {
      this.selectedHeroes.push(value);
      this.selectedHeroesChange.emit(this.selectedHeroes);
    }

    event.chipInput!.clear();
  }

  removeChip(heroName: string): void {
    this.selectedHeroes = this.selectedHeroes.filter(
      (name) => name !== heroName
    );
    this.selectedHeroesChange.emit(this.selectedHeroes);
  }
}
