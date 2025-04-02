import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { Hero } from '../../models/interfaces';
import { HeroesService } from '../../services/heroes.service';
import { HeroChipFilterComponent } from '../hero-chip-filter/hero-chip-filter.component';

@Component({
  selector: 'app-heroes-table',
  imports: [
    MatTableModule,
    MatInputModule,
    MatSortModule,
    HeroChipFilterComponent
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
    'creatorLabel'
  ];
  dataSource = new MatTableDataSource<Hero>();
  selectedHeroes: string[] = [];
  private heroesService = inject(HeroesService);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit(): void {
    this.heroesService.loadHeroes().subscribe((heroes: Hero[]) => {
      this.dataSource.data = heroes;
      this.dataSource.sort = this.sort;
    });
  }


  applyFilter(): void {
    this.dataSource.filterPredicate = (data: Hero, filter: string) => {
      if (!filter) return true;
      const filters = filter.split(',').map(f => f.trim().toLowerCase());
      return filters.some(f =>
        data.nameLabel.toLowerCase().replace(/\s+/g, '').includes(f)
      );
    };
    const normalizedFilters = this.selectedHeroes.map(name =>
      name.toLowerCase().replace(/\s+/g, '')
    );
    this.dataSource.filter = normalizedFilters.join(',');
  }
}