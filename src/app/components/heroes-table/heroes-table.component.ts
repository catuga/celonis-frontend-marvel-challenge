import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { Hero } from '../../models/interfaces';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-heroes-table',
  imports: [
    MatTableModule,
    MatInputModule,
    MatSortModule
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
  private heroesService = inject(HeroesService);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit(): void {
    this.heroesService.loadHeroes().subscribe((heroes: Hero[]) => {
      this.dataSource.data = heroes;
      this.dataSource.sort = this.sort;
    });
  }
}