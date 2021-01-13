import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agents, ApiBody, ApiRestComponent } from 'src/app/services/interfaces';
import { ObserverService } from 'src/app/services/observer.service';
import { Subscription } from 'rxjs';
import { RequestsService } from 'src/app/services/requests.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-follow-up-popover',
  templateUrl: './follow-up-popover.component.html',
  styleUrls: ['./follow-up-popover.component.scss']
})
export class FollowUpPopoverComponent implements OnInit, OnDestroy {
  @Output() changes = new EventEmitter();
  //  @Input() Index: number;
  public rowData: Agents;
  protected name = 'followUp';
  form: FormGroup;
  public show = false;
  private ApiRest: ApiRestComponent;
  public loadButton = false;
  private subsCreateFollow: Subscription;
  constructor(
    private fb: FormBuilder,
    private observer: ObserverService,
    private request: RequestsService,
    private toastr: NbToastrService
  ) {

  }

  ngOnInit(): void {
    this.ApiRest = this.observer.viewApiRest(this.name);
  }

  changeInfo(rowData: Agents) {

    if (rowData.Skills !== '' ) {
      this.rowData = rowData;
      this.form = this.fb.group({
        Reason: [{ value: this.rowData.Status, disabled: false }, Validators.required],
        Obs: [null, Validators.required],
      });
      this.show = true;
      this.changes.emit();
      this.form.get('Obs').valueChanges.subscribe(res => {
        if (res) {
          this.changes.emit();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subsCreateFollow) { this.subsCreateFollow.unsubscribe(); }
  }

  open() {
    this.show = true;
    this.loadButton = false;
    this.changes.emit();
  }

  close() {
    this.show = false;
    this.changes.emit();
  }

  follow() {
    if (this.subsCreateFollow) { this.subsCreateFollow.unsubscribe(); }
    this.loadButton = true;
    const input = this.form.value;
    if (this.ApiRest) {
      const apiBody: ApiBody = {
        source: this.ApiRest.source,
        body: {
          Login: Number(this.rowData.login),
          Name: this.rowData.nombre,
          requestByUser: this.request.userInfo.data[0].ccmsuser,
          central: this.observer.centralCurrent,
          Lob: this.rowData.Lob,
          observation: input.Obs,
          badge: this.rowData.Status,
          case: 1,
          observationEnd: null,
        }
      };

      this.subsCreateFollow = this.request.ApiGeneral(apiBody).subscribe(res => {
        this.toastr.success('FoolowUp Created');
        this.loadButton = false;
        this.subsCreateFollow.unsubscribe();
        this.close();
      }, err => {
        this.toastr.warning('Error in FollowUp', 'Try again.');
        this.loadButton = false;
        this.subsCreateFollow.unsubscribe();
      });
    }

  }
}
