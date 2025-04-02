import { TestBed } from '@angular/core/testing';
import { HeroesService } from './heroes.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Hero } from '../models/interfaces';
import { Citizenship, Creator, Gender, MemberOf, Occupation, Skill } from '../models/enums';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
    localStorage.removeItem('marvelHeroes');
    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
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

    it('should update hero', () => {
      service.loadHeroes().subscribe();
      const req = httpMock.expectOne('assets/json/wikipedia_marvel_data.json');
      req.flush(mockHeroes);

      const updatedHero: Hero = {
        nameLabel: "Betty Ross",
        genderLabel: Gender.Female,
        citizenshipLabel: Citizenship.USA,
        skillsLabel: [Skill.SuperhumanStrength, Skill.Telepathy],
        occupationLabel: Occupation.Scientist,
        memberOfLabel: MemberOf.Avengers,
        creatorLabel: Creator.StanLee
      };

      service.updateHero(updatedHero);
      const heroes = service.getHeroes();
      
      expect(heroes.length).toBe(2);
      const updatedHeroInList = heroes.find(h => h.nameLabel === "Betty Ross");
      expect(updatedHeroInList).toBeTruthy();
      expect(updatedHeroInList?.citizenshipLabel).toBe(Citizenship.USA);
      expect(updatedHeroInList?.skillsLabel).toEqual([Skill.SuperhumanStrength, Skill.Telepathy]);
      expect(updatedHeroInList?.occupationLabel).toBe(Occupation.Scientist);
      expect(updatedHeroInList?.memberOfLabel).toBe(MemberOf.Avengers);
      expect(updatedHeroInList?.creatorLabel).toBe(Creator.StanLee);
    });

    it('should update hero with string skills', () => {
      service.loadHeroes().subscribe();
      const req = httpMock.expectOne('assets/json/wikipedia_marvel_data.json');
      req.flush(mockHeroes);


      const updatedHero: Hero = {
        nameLabel: "Betty Ross",
        genderLabel: Gender.Female,
        citizenshipLabel: Citizenship.USA,
        skillsLabel: 'superhuman strength / telepathy',
        occupationLabel: Occupation.Scientist,
        memberOfLabel: MemberOf.Avengers,
        creatorLabel: Creator.StanLee
      } as unknown as Hero;

      service.updateHero(updatedHero);
      const heroes = service.getHeroes();
      
      expect(heroes.length).toBe(2);
      const updatedHeroInList = heroes.find(h => h.nameLabel === "Betty Ross");
      expect(updatedHeroInList).toBeTruthy();
      expect(updatedHeroInList?.skillsLabel).toEqual([Skill.SuperhumanStrength, Skill.Telepathy]);
    });

    it('should delete hero', () => {
      service.loadHeroes().subscribe();
      const req = httpMock.expectOne('assets/json/wikipedia_marvel_data.json');
      req.flush(mockHeroes);

      const heroToDelete: Hero = {
        nameLabel: "Betty Ross",
        genderLabel: Gender.Female,
        citizenshipLabel: Citizenship.Asgard,
        skillsLabel: [Skill.EnergyBlasts],
        occupationLabel: Occupation.Actor,
        memberOfLabel: MemberOf.Alchemax,
        creatorLabel: Creator.FabianNicieza
      };

      service.deleteHero(heroToDelete);
      const heroes = service.getHeroes();
      
      expect(heroes.length).toBe(1);
      expect(heroes[0].nameLabel).toBe("Black Panther");
    });
  });
});
