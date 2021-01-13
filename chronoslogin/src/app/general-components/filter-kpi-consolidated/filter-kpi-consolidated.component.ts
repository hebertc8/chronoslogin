import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-kpi-consolidated',
  templateUrl: './filter-kpi-consolidated.component.html',
  styleUrls: ['./filter-kpi-consolidated.component.scss']
})
export class FilterKpiConsolidatedComponent implements OnInit {
  @Output() filter = new EventEmitter();
  @Input() indexFilter: number;
  public filters = ['Lob', 'Skill'];
  public filterSelected;

  constructor() { }

  ngOnInit(): void {
  }

  filterSelect() {
    this.filter.emit(this.filterSelected);
  }

}
