import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType,
} from 'angular-gridster2';
import { NbDialogService } from '@nebular/theme';
import { ContextMenuMapComponent } from '../context-menu-map/context-menu-map.component';

interface posts {
  ext?: number;
  position?: number;
  status?: string;
}

export interface map {
  maps?: GridsterItem;
  posts?: posts;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  options: GridsterConfig;
  contextMenuPositionX = 0;
  contextMenuPositionY = 0;
  contextMenuState = false;
  hiddenUpdate: boolean = false;
  itemSelected: GridsterItem;
  extension: number;
  position: number;
  status: string;
  @Input() dataGrid: map[] = [];

  @Output()
  mapGrid = new EventEmitter<map[]>();

  constructor(private dialog: NbDialogService) {}
  emptyCellClick(event, item: GridsterItem) {
    const dialog = this.dialog
      .open(ContextMenuMapComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: true,
        backdropClass: 'context-backdrop',
        autoFocus: false,
        context: { x: event.clientX, y: event.clientY, mapPosition: item },
      })
      .onClose.subscribe((res) => {
        if (res) {
          res.forEach((x) => {
            this.dataGrid.push({
              maps: {
                x: x.x,
                y: x.y,
                rows: x.rows,
                cols: x.cols,
              },
              posts: {
                ext: 0,
                position: 0,
                status: '',
              },
            });
          });
        } else {
        }
      });
    console.log(this.dataGrid);
    this.mapGrid.emit(this.dataGrid);
  }

  ngOnInit() {
    this.options = {
      gridType: GridType.Fixed,
      displayGrid: 'onDrag&Resize',
      fixedColWidth: 40.5,
      fixedRowHeight: 25.5,
      keepFixedHeightInMobile: true,
      keepFixedWidthInMobile: true,
      minCols: 45,
      minRows: 45,
      maxItemColsCols: 1,
      maxItemRowsRows: 1,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: true,
      emptyCellContextMenuCallback: this.emptyCellClick.bind(this),
      maxItemArea: 1,
      margin: 5,
      pushItems: true,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('cambio en mapa');
  }

  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    const index = this.dataGrid.findIndex((x) => x.maps == item);
    this.dataGrid.splice(index, 1);
  }

  viewInfo(item) {
    this.hiddenUpdate = true;
    this.itemSelected = item;
    const index = this.dataGrid.findIndex((x) => x.maps == item);
    this.extension = this.dataGrid[index].posts.ext;
    this.position = this.dataGrid[index].posts.position;
    this.status = this.dataGrid[index].posts.status;
  }
  close() {
    this.hiddenUpdate = false;
  }
  updateInfo() {
    this.dataGrid.map((x) => {
      if (x.maps == this.itemSelected) {
        x.posts.ext = this.extension;
        x.posts.position = this.position;
        x.posts.status = this.status;
      }
    });
    this.hiddenUpdate = false;
    this.mapGrid.emit(this.dataGrid);
  }
}
