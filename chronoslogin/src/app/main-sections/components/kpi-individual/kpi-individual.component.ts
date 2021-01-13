import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ObserverService } from 'src/app/services/observer.service';
import { KpiIndividualAbs } from 'src/app/services/abstract-classes.service';
import { FilterSelected } from 'src/app/services/interfaces';

@Component({
  selector: 'app-kpi-individual',
  templateUrl: './kpi-individual.component.html',
  styleUrls: ['./kpi-individual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiIndividualComponent extends KpiIndividualAbs  implements OnInit {

  @Input() filter: FilterSelected;
  @Input() name: string;
  @Input() index: number;

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, detection, ngZone);
  }

  ngOnInit(): void {
    console.log(this.filter, 'filtrooooooooo kpi Individual', this.name);
    this.init(this.name, this.index, this.filter);
    // this.random();
  }

}
