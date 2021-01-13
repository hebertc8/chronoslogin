import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.component.html',
  styleUrls: ['./map-manager.component.scss']
})
export class MapManagerComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}
  launchMapManager() {
    this.router.navigate(['/main/map-manager']);
  }
}
