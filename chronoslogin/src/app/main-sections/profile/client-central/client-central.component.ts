import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogConfirmationComponent } from 'src/app/general-components/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-client-central',
  templateUrl: './client-central.component.html',
  styleUrls: ['./client-central.component.scss'],
})
export class ClientCentralComponent implements OnInit {

  public central = [
    {
      nombre: 'Microsoft',
      default: true,
    },
    {
      nombre: 'Avantel',
      default: false,
    },
    {
      nombre: 'Backus',
      default: false,
    },
    {
      nombre: 'BBVA',
      default: false,
    },
    {
      nombre: 'Copa',
      default: false,
    },
    {
      nombre: 'Colpatria',
      default: false,
    },
    {
      nombre: 'Epson',
      default: false,
    },
    {
      nombre: 'Sony',
      default: false,
    },
    {
      nombre: 'Latam',
      default: false,
    },
    {
      nombre: 'Tuya',
      default: false,
    },
  ];

  constructor(private dialog: NbDialogService) {}

  ngOnInit(): void {}

  changeDefaultCentral(centrals: string) {
    const dialog = this.dialog.open(DialogConfirmationComponent,
      {
        closeOnBackdropClick: false, closeOnEsc: false, autoFocus: false,
        context: { message: 'Change main Central to ' + centrals + '. ' }
      })
      .onClose.subscribe(resp => {
        if (resp === 1) {
          this.central.map((dato) => {
            if (dato.default) {
              dato.default = false;
            }
            if (centrals === dato.nombre) {
              dato.default = true;
            }
            return dato;
          });
        }
      });
  }
}
