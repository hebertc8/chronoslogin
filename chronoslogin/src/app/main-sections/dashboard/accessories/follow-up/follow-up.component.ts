import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { FollowUpAbs } from 'src/app/services/abstract-classes.service';
import { ObserverService } from 'src/app/services/observer.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpComponent extends FollowUpAbs implements OnInit {


  constructor(
    public observer: ObserverService,
    public detection: ChangeDetectorRef,
    public dialog: NbDialogService,
    public request: RequestsService,
    public toastr: NbToastrService, 
    public ngZone: NgZone) {
    super(observer, detection, dialog, request, toastr, ngZone);
  }

  ngOnInit(): void {

    this.cache();
  }




}
