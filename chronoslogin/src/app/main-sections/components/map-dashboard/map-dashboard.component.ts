import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-dashboard',
  templateUrl: './map-dashboard.component.html',
  styleUrls: ['./map-dashboard.component.scss']
})
export class MapDashboardComponent implements OnInit {

  matrixRegister = [];
  mapMatrix = [];
  

  constructor() { }

  ngOnInit(): void {
    for (let x = 0; x < 20; x++) {
      let temporalY = [];
      for (let y = 0; y < 20; y++) {
        temporalY[y] = {x:x, y:y, value:''}; 
      }
      this.mapMatrix[x] = temporalY;
    }
    this.changeMatrixActive();
    this.printMapActive();
    this.repeatChange();
  }

  printMapActive() {
    for (let x = 0; x < 20; x++) {
      let temporalY = [];
      for (let y = 0; y < 20; y++) {
        temporalY[y] = {x:x, y:y, value:''}; 
      }
      this.mapMatrix[x] = temporalY;
    }

    for (let r = 0; r < this.matrixRegister.length; r++) {
      this.mapMatrix[this.matrixRegister[r].x][this.matrixRegister[r].y] = this.matrixRegister[r];
    }
  }

  changeMatrixActive() {
    for (let i = 0; i < 120; i++) {
      this.matrixRegister[i] = {x:Math.floor(Math.random() * (19 - 0 + 1) + 0),y:Math.floor(Math.random() * (19 - 0 + 1) + 0),value:'AC'} ;
    }
  }

  repeatChange() {
    this.changeMatrixActive();
    this.printMapActive();
    setTimeout(() => {
        console.log(this.mapMatrix);
        this.repeatChange();
    }, 10000);
  }


}
