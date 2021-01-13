import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  NbDialogService,
  NbToastrService,
  NbComponentStatus,
  NbGlobalPosition,
  NbGlobalLogicalPosition,
} from '@nebular/theme';
import { ConfigCreateComponent } from './config-create/config-create.component';
import { AdvisersListComponent } from './advisers-list/advisers-list.component';
import { MatrixListComponent } from './matrix-list/matrix-list.component';

@Component({
  selector: 'app-mision-bot-config',
  templateUrl: './mision-bot-config.component.html',
  styleUrls: ['./mision-bot-config.component.scss'],
})
export class MisionBotConfigComponent implements OnInit {
  settings = {
    mode: 'external',
    hideHeader: true,
    hideSubHeader: true,
    actions: {
      add: false,
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fas fa-edit iconSize"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fas fa-trash iconSize"></i>',
    },
    pager: {
      perPage: 5,
    },
    columns: {
      config: {
        title: 'list configurations',
        filter: false,
        editable: false,
      },
    },
  };

  data = [
    { config: 'prueba 1', id: 1 },
    { config: 'prueba 1', id: 2 },
    { config: 'prueba 1', id: 3 },
    { config: 'prueba 1', id: 4 },
    { config: 'prueba 1', id: 5 },
    { config: 'prueba 2', id: 6 },
    { config: 'prueba 2', id: 7 },
    { config: 'prueba 2', id: 8 },
    { config: 'prueba 2', id: 9 },
    { config: 'prueba 2', id: 10 },
  ];

  source: LocalDataSource;

  idRow: number = null;

  constructor(
    private dialog: NbDialogService,
    private toastrService: NbToastrService
  ) {
    this.source = new LocalDataSource(this.data);
  }

  ngOnInit(): void {}

  rowSelect(event) {
    this.idRow = event.data.id;
  }

  matrixView() {
    const dialog = this.dialog
      .open(MatrixListComponent, {
        closeOnBackdropClick: false,
        autoFocus: false,
        context: { id: this.idRow },
      })
      .onClose.subscribe((res) => {});
  }
  advisersView() {
    const dialog = this.dialog
      .open(AdvisersListComponent, {
        closeOnBackdropClick: false,
        autoFocus: false,
        context: { id: this.idRow },
      })
      .onClose.subscribe((res) => {});
  }

  createAction() {
    const dialog = this.dialog
      .open(ConfigCreateComponent, {
        closeOnBackdropClick: false,
        autoFocus: false,
        context: { context: [{ action: 'create' }] },
      })
      .onClose.subscribe((res) => {
        let status: NbComponentStatus;
        let position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
        if (res) {
          status = 'success';
          this.toastrService.show('Update successful', `Notification`, {
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

  editAction(event) {
    const dialog = this.dialog
      .open(ConfigCreateComponent, {
        closeOnBackdropClick: false,
        autoFocus: false,
        context: { context: [{ id: event.data.id, action: 'update' }] },
      })
      .onClose.subscribe((res) => {
        let status: NbComponentStatus;
        let position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
        if (res) {
          status = 'success';
          this.toastrService.show('Update successful', `Notification`, {
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
  deleteAction(event) {
    let status: NbComponentStatus;
    let position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;

    //mejorar pestaña de confirmacion
    if (window.confirm('Are you sure you want to delete?')) {
      let index = this.data.indexOf(event.data);
      this.data.splice(index, 1);
      this.source = new LocalDataSource(this.data);
      status = 'success';
      this.toastrService.show('Remove successful', `Notification`, {
        position,
        status,
        icon: { icon: 'thumbs-up', pack: 'fa' },
        destroyByClick: true,
      });
      // enviar id a eliminar (event.data.id)
    } else {
    }
  }
}
