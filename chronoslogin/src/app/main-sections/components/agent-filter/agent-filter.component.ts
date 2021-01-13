import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { AgentAbs } from 'src/app/services/abstract-classes.service';
import { ObserverService } from 'src/app/services/observer.service';
import { FilterSelected } from 'src/app/services/interfaces';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-agent-filter',
  templateUrl: './agent-filter.component.html',
  styleUrls: ['./agent-filter.component.scss']
})
export class AgentFilterComponent extends AgentAbs implements OnInit {
  @Input() filter: FilterSelected;
  @Input() name: string;
  @Input() index: number;

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, detection, ngZone);
  }

  ngOnInit(): void {
    this.init(this.name, this.index, this.filter);
    this.detection.detach();
  }

}
