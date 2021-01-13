import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { PositionAbs } from 'src/app/services/abstract-classes.service';
import { ObserverService } from 'src/app/services/observer.service';
import { NbToastrService, NbToastRef, NbGlobalLogicalPosition, NbIconConfig, NbGlobalPhysicalPosition } from '@nebular/theme';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionComponent extends PositionAbs implements OnInit {
  @Input() x: number;
  @Input() y: number;
  @Input() indexMap: number;
  // @Input() Bounds: number;


  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, private toastr: NbToastrService, public ngZone: NgZone) {
    super(observer, detection, ngZone);
  }

  ngOnInit(): void {
    this.time();
    this.indexABS = this.indexMap;
  }
  checkEdge(event) {
    this.edge = event;
    console.log('edge:', event);
  }
  infoPuesto() {
    const iconConfig: NbIconConfig = { icon: 'headphones-outline', pack: 'eva' };
    const toastRef: NbToastRef = this.toastr.show(this.x, this.y,
      {
        preventDuplicates: true,
        duration: 0,
        destroyByClick: true,
        duplicatesBehaviour: 'all',
        status: 'success', limit: 3,
        position: NbGlobalPhysicalPosition.BOTTOM_LEFT, // NbGlobalLogicalPosition.TOP_END,
        icon: iconConfig
      }
    );
    // toastRef.close();
  }





}
