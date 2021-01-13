import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LobSkill, KpisSelect, FilterSelected } from 'src/app/services/interfaces';
import { ObserverService } from 'src/app/services/observer.service';

@Component({
  selector: 'app-filter-kpis',
  templateUrl: './filter-kpis.component.html',
  styleUrls: ['./filter-kpis.component.scss']
})
export class FilterKpisComponent implements OnInit {
  @Output() filter = new EventEmitter();
  private lobsSkill: LobSkill[] = [];
  public lobs: string[] = [];
  public skills: number[] = [];
  public filterSelected: FilterSelected = {
    indicator: undefined,
    lobKpi: undefined,
    skillKpi: undefined
  };
  public kpisSelect: KpisSelect[] = [
    {
      name: 'AHT',
      indicator: 'AHT'
    },
    {
      name: 'Service level',
      indicator: 'NDS'

    },
    {
      name: 'Attention level',
      indicator: 'NDA'
    },
    {
      name: 'Queue',
      indicator: 'Queue'
    },
    {
      name: 'Abandoned calls',
      indicator: 'ABN'
    },
    {
      name: 'Answered calls',
      indicator: 'ACD'
    },
  ];

  constructor(private observer: ObserverService) {
    this.lobsSkill = this.observer.viewLobSkill;
  }

  ngOnInit(): void {
    this.lobs = [...new Set(this.lobsSkill.map(data => data.Lob))];
  }

  validateSelect(v) {
    this.filter.emit(this.filterSelected);
    if (v) {
      this.filterSelected.skillKpi = undefined;
      this.skills = this.lobsSkill.filter(data => data.Lob === this.filterSelected.lobKpi).map(data => data.Skill).sort();
      console.log(this.skills, 'skillllllllllllllllllllllllllllllls',
        this.lobsSkill.filter(data => data.Lob === this.filterSelected.lobKpi),
        this.filterSelected);
    }
  }

}
