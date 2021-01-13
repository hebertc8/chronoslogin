import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterSelected } from 'src/app/services/interfaces';

@Component({
  selector: 'app-filter-agent-filter',
  templateUrl: './filter-agent-filter.component.html',
  styleUrls: ['./filter-agent-filter.component.scss']
})
export class FilterAgentFilterComponent implements OnInit {

  @Output() filter = new EventEmitter();
  public filterSelected: FilterSelected = { idsFilter: undefined};
  public color: any = '';
  public idAgentFiltro: string;
  constructor() {

  }

  ngOnInit(): void {

  }

  validateSelect() {

    const x = this.idAgentFiltro.split(';');
    let count = 0;
    x.forEach(id => {

      if (Number(id && Number(id) !== 0 && !Number.isNaN(Number(id))) && id.length > 4 && id.length <= 7) {
        count++;

      } else {
        this.color = 1;
        this.filterSelected.idsFilter = undefined;
        this.filter.emit(this.filterSelected);
      }
    });

    if (count === x.length) {
      this.color = 0;
      this.filterSelected.idsFilter = this.idAgentFiltro;
      this.filter.emit(this.filterSelected);
    }



  }



}
