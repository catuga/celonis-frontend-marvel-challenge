import { Component } from '@angular/core';
import { HeroesTableComponent } from './components/heroes-table/heroes-table.component';

@Component({
  selector: 'app-root',
  imports: [HeroesTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
