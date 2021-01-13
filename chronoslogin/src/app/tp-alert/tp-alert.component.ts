import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-tp-alert',
  templateUrl: './tp-alert.component.html',
  styleUrls: ['./tp-alert.component.scss']
})
export class TpAlertComponent implements OnInit {
  url;
  show = false;

  constructor(private login: RequestsService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    console.log(this.login.userInfo)
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://tpalertchronos.teleperformance.co/login/' + this.login.userInfo.tpAlert);
    this.show = true;
  }

}
