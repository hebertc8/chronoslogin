import { Component, OnInit, AfterViewInit, OnDestroy, Input, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { EChartOption } from 'echarts';
import { KpiChartAbs } from 'src/app/services/abstract-classes.service';
import { ObserverService } from 'src/app/services/observer.service';
import { FilterSelected } from 'src/app/services/interfaces';

@Component({
  selector: 'app-kpi-chart',
  templateUrl: './kpi-chart.component.html',
  styleUrls: ['./kpi-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiChartComponent extends KpiChartAbs implements OnInit, AfterViewInit {

  @Input() filter: FilterSelected;
  @Input() name: string;
  @Input() index: number;


  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, detection, ngZone);
  }

  ngOnInit(): void {
    console.log(this.filter, 'filtrooooooooo KPI Chart');
    this.init(this.name, this.index, this.filter);
  }



}
