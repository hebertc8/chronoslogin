import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapAbs } from 'src/app/services/abstract-classes.service';
import { ObserverService } from 'src/app/services/observer.service';
import { FilterSelected } from 'src/app/services/interfaces';

@Component({
  selector: 'app-map-v3',
  templateUrl: './map-v3.component.html',
  styleUrls: ['./map-v3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapV3Component extends MapAbs implements OnInit {

  @Input() filter: FilterSelected;
  @Input() name: string;
  @Input() index: number;

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, detection, ngZone);
  }

  ngOnInit() {
    console.log(this.filter, 'filtrooooooooo Mapa', this.index);
    this.init(this.name, this.index, this.filter);
  }

  checkEdge(event) {
    // this.edge = event;
    console.log('edge:', event);
  }


}
