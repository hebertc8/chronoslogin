import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { ActivateComponent } from './activate/activate.component';
import {
  NbDialogService,
  NbToastrService,
  NbGlobalLogicalPosition,
  NbGlobalPosition,
  NbComponentStatus,
} from '@nebular/theme';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard-mision-bot',
  templateUrl: './dashboard-mision-bot.component.html',
  styleUrls: ['./dashboard-mision-bot.component.scss'],
})
export class DashboardMisionBotComponent implements OnInit {
  settings = {
    mode: 'external',
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      position: 'right',
    },
    delete: {
      deleteButtonContent: '<i class="fas fa-trash iconSize"></i>',
    },
    attr: {
      class: 'tablePrimary',
    },
    columns: {
      id: {
        title: 'ID',
        filter: false,
        editable: false,
      },
      name: {
        title: 'Full Name',
        filter: false,
        editable: false,
      },
      date: {
        title: 'Finished',
        filter: false,
        editable: false,
        valuePrepareFunction: (date) => {
          var raw = new Date(date);
          var formatted = this.datePipe.transform(raw, 'yyyy-MM-dd ');
          return formatted;
        },
      },
    },
  };

  public data = [{ id: '1', name: 'prueba 1', date: Date.now() }];

  source: LocalDataSource;

  constructor(
    private router: Router,
    private dialog: NbDialogService,
    private toastrService: NbToastrService,
    private datePipe: DatePipe
  ) {
    this.source = new LocalDataSource(this.data);
  }
  ngOnInit(): void {}

  activeConfig() {
    const dialog = this.dialog
      .open(ActivateComponent, {
        hasBackdrop: false,
        autoFocus: false,
      })
      .onClose.subscribe((res) => {
        let status: NbComponentStatus;
        let position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
        if (res) {
          status = 'success';
          this.toastrService.show('Successful activation', `Notification`, {
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

  redirect(route: string) {
    this.router.navigate(['main/' + route]);
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
