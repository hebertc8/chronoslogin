import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-dashbord2',
  templateUrl: './map-dashbord2.component.html',
  styleUrls: ['./map-dashbord2.component.scss']
})
export class MapDashbord2Component implements OnInit {
  statesPosible = ['basic', 'success', 'danger', 'warning'];

  pressPosition = true;
  activeAgent = { name: '', active: true, idAgent: 0 }

  agentsArray = [
    { name: 'Roth Jay', active: true, idAgent: 1020, nameAnalyst: 'Ron Willies', time: '00:00', ext: 125161, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Max Treant', active: true, idAgent: 1148, nameAnalyst: 'Ron Mustang', time: '10:00', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Jon Phoenix', active: true, idAgent: 2063, nameAnalyst: 'Roy Ronald', time: '60:00', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Damian Black', active: true, idAgent: 2847, nameAnalyst: 'Ron Memory', time: '05:00', ext: 125255, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Ruth Actum', active: true, idAgent: 3333, nameAnalyst: 'Diana Ghost', time: '70:00', ext: 125865, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Irish West', active: true, idAgent: 3611, nameAnalyst: 'Lira Blue', time: '40:80', ext: 125865, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Tom Allen', active: true, idAgent: 4582, nameAnalyst: 'Patrick Ocean', time: '03:02', ext: 127865, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Rena Kent', active: true, idAgent: 4986, nameAnalyst: 'Nathan Willies', time: '01:01', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Vivian Wayne', active: true, idAgent: 5221, nameAnalyst: 'Bruce Banner', time: '10:20', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Ally Young', active: true, idAgent: 5547, nameAnalyst: 'Oloro Wayne', time: '06:40', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Halie Parker', active: true, idAgent: 6347, nameAnalyst: 'Tiro North', time: '02:04', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Deliv Snow', active: true, idAgent: 7824, nameAnalyst: 'Tautum Sun', time: '06:69', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Varon Garric', active: true, idAgent: 6666, nameAnalyst: 'Leras Yough', time: '04:00', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Oklam Detroit', active: true, idAgent: 7118, nameAnalyst: 'Den Blast', time: '00:00', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Barry Oclak', active: true, idAgent: 8888, nameAnalyst: 'Charles Riss', time: '00:00', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
    { name: 'Harry Storm', active: true, idAgent: 9999, nameAnalyst: 'Michael Thunder', time: '00:00', ext: 125165, login: 152213, skills: '125487 121487 122358 123558 112254' },
  ]
  matrixRegister = [
    { x: 1, y: 1, value: 'basic', active: true, idAgent: 1020, time: 0 },
    { x: 2, y: 1, value: 'basic', active: true, idAgent: 1148, time: 0 },
    { x: 1, y: 2, value: 'basic', active: true, idAgent: 2063, time: 0 },
    { x: 2, y: 2, value: 'basic', active: true, idAgent: 2847, time: 0 },
    { x: 1, y: 3, value: 'basic', active: true, idAgent: 3333, time: 0 },
    { x: 2, y: 3, value: 'basic', active: true, idAgent: 3611, time: 0 },
    { x: 1, y: 4, value: 'basic', active: true, idAgent: 4582, time: 0 },
    { x: 2, y: 4, value: 'basic', active: true, idAgent: 4986, time: 0 },
    { x: 8, y: 8, value: 'basic', active: true, idAgent: 5221, time: 0 },
    { x: 9, y: 8, value: 'basic', active: true, idAgent: 5547, time: 0 },
    { x: 10, y: 8, value: 'basic', active: true, idAgent: 6347, time: 0 },
    { x: 11, y: 8, value: 'basic', active: true, idAgent: 7824, time: 0 },
    { x: 12, y: 8, value: 'basic', active: true, idAgent: 6666, time: 0 },
    { x: 13, y: 8, value: 'basic', active: true, idAgent: 7118, time: 0 },
    { x: 8, y: 9, value: 'basic', active: true, idAgent: 8888, time: 0 },
    { x: 9, y: 9, value: 'basic', active: true, idAgent: 9999, time: 0 },
    { x: 2, y: 1, value: 'basic', active: true, idAgent: 1020, time: 0 },
    { x: 3, y: 1, value: 'basic', active: true, idAgent: 1148, time: 0 },
    { x: 2, y: 2, value: 'basic', active: true, idAgent: 2063, time: 0 },
    { x: 3, y: 2, value: 'basic', active: true, idAgent: 2847, time: 0 },
    { x: 2, y: 3, value: 'basic', active: true, idAgent: 3333, time: 0 },
    { x: 3, y: 3, value: 'basic', active: true, idAgent: 3611, time: 0 },
    { x: 2, y: 4, value: 'basic', active: true, idAgent: 4582, time: 0 },
    { x: 3, y: 4, value: 'basic', active: true, idAgent: 4986, time: 0 },
    { x: 9, y: 8, value: 'basic', active: true, idAgent: 5221, time: 0 },
    { x: 10, y: 8, value: 'basic', active: true, idAgent: 5547, time: 0 },
    { x: 11, y: 8, value: 'basic', active: true, idAgent: 6347, time: 0 },
    { x: 12, y: 8, value: 'basic', active: true, idAgent: 7824, time: 0 },
    { x: 13, y: 8, value: 'basic', active: true, idAgent: 6666, time: 0 },
    { x: 14, y: 8, value: 'basic', active: true, idAgent: 7118, time: 0 },
    { x: 9, y: 9, value: 'basic', active: true, idAgent: 8888, time: 0 },
    { x: 10, y: 9, value: 'basic', active: true, idAgent: 9999, time: 0 },
  ];
  mapMatrix = [];

  zoomActual = 1.0;
  ZoomStyles = {
    transform: 'scale(1)'
  };

  constructor() { }

  ngOnInit(): void {
    for (let y = 0; y < 20; y++) {
      const temporalY = [];
      for (let x = 0; x < 20; x++) {
        temporalY[x] = { x: x, y: y, value: '' };
      }
      this.mapMatrix[y] = temporalY;
    }
    this.changeMatrixActive();
    this.printMapActive();
    this.repeatChange();
  }

  printMapActive() {

    for (let r = 0; r < this.matrixRegister.length; r++) {
      this.mapMatrix[this.matrixRegister[r].y][this.matrixRegister[r].x] = this.matrixRegister[r];
    }
  }

  changeMatrixActive() {
    for (let i = 0; i < 16; i++) {
      this.matrixRegister[i].value = this.statesPosible[Math.floor(Math.random() * (4 - 0 + 1) + 0)];
      this.matrixRegister[i].time = Math.floor(Math.random() * (99 - 0 + 1) + 0)
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

  searchAgent(idAgent) {
    this.pressPosition = true;
    for (let s = 0; s < this.agentsArray.length; s++) {
      if (idAgent === this.agentsArray[s].idAgent) {
        this.activeAgent = { name: this.agentsArray[s].name, active: true, idAgent: this.agentsArray[s].idAgent }
      }
    }
  }

  minusZoom() {
    if (this.zoomActual > 0.6) {
      this.ZoomStyles.transform = `scale(${this.zoomActual - 0.05})`;
      this.zoomActual = this.zoomActual - 0.05;
    }
  }

  plusZoom() {
    if (1.8 > this.zoomActual) {
      this.ZoomStyles.transform = `scale(${this.zoomActual + 0.05})`;
      this.zoomActual = this.zoomActual + 0.05;
    }
  }

}
