import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Hero } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private heroes: Hero[] = [];
  private http = inject(HttpClient);
  private localStorageKey = 'marvelHeroes';

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
    const stored = localStorage.getItem(this.localStorageKey);
    if (stored) {
      this.heroes = JSON.parse(stored).map(this.normalizeSkills);
      return of(this.heroes);
    } else {
      return this.http
        .get<Hero[]>('assets/json/wikipedia_marvel_data.json')
        .pipe(
          tap((data) => {
            this.heroes = data.map(this.normalizeSkills);
            localStorage.setItem(
              this.localStorageKey,
              JSON.stringify(this.heroes)
            );
          })
        );
    }
  }

  // Get heroes
  getHeroes(): Hero[] {
    return this.heroes;
  }

  // Adds hero
  addHero(hero: Hero): void {
    const normalized = this.normalizeSkills(hero);
    this.heroes = [normalized, ...this.heroes];
    this.saveHeroes();
  }

  // Updates a hero
  updateHero(updatedHero: Hero, originalName?: string): void {
    const searchName = originalName || updatedHero.nameLabel;
    const heroToUpdate = this.heroes.find(
      (h) =>
        this.normalizeString(h.nameLabel) === this.normalizeString(searchName)
    );

    if (heroToUpdate) {
      Object.assign(heroToUpdate, this.normalizeSkills(updatedHero));
      this.saveHeroes();
    }
  }

  // Deletes a hero
  deleteHero(hero: Hero): void {
    this.heroes = this.heroes.filter(
      (h) =>
        this.normalizeString(h.nameLabel) !==
        this.normalizeString(hero.nameLabel)
    );
    this.saveHeroes();
  }

  // Saves heroes in localstore
  private saveHeroes(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.heroes));
  }
}
