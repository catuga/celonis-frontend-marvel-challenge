import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Hero } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private heroes: Hero[] = [];
  private http = inject(HttpClient);

  // Separate string skillsLabel if has "/"
  normalizeSkills(hero: Hero): Hero {
    return {
      ...hero,
      skillsLabel: typeof hero.skillsLabel === 'string'
        ? (hero.skillsLabel as string).split('/').map((skill: string) => skill.trim() as Skill)
        : Array.isArray(hero.skillsLabel)
          ? hero.skillsLabel
          : []
    };
  }

  // Loads heroes
  loadHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>('assets/json/wikipedia_marvel_data.json').pipe(
      tap(data => {
        this.heroes = data.map(this.normalizeSkills);
      })
    );
  }

  // Get heroes
  getHeroes(): Hero[] {
    return this.heroes;
  }
}
