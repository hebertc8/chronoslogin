import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FilterSelected, ListSupervisor, LobSkill } from 'src/app/services/interfaces';
import { Subscription } from 'rxjs';
import { ObserverService } from 'src/app/services/observer.service';


@Component({
  selector: 'app-config-component',
  templateUrl: './config-component.component.html',
  styleUrls: ['./config-component.component.scss']
})

export class ConfigComponentComponent implements OnInit, OnDestroy {

  @Input() indexFilter: number;
  public filterList = new Object();
  public filterSelected: FilterSelected = {
    lob: [],
    skill: [],
    subLob: [],
  };
  public subsGetInfo: Subscription;
  public lobsSkill: LobSkill[] = [];

  public listSupervisor: ListSupervisor[] = [];

  public idccmsSupervisorSelected: number;
  public supervisorToSend: ListSupervisor;
  private nesting = 'Nes_';
  public nestingCheckbox = false;
  @Output() filter = new EventEmitter();

  columns = 12;

  constructor(private observer: ObserverService) {
    this.lobsSkill = this.observer.viewLobSkill;
  }

  ngOnInit(): void {
    this.filterList[this.indexFilter] = {
      lobs: [...new Set(this.lobsSkill.map(data => data.Lob))],
      subLob: [],
      skill: [],
    };
    this.listSupervisor = this.observer.viewListSupervisor;
  }

  reset() {
    this.filterSelected = {
      lob: [],
      skill: [],
      subLob: [],
    };
    this.supervisorToSend = undefined;
    this.idccmsSupervisorSelected = undefined;
    this.nestingCheckbox = false;
    // this.filter.emit(this.supervisorToSend);
  }

  sendFilter(n) {
    switch (n) {
      case 1:
        this.filterSelected.subLob = [];
        this.filterSelected.skill = [];
        this.filterList[this.indexFilter].subLob = [];
        this.filterSelected.lob.forEach(lob => {
          this.filterList[this.indexFilter].subLob.push(
            ...new Set(this.lobsSkill.map(data => { if (data.Lob === lob) { return data.SubLob; } }).filter(data => data !== undefined))
          );
        });
        // console.log(this.filterSelected, 'AYUDAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        // if (this.filterSelected.lob[0] !== null && this.filterSelected.lob[0] !== 'Todos') {

        //   if (this.filterSelected.subLob[0] !== null && this.filterSelected.subLob[0] !== 'Todos') {
        //     this.columns = 12 / 3;
        //   } else {
        //     this.columns = 12 / 2;

        //   }
        // } else {

        //   this.columns = 12;
        //   this.filterSelected.subLob[0] = null;
        //   this.filterSelected.skill[0] = null;
        // }
        this.filterList[this.indexFilter].skill = [];
        this.filterSelected.subLob.forEach(sublob => {
          this.filterList[this.indexFilter].skill.push(
            // tslint:disable-next-line: max-line-length
            ...new Set(this.lobsSkill.map(data => { if (data.SubLob === sublob) { return data.Skill; } }).filter(data => data !== undefined))
          );
        });
        this.filterList[this.indexFilter].skill.sort();
        break;
      case 2:
        this.filterSelected.skill = [];
        this.filterList[this.indexFilter].skill = [];
        this.filterSelected.subLob.forEach(sublob => {
          this.filterList[this.indexFilter].skill.push(
            // tslint:disable-next-line: max-line-length
            ...new Set(this.lobsSkill.map(data => { if (data.SubLob === sublob) { return data.Skill; } }).filter(data => data !== undefined))
          );
        });
        this.filterList[this.indexFilter].skill.sort();
        // if (this.filterSelected.subLob[0] !== null && this.filterSelected.subLob[0] !== 'Todos') {
        //   this.columns = 12 / 3;
        // } else {
        //   this.columns = 6;
        //   this.filterSelected.skill[0] = null;
        // }
        
        break;
      case 3:
        break;
      }
      
      this.filter.emit(this.filterSelected);
  }

  nestingCheked(e) {
    this.nestingCheckbox = e;
    if (e) {
      this.filter.emit({ NES: this.nesting });
    } else {
      this.filter.emit(undefined);
    }
  }

  ngOnDestroy() {
    if (this.subsGetInfo) { this.subsGetInfo.unsubscribe(); }
  }


  validateSupervisorSelected() {
    // this.supervisorToSend = this.listSupervisor.find(s => Number(s.idSupervisor) === Number(this.idccmsSupervisorSelected));
    if (this.supervisorToSend) {
      this.filter.emit(this.supervisorToSend);
    }
  }

}
