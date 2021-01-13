import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss']
})
export class DialogConfirmationComponent implements OnInit {

  constructor(protected dialogRef: NbDialogRef<DialogConfirmationComponent>) { }

  message = '';

  ngOnInit(): void {
  }

  close(r) {
    this.dialogRef.close(r);
  }

}
