import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { NbIconLibraries } from '@nebular/theme';
import { WorkerService } from './services/sw/worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('openClose', [

      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        // opacity: 0.5,
        backgroundColor: 'black'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ]
})
export class AppComponent implements OnInit {
  title = 'ChronosV3';
  x = true;


  constructor(private iconLibraries: NbIconLibraries,
              private serviceWorker: WorkerService,
    ) {
    this.iconLibraries.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    // this.iconLibraries.setDefaultPack('fa');
  }

  ngOnInit() {
    // this.serviceWorker.register();
    // this.serviceWorker.getPermission();
  }

  change() {
    this.x = !this.x;
  }
}
