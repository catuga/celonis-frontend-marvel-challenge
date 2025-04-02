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

  // Normalize a string
  private normalizeString(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '');
  }

  // Normalize skills
  normalizeSkills(hero: Hero): Hero {
    return {
      ...hero,
      skillsLabel:
        typeof hero.skillsLabel === 'string'
          ? (hero.skillsLabel as string)
              .split('/')
              .map((skill: string) => skill.trim() as Skill)
          : Array.isArray(hero.skillsLabel)
          ? hero.skillsLabel
          : [],
    };
  }

  // Loads heroes
  loadHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>('assets/json/wikipedia_marvel_data.json').pipe(
      tap((data) => {
        this.heroes = data.map(this.normalizeSkills);
      })
    );
  }

  // Get heroes
  getHeroes(): Hero[] {
    return this.heroes;
  }

  // Adds hero
  addHero(hero: Hero): void {
    this.heroes.unshift(this.normalizeSkills(hero));
  }

  // Updates a hero
  updateHero(updatedHero: Hero, originalName?: string): void {
    const searchName = originalName || updatedHero.nameLabel;
    const index = this.heroes.findIndex(
      (h) => this.normalizeString(h.nameLabel) === this.normalizeString(searchName)
    );

    if (index !== -1) {
      this.heroes[index] = this.normalizeSkills(updatedHero);
    }
  }

  // Deletes a hero
  deleteHero(hero: Hero): void {
    this.heroes = this.heroes.filter(
      (h) => this.normalizeString(h.nameLabel) !== this.normalizeString(hero.nameLabel)
    );
  }
}
