import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-misionbot-settings',
  templateUrl: './misionbot-settings.component.html',
  styleUrls: ['./misionbot-settings.component.scss'],
})
export class MisionbotSettingsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  launchMisionBot() {
    this.router.navigate(['/main/misionbot']);
  }
}
