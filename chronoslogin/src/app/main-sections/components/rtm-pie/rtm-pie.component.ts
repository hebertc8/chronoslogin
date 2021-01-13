import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { RtmPieAbs } from 'src/app/services/abstract-classes.service';
import { FilterSelected } from 'src/app/services/interfaces';
import { ObserverService } from 'src/app/services/observer.service';

@Component({
  selector: 'app-rtm-pie',
  templateUrl: './rtm-pie.component.html',
  styleUrls: ['./rtm-pie.component.scss']
})
export class RtmPieComponent extends RtmPieAbs implements OnInit {

  @Input() filter: FilterSelected;
  @Input() name: string;
  @Input() index: number;

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public theme: NbThemeService, public ngZone: NgZone) {
    super(observer, detection,theme, ngZone);
  }


  ngOnInit(): void {
    this.init(this.name, this.index, this.filter);
    this.detection.detach();
  }



}
