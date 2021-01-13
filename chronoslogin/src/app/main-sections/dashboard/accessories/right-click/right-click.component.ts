import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { ListComponents, FilterSelected } from 'src/app/services/interfaces';
import { Subscription } from 'rxjs';
import { ObserverService } from 'src/app/services/observer.service';


@Component({
  selector: 'app-right-click',
  templateUrl: './right-click.component.html',
  styleUrls: ['./right-click.component.scss'],
})
export class RightClickComponent implements OnInit, OnDestroy {

  // listComponent: NbIconConfig = { icon: 'settings-2-outline', pack: 'eva' };
  @Output() component = new EventEmitter();
  // @Output() config = new EventEmitter();

  listComponent: ListComponents[] = this.globalVariable.viewComponents;

  public componentSelected: ListComponents = {
    component: undefined,
    enabledCreate: false,
    icon: undefined,
    name: 'Select Component',
    nameToShow: 'Select Component',
    optionGrid: undefined,
    filter: undefined,
    filterIndex: undefined,
    filterComponent: '',
  };
  public subChangeCentral: Subscription;

  enabledCreate = false;
  viewFooter = false;

  constructor(private globalVariable: GlobalVariablesService, private observer: ObserverService) {
    this.subChangeCentral = this.observer.obsCurrentCentral().subscribe((res) => {
      this.close();
    });
  }

  ngOnInit(): void {
    // this.ComponentSelected.name = 'Select Component';
  }

  sendComponent() {
    this.component.emit(this.componentSelected);
    this.enabledCreate = false;
    this.viewFooter = false;
  }

  select(x) {
    this.componentSelected = x;
    this.componentSelected.filter = undefined;
    this.enabledCreate = x.enabledCreate;
  }

  close() {
    const c = { name: 'Close' };
    this.enabledCreate = false;
    this.viewFooter = false;
    // this.componentSelected.name = this.componentSelected.nameToShow = 'Select Component';
    this.component.emit(c);
  }

  setFilter(filter: FilterSelected) {
    console.log('Filterrrrrrrrrrrrrrrrrrrrrrrrrrr', filter)
    this.componentSelected.filter = filter;
    if (filter.lob || filter.lobKpi || (filter.lobkpiInd ? filter.lobkpiInd.length !== 0 : false || filter.idSupervisor || filter.NES) || filter.idsFilter || filter === 'Lob' || filter === 'Skill') {
      this.enabledCreate = true;
      this.componentSelected.enabledCreate = true;
    } else {
      this.enabledCreate = false;
      this.componentSelected.enabledCreate = false;
    }
  }

  openFooter() {
    this.viewFooter = !this.viewFooter;
  }

  ngOnDestroy() {
    if (this.subChangeCentral) { this.subChangeCentral.unsubscribe(); }
  }



}
