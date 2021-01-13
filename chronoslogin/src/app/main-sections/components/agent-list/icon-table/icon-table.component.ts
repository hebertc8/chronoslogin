import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ObserverService } from 'src/app/services/observer.service';
import { IconActions, Agents, RTMlist } from 'src/app/services/interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'app-icon-table',
  template: `
  <nb-icon [icon]="icon.icon" [pack]="icon.pack" [status]="status" class="iconAgent" (click)="open()"></nb-icon>

  <!-- <ng-template [ngIf]="followUp">
    <div class="container">
    <nb-badge text="X" status="info" position="top right" class="badgeClose" (click)="close()"></nb-badge>
    <h6>Follow Up</h6>
    <p>{{rowData.nombre}}</p>
  <form aria-labelledby="title" [formGroup]="form" class="form">
    <label for="Reason" class="label">Reason</label>
    <input nbInput id="Reason"  formControlName="Reason">
    <label for="Obs" class="label">Observations</label>
    <input nbInput id="Obs" formControlName="Obs">
    <div class="d-flex justify-content-around buttonSection">
        <button nbButton status="primary" [disabled]="form.invalid" >Follow Up!</button>
    </div>
</form>
</div>
</ng-template> -->
  `,
  styleUrls: ['./icon-table.component.scss']
})
export class IconTableComponent implements OnInit {
  @Input() value: string;
  @Input() rowData; //: Agents;
  @Output() openFollow = new EventEmitter();
  public icon: IconActions = { icon: 'question', pack: 'fa' };
  form: FormGroup;
  status = 'basic';
  // public followUp = false;

  constructor(private observer: ObserverService, private fb: FormBuilder) { }

  ngOnInit(): void {
    // console.log('Valueeeeeeeeeeeeeeeeeeeeee', this.value, this.rowData);

    if (this.rowData.alarm) {

      let iconTemp = this.observer.viewIconsRTM.find(i => Number(i.alarm) === Number(this.value));
      this.icon = iconTemp ? iconTemp : this.icon;
      this.status = iconTemp ? iconTemp.status: this.status;

    } else {
      this.icon = this.observer.viewIcons[this.value] ? this.observer.viewIcons[this.value] : this.icon;

      if (this.rowData.Aux !== '') {

        this.status = this.rowData.TimeState > (Number(this.rowData.hastaaux) !== 0 ? Number(this.rowData.hastaaux) : 99999) ? 'danger' : 'basic';
      } else {
        this.status = this.rowData.TimeState >
          (Number(this.rowData.hastaestado) !== 0 ? Number(this.rowData.hastaestado) : 99999) ? 'danger' : 'basic';
      }

    }
  }

  open() {
    this.openFollow.emit(this.rowData);
  }
}
