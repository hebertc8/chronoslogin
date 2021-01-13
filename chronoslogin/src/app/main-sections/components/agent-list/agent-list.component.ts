import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { AgentAbs } from 'src/app/services/abstract-classes.service';
import { ObserverService } from 'src/app/services/observer.service';
import { FilterSelected } from 'src/app/services/interfaces';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentListComponent extends AgentAbs implements OnInit {
  @Input() filter: FilterSelected;
  @Input() name: string;
  @Input() index: number;

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, detection, ngZone);
  }

  ngOnInit(): void {
    // console.log(this.filter, 'filtrooooooooo agente');
    this.init(this.name, this.index, this.filter);
    this.detection.detach();
    console.log(this.index, 'aadddddddddddddddd', this.name, this.filter);
    // this.reload();
  }







}
