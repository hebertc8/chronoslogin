import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

interface context {
  id?: string;
  action: string;
}

interface fileUpdate {
  name: string;
  content?: any;
}

@Component({
  selector: 'app-config-create',
  templateUrl: './config-create.component.html',
  styleUrls: ['./config-create.component.scss'],
})
export class ConfigCreateComponent implements OnInit {
  context: context[] = [];

  adviserFile: fileUpdate[] = [];
  matrixFile: fileUpdate[] = [];
  dataClient = [
    { name: 'Client 1', id: 1 },
    { name: 'Client 2', id: 2 },
    { name: 'Client 3', id: 3 },
    { name: 'Client 4', id: 4 },
  ];
  dataMainSkill = [
    { code: 12323 },
    { code: 23434 },
    { code: 34545 },
    { code: 45656 },
  ];
  dataSupportkill = [{ code: 12 }, { code: 34 }, { code: 45 }, { code: 67 }];

  selectCheck: number = 0;

  constructor(private dialogRefs: NbDialogRef<ConfigCreateComponent>) {}

  ngOnInit(): void {}


  close(){
    this.dialogRefs.close();
  }
  save(){
    this.dialogRefs.close(true);
  }
  disableCheck() {

    this.selectCheck = this.selectCheck + 1;
    alert(this.selectCheck);
  }

  removeFile(typeFile: boolean) {
    if (typeFile) {
      this.adviserFile = [];
    } else {
      this.matrixFile = [];
    }
  }
  changeListener(files: FileList, typeFile: boolean) {
    if (files && files.length == 1) {
      let file: File = files.item(0);
      if (typeFile) {
        this.adviserFile.push({ name: file.name });
      } else {
        this.matrixFile.push({ name: file.name });
      }
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        console.log(csv);
      };
    }
  }
}
