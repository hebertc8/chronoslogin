import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  public name;
  public status;
  public obs;

  constructor(protected dialogRef: NbDialogRef<ConfirmComponent>) {
  }

  ngOnInit(): void {
  }

  close(r) {
    this.dialogRef.close(r);
  }

}
