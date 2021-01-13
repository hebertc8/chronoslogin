import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-matrix-list',
  templateUrl: './matrix-list.component.html',
  styleUrls: ['./matrix-list.component.scss'],
})
export class MatrixListComponent implements OnInit {
  id: number = null;
  settings = {
    hideSubHeader: true,
    actions: false,
    columns: {
      call: {
        title: 'Calls',
        filter: false,
        editable: false,
      },
      aht: {
        title: 'AHT',
        filter: false,
        editable: false,
      },
      asa: {
        title: 'ASA',
        filter: false,
        editable: false,
      },
      lamda: {
        title: 'Lamda',
        filter: false,
        editable: false,
      }
    },
  };

  public data = [
    {
      call: 18,
      aht: 538,
      asa: 14,
      lamda: 0.42
    },
    {
      call: 13,
      aht: 512,
      asa: 74,
      lamda: 1.6033333
    },
    {
      call: 13,
      aht: 607,
      asa: 91,
      lamda: 1.971666
    },
    {
      call: 64,
      aht: 569,
      asa: 58,
      lamda: 6.186666
    },
    {
      call: 87,
      aht: 576,
      asa: 141,
      lamda: 20.445
    },
    {
      call: 59,
      aht: 5642,
      asa: 119,
      lamda: 11.701666
    },
  ];
  source: LocalDataSource;
  constructor(private dialogRefs: NbDialogRef<MatrixListComponent>) {
    this.source = new LocalDataSource(this.data);
  }

  ngOnInit(): void {}

  close(){
    this.dialogRefs.close();
  }
}
