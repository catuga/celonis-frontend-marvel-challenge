import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Hero } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private heroes: Hero[] = [];
  private http = inject(HttpClient);

  // Loads heroes
  loadHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>('assets/json/wikipedia_marvel_data.json').pipe(
      tap((data) => {
        this.heroes = data;
      })
    );
  }

  // Get heroes
  getHeroes(): Hero[] {
    return this.heroes;
  }
}
