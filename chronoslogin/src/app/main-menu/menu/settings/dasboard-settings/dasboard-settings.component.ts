import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dasboard-settings',
  templateUrl: './dasboard-settings.component.html',
  styleUrls: ['./dasboard-settings.component.scss']
})
export class DasboardSettingsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  launchDasboard() {
    this.router.navigate(['/main/dashboard']);
  }

}
