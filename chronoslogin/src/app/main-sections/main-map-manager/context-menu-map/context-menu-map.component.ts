import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { GridsterItem } from 'angular-gridster2';

interface position {
  x: number;
  y: number;
  rows: number;
  cols: number;
}

@Component({
  selector: 'app-context-menu-map',
  templateUrl: './context-menu-map.component.html',
  styleUrls: ['./context-menu-map.component.scss'],
})
export class ContextMenuMapComponent implements OnInit {
  x = 0;
  y = 0;
  xMatrix: number;
  yMatrix: number;
  mapPosition: GridsterItem;
  group: boolean = true;
  tempData: position[]=[];

  constructor(private dialogRefs: NbDialogRef<ContextMenuMapComponent>) {}

  ngOnInit(): void {
  }

  addOne() {
    this.tempData.push({
      x: this.mapPosition.x,
      y: this.mapPosition.y,
      cols: 1,
      rows: 1,
    });
    this.dialogRefs.close(this.tempData);
  }
  addGroup() {
    console.log(this.mapPosition);
    let xini = this.mapPosition.x;
    let yini = this.mapPosition.y;
    let limitx = xini + (this.xMatrix - 1);
    let limity = yini + (this.yMatrix - 1);
    for (let xdata = xini; xdata <= limitx; xdata++) {
      for (let ydata = yini; ydata <= limity; ydata++) {
        this.tempData.push({ x: xdata, y: ydata, rows: 1, cols: 1 });
      }
    }
    this.dialogRefs.close(this.tempData);
  }

  activeGroup() {
    this.group = false;
    console.log(this.mapPosition);
  }

  none() {
    this.dialogRefs.close();
  }
}
