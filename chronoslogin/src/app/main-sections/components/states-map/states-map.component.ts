import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Input, NgZone } from '@angular/core';
import { StatesMapAbs } from 'src/app/services/abstract-classes.service';
import { ObserverService } from 'src/app/services/observer.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { FilterSelected } from 'src/app/services/interfaces';

@Component({
  selector: 'app-states-map',
  templateUrl: './states-map.component.html',
  styleUrls: ['./states-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatesMapComponent extends StatesMapAbs implements OnInit {
  @Input() filter: FilterSelected;
  @Input() name: string;
  @Input() index: number;

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public functions: FunctionsService, public ngZone: NgZone) {
    super(observer, detection, functions, ngZone);
  }

  ngOnInit(): void {
    // console.log(this.filter, 'filtrooooooooo agente');
    this.init(this.name, this.index, this.filter);
    this.detection.detach();
    console.log(this.index, 'aadddddddddddddddd', this.name, this.filter);
    // this.reload();
  }
}
