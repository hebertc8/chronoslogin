import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NbDialogRef, NbCheckboxComponent } from '@nebular/theme';
import { ClientCentralComponent } from '../client-central/client-central.component';
import { empty } from 'rxjs';

export interface ListWorker {
  nombre?: string;
  CCMS?: number;
}
export interface ResCentral {
  CCMS: number;
  central?: any[];
}

@Component({
  selector: 'app-manage-centrals',
  templateUrl: './manage-centrals.component.html',
  styleUrls: ['./manage-centrals.component.scss'],
})
export class ManageCentralsComponent implements OnInit {
  constructor(
    private dialogRefs: NbDialogRef<ManageCentralsComponent>,
    private centralComp: ClientCentralComponent
  ) {}

  CCMS: number = null;

  @ViewChildren(NbCheckboxComponent, { read: NbCheckboxComponent })
  checkbox: QueryList<NbCheckboxComponent>;

  checkDisable = false;

  central = this.centralComp.central;

  resCentralWorker: ResCentral[] = [];

  listWorker: ListWorker[] = [
    { nombre: 'Empleado 1', CCMS: 1234 },
    { nombre: 'Empleado 2', CCMS: 5678 },
    { nombre: 'Empleado 3', CCMS: 9012 },
    { nombre: 'Empleado 4', CCMS: 3498 },
  ];

  centralWorker = [];

  statusCheck: boolean;

  ngOnInit(): void {}

  buttonClose(){
    this.dialogRefs.close();
  }

  close() {
    const centrals = this.centralWorker;
    this.resCentralWorker.map((dato) => {
      if (dato.central == null) {
        dato.central = centrals;
      }
      return dato;
    });
    console.log(this.resCentralWorker);
    this.dialogRefs.close(true);
  }

  selectCentral(res: string, isChecked: boolean) {
    if (isChecked) {
      this.centralWorker.push({ nombre: res });
    } else {
      const index = this.centralWorker.findIndex((x) => x.nombre === res);
      this.centralWorker.splice(index, 1);
    }
  }
  selectAll() {
    this.centralWorker = [];
    this.centralWorker = this.central;
    this.checkDisable = true;
  }

  clearAll() {
    this.statusCheck = undefined;
    this.centralWorker = [];
    this.checkDisable = false;
    setTimeout(() => {
      this.statusCheck = false;
    }, 300);
  }
  selectWorker(res: number, isChecked: boolean) {
    if (isChecked) {
      this.resCentralWorker.push({ CCMS: res, central: null });
    } else {
      const index = this.resCentralWorker.findIndex((x) => x.CCMS === res);
      this.resCentralWorker.splice(index, 1);
    }
  }
}
