import { TestBed } from '@angular/core/testing';
import { HeroesService } from './heroes.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Hero } from '../models/interfaces';
import { Citizenship, Creator, Gender, MemberOf, Occupation, Skill } from '../models/enums';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  const mockHeroes: Hero[] = [
    {
      nameLabel: "Betty Ross",
      genderLabel: Gender.Female,
      citizenshipLabel: Citizenship.Asgard,
      skillsLabel: [Skill.EnergyBlasts],
      occupationLabel: Occupation.Actor,
      memberOfLabel: MemberOf.Alchemax,
      creatorLabel: Creator.FabianNicieza
    },
    {
      nameLabel: "Black Panther",
      genderLabel: Gender.Male,
      citizenshipLabel: Citizenship.Wakanda,
      skillsLabel: [Skill.EnergyBlasts, Skill.Photokinesis],
      occupationLabel: Occupation.Psychologist,
      memberOfLabel: MemberOf.HellfireClub,
      creatorLabel: Creator.JimLee
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroesService]
    });

    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('CRUD operations', () => {
    it('should create hero', () => {
      const newHero: Hero = {
        nameLabel: 'New Hero',
        genderLabel: Gender.Female,
        citizenshipLabel: Citizenship.Asgard,
        skillsLabel: [Skill.EnergyBlasts],
        occupationLabel: Occupation.Actor,
        memberOfLabel: MemberOf.Alchemax,
        creatorLabel: Creator.FabianNicieza
      }
  
      service.addHero(newHero);
  
      const heroes = service.getHeroes();
      expect(heroes.length).toBe(1);
      expect(heroes[0].nameLabel).toBe('New Hero');
      expect(heroes[0].skillsLabel).toEqual([Skill.EnergyBlasts]);
    });

    it('should read heroes', () => {
      service.loadHeroes().subscribe((heroes) => {
        expect(heroes.length).toBe(2);
      });
  
      const req = httpMock.expectOne('assets/json/wikipedia_marvel_data.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockHeroes);
    });
  })
});
