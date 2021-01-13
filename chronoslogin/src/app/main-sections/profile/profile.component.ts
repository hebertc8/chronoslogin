import { Component, OnInit } from '@angular/core';
import {
  NbDialogService,
  NbToastrService,
  NbComponentStatus,
  NbGlobalPosition,
  NbIconConfig,
  NbGlobalLogicalPosition,
  NbGlobalPositionStrategy,
  NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { ManageCentralsComponent } from './manage-centrals/manage-centrals.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private dialog: NbDialogService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {}

  centralManager() {
    const dialog = this.dialog
      .open(ManageCentralsComponent, {
        closeOnBackdropClick: false,
        autoFocus: false,
        context: { CCMS: 3745293 },
      })
      .onClose.subscribe((res) => {
        let status: NbComponentStatus;
        const position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
        if (res) {
          status = 'success';
          this.toastrService.show('Saved successful', `Notification`, {
            position,
            status,
            icon: { icon: 'thumbs-up', pack: 'fa' },
            destroyByClick: true,
          });
        } else if (res == false) {
          status = 'danger';
          this.toastrService.show('Internal error', `Notification`, {
            position,
            status,
            icon: { icon: 'exclamation-triangle', pack: 'fa' },
            destroyByClick: true,
          });
        } else {

        }
      });
  }
}
