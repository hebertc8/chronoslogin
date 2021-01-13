import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  // recordar quitar los componentes de providers ya que al traer los datos del back
  // no se necesitan las injection de datos entre componentes
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
  ];;
  constructor(private dialogRefs: NbDialogRef<ActivateComponent>) {
  }

  ngOnInit(): void {
  }

  cancel(){
    this.dialogRefs.close();
  }
  active(){
    this.dialogRefs.close(true);
  }

}
