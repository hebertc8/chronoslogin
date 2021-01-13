import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-advisers-list',
  templateUrl: './advisers-list.component.html',
  styleUrls: ['./advisers-list.component.scss'],
})
export class AdvisersListComponent implements OnInit {
  id: number = null;

  settings = {
    hideSubHeader: true,
    actions: false,
    columns: {
      name: {
        title: 'Name',
        filter: false,
        editable: false,
      },
      ccms: {
        title: 'CCMS',
        filter: false,
        editable: false,
      },
      mainSkill: {
        title: 'Main Skill',
        filter: false,
        editable: false,
      },
      supportSkill: {
        title: '1 Support Skill',
        filter: false,
        editable: false,
      },
      supportSkill2: {
        title: '2 Support Skill',
        filter: false,
        editable: false,
      },
    },
  };

  public data = [
    {
      name: 'asesor 1',
      ccms: 1232,
      mainSkill: 1212,
      supportSkill: 1313,
      supportSkill2: 1414,
    },
    {
      name: 'asesor 2',
      ccms: 2343,
      mainSkill: 1212,
      supportSkill: 1313,
      supportSkill2: 1414,
    },
    {
      name: 'asesor 4',
      ccms: 34545,
      mainSkill: 1212,
      supportSkill: 1313,
      supportSkill2: 1414,
    },
    {
      name: 'asesor 5',
      ccms: 45656,
      mainSkill: 1212,
      supportSkill: 1313,
      supportSkill2: 1414,
    },
    {
      name: 'asesor 6',
      ccms: 56767,
      mainSkill: 1212,
      supportSkill: 1313,
      supportSkill2: 1414,
    },
  ];
  source: LocalDataSource;
  constructor(private dialogRefs: NbDialogRef<AdvisersListComponent>) {
    this.source = new LocalDataSource(this.data);
  }

  ngOnInit(): void {}

  close(){
    this.dialogRefs.close();
  }
}
