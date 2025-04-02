import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Hero } from '../../models/interfaces';
import { HeroesService } from '../../services/heroes.service';
import { HeroChipFilterComponent } from '../hero-chip-filter/hero-chip-filter.component';
import { HeroDialogComponent } from '../hero-dialog/hero-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-heroes-table',
  imports: [
    MatTableModule,
    MatInputModule,
    MatSortModule,
    HeroChipFilterComponent,
    MatButtonModule,
    MatIconModule,
    ChartComponent
  ],
  templateUrl: './heroes-table.component.html',
})
export class HeroesTableComponent implements OnInit {
  displayedColumns: string[] = [
    'nameLabel',
    'genderLabel',
    'citizenshipLabel',
    'skillsLabel',
    'occupationLabel',
    'memberOfLabel',
    'creatorLabel',
    'actions'
  ];
  dataSource = new MatTableDataSource<Hero>();
  selectedHeroes: string[] = [];
  private heroesService = inject(HeroesService);
  private dialog = inject(MatDialog);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit(): void {
    this.heroesService.loadHeroes().subscribe((heroes: Hero[]) => {
      this.dataSource.data = heroes;
      this.dataSource.sort = this.sort;
    });
  }

  // Chips filter
  applyFilter(): void {
    this.dataSource.filterPredicate = (data: Hero, filter: string) => {
      if (!filter) return true;
      const filters = filter.split(',').map((f) => f.trim().toLowerCase());
      return filters.some((f) =>
        data.nameLabel.toLowerCase().replace(/\s+/g, '').includes(f)
      );
    };
    const normalizedFilters = this.selectedHeroes.map((name) =>
      name.toLowerCase().replace(/\s+/g, '')
    );
    this.dataSource.filter = normalizedFilters.join(',');
  }

  // Open modal with hero info
  viewHero(hero: Hero): void {
    const processedHero = this.heroesService.normalizeSkills(hero);

    this.dialog.open(HeroDialogComponent, {
      data: { ...processedHero, isEdit: false },
      disableClose: false,
    });
  }

  // Open modal to create hero
  createHero(): void {
    const dialogRef = this.dialog.open(HeroDialogComponent, {
      data: {
        nameLabel: '',
        genderLabel: null,
        citizenshipLabel: '',
        skillsLabel: [],
        occupationLabel: '',
        memberOfLabel: '',
        creatorLabel: null,
        isEdit: true,
      },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.heroesService.addHero(result);
        this.dataSource.data = this.heroesService.getHeroes();
      }
    });
  }

  // Open modal to edit hero
  editHero(hero: Hero): void {
    const processedHero = this.heroesService.normalizeSkills(hero);
    const dialogRef = this.dialog.open(HeroDialogComponent, {
      data: { ...processedHero, isEdit: true },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.heroesService.updateHero(result, hero.nameLabel);
        this.dataSource.data = this.heroesService.getHeroes();
      }
    });
  }

  // Deletes a hero
  deleteHero(hero: Hero): void {
    if (confirm('Are you sure you want to delete this hero?')) {
      this.heroesService.deleteHero(hero);
      this.dataSource.data = this.heroesService.getHeroes();
    }
  }

  // Process data for chart
  getFrequencies(columnKey: keyof Hero): { label: string; count: number }[] {
    const freqMap = new Map<string, number>();
  
    this.dataSource.data.forEach((hero) => {
      const value = hero[columnKey];
  
      if (Array.isArray(value)) {
        value.forEach((item) => {
          freqMap.set(item, (freqMap.get(item) || 0) + 1);
        });
      } else if (typeof value === 'string') {
        freqMap.set(value, (freqMap.get(value) || 0) + 1);
      }
    });
  
    return Array.from(freqMap.entries()).map(([label, count]) => ({ label, count }));
  } 
}
