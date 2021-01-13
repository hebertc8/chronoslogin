import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { ConsolidateAuxAbs } from 'src/app/services/abstract-classes.service';
import { FilterSelected } from 'src/app/services/interfaces';
import { ObserverService } from 'src/app/services/observer.service';

@Component({
  selector: 'app-consolidate-aux',
  templateUrl: './consolidate-aux.component.html',
  styleUrls: ['./consolidate-aux.component.scss']
})
export class ConsolidateAuxComponent extends ConsolidateAuxAbs implements OnInit {
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
