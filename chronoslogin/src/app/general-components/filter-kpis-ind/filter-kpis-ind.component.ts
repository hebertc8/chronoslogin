import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LobSkill, FilterSelected, KpisSelect } from 'src/app/services/interfaces';
import { ObserverService } from 'src/app/services/observer.service';

@Component({
  selector: 'app-filter-kpis-ind',
  templateUrl: './filter-kpis-ind.component.html',
  styleUrls: ['./filter-kpis-ind.component.scss']
})
export class FilterKpisIndComponent implements OnInit {
  @Output() filter = new EventEmitter();
  private lobsSkill: LobSkill[] = [];
  public lobs: string[] = [];
  public skills: number[] = [];
  public filterSelected: FilterSelected = {
    indicator: undefined,
    lobkpiInd: undefined,
    skillKpiInd: undefined
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
      this.filterSelected.skillKpiInd = [];
      this.skills = [];
      console.log(this.filterSelected, 'Filtroooo individual');

      this.filterSelected.lobkpiInd.forEach(lob => {
        this.skills.push(
          // tslint:disable-next-line: max-line-length
          ...new Set(this.lobsSkill.map(data => { if (data.Lob === lob) { return data.Skill; } }).filter(data => data !== undefined))
        );
      });
      this.skills.sort();
      // this.skills = this.lobsSkill.filter(data => data.Lob === this.filterSelected.lobKpi).map(data => data.Skill);
      // console.log(this.skills, 'skillllllllllllllllllllllllllllllls',
      //   this.lobsSkill.filter(data => data.Lob === this.filterSelected.lobKpi),
      //   this.filterSelected);
    }
  }

}
