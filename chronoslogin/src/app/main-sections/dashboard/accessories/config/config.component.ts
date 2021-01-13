import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  @Output() config = new EventEmitter();


  constructor() { }

  ngOnInit(): void {

  }

  configs(n) {
   this.config.emit(n);
  }

}
