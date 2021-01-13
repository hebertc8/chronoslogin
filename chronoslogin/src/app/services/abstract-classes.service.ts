import { OnDestroy, ChangeDetectorRef, AfterViewInit, Input, ViewChild, ElementRef, NgZone, Output, EventEmitter } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { ObserverService } from './observer.service';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { ConfirmComponent } from '../main-sections/dashboard/accessories/follow-up/confirm/confirm.component';
import { IconActions, Agents, FilterSelected, KpiRaw, KpiHtml, ApiRestComponent, ApiBody, FollowList, Row, RTMlist, KpiConsolidated, AgentGroup } from './interfaces';
import { IconTableComponent } from '../main-sections/components/agent-list/icon-table/icon-table.component';
import { FollowUpPopoverComponent } from '../main-sections/components/agent-list/follow-up-popover/follow-up-popover.component';
import { FunctionsService } from './functions.service';
import * as moment from 'moment';
import { RequestsService } from './requests.service';


// @Injectable({
//   providedIn: 'root'
// })
abstract class GeneralABS implements OnDestroy {
  @Output() ready = new EventEmitter();
  sub: Subscription;
  // info: Agents[] = [];
  public indexABS;
  public filter: FilterSelected;
  public AcsTitles = function (a, b) {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  };

  constructor(public observer: ObserverService, public ngZone: NgZone, public detection: ChangeDetectorRef) {

  }

  init(name, index, filter) {
    this.Cache(name);
    console.log('Iniciado abs', name, index);
    this.indexABS = index;
    this.filter = filter;
    this.observer.initSocket(name);
    this.sub = this.observer.viewInfoGeneral(name).subscribe(res => {
      // console.log(res, 'recibe abs', name);
      this.info(res);
      if (res) {
        this.ready.emit(true);
      }
    });
  }

  ngOnDestroy() {
    console.log('Destruyendo abs');
    if (this.sub) { this.sub.unsubscribe(); }
    this.Destroy();
  }

  convertTime(time) {
    // let hours:any = Math.floor( time / 3600 );
    // let minutes:any = Math.floor( (time % 3600) / 60 );
    let minutes: any = Math.floor(time / 60);
    let seconds: any = time % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ':' + seconds;
  }

  trackById(index, item) {
    return item.id;
  }

  filterStatic(info: Agents[]) {
    if (this.filter) {
      const temp: Agents[] = [];
      console.log(this.filter, true, 'Filtrosssssssssssssssssssssssssssss');
      if (this.filter.NES) {
        const t = Object.assign(temp, info.filter(data => data.nombre.includes(this.filter.NES)));
        return temp;
      } else if (this.filter.idSupervisor) {
        const t = Object.assign(temp, info.filter(data => Number(data.idSupervisor) === Number(this.filter.idSupervisor)));
        return temp;
      } else if (this.filter.idsFilter) {
        const f = this.filter.idsFilter.split(';');
        f.forEach(id => {
          const temp2: Agents = info.find(data => Number(data.login) === Number(id));
          temp.push(temp2 !== undefined ? temp2 :
            {
              nombre: 'Agent not found.',
              Aux: '',
              badge: '',
              NameCentral: '',
              coloraux: 0,
              colorestado: 0,
              detalleskill: '',
              Dir: '',
              Status: 'LogOut/Doesnt exist',
              Ext: 0,
              hastaaux: 0,
              hastaestado: 0,
              iconoaux: 16,
              iconoestado: 16,
              Lob: '',
              lobok: '',
              login: Number(id),
              Skills: '',
              sublob: '',
              TimeState: 0,
              total: 0,
              idSupervisor: ''
            });
        });

        return temp;

      } else {
        if (this.filter.skill[0]) {
          this.filter.skill.forEach(skill => {
            const t = Object.assign(temp, info.filter(data => data.Skills.includes(skill) === true));
            // temp.concat(info.filter(data => data.Skills.includes(skill) === true));
          });
          return temp;

        } else if (this.filter.subLob[0]) {
          this.filter.subLob.forEach(sublob => {
            const t = Object.assign(temp, info.filter(data => data.sublob === sublob));
            // temp.concat(info.filter(data => data.Skills.includes(skill) === true));
          });
          return temp;

        } else {
          this.filter.lob.forEach(lob => {
            const t = Object.assign(temp, info.filter(data => data.Lob === lob));
            // temp.concat(info.filter(data => data.Skills.includes(skill) === true));
          });
          return temp;
        }
      }

    } else {
      return info;
    }
  }

  public detectChanges() {
    this.detection.detectChanges();
    setTimeout(() => {
      this.detection.detectChanges();
    }, 100);
  }

  filterKpiConsolidated(info: KpiConsolidated[]) {
    const temp: KpiConsolidated[] = [];

    const t = Object.assign(temp, info.filter(data => data.Tipo === this.filter));
    // temp.concat(info.filter(data => data.Skills.includes(skill) === true));
    return temp;
  }

  filterAgentGroup(info: AgentGroup[]) {
    const temp: AgentGroup[] = [];

    const t = Object.assign(temp, info.filter(data => data.type === this.filter));
    // temp.concat(info.filter(data => data.Skills.includes(skill) === true));
    return temp;
  }

  filterStaticKpi(info: KpiRaw[]) {
    if (this.filter) {

      let tempFilter: KpiRaw;
      if (this.filter.skillKpi) {
        tempFilter = info.find(data => Number(data.Skill) === Number(this.filter.skillKpi)
          && data.indicator === this.filter.indicator && data.typeSkill === 'Productivo');
      } else if (this.filter.lobKpi) {
        tempFilter = info.find(data => data.Lob === this.filter.lobKpi &&
          data.indicator === this.filter.indicator && data.typeSkill === 'Consolidado');
      }
      return tempFilter;
    }
  }

  info(info) {
    this.ngZone.runOutsideAngular(() => {
      this.realodInfo(info);
    });
  };

  Cache(name) {
    const x = (this.observer.cacheInfo(name));
    if (x) {
      this.info(x);
      this.ready.emit(true);
    }
  }
  abstract realodInfo(info);
  abstract Destroy();
  // abstract initCache(x);

}

export abstract class AgentAbs extends GeneralABS {
  @ViewChild(FollowUpPopoverComponent, { static: true, read: FollowUpPopoverComponent }) followUp: FollowUpPopoverComponent;
  source: LocalDataSource;
  subSearch: Subscription;
  filtroQuery: any;
  public settings = {
    mode: 'external',
    hideSubHeader: true,
    sort: true,
    attr: {
      class: 'agentsList',
    },
    pager: {
      display: true,
      perPage: 1000
    },

    actions: {
      position: 'left',
      edit: false,
      delete: false,
      add: false,
      // custom: [
      //   {
      //     name: 'follow',
      //     title: '<i class="fas fa-clipboard-check"></i>',
      //   },
      //   {
      //     name: 'details',
      //     title: '<i class="nb-search"></i> ',
      //   },
      //   {
      //     name: 'destinataries',
      //     title: '<i class="nb-email"></i> ',
      //   },
      //   {
      //     name: 'remove',
      //     title: '<i class="nb-trash"></i> ',
      //   },
      //   {
      //     name: 'download',
      //     title: '<i class="nb-arrow-thin-down"></i>',
      //   },
      // ],
    },

    columns: {
      iconoestado: {
        title: '',
        type: 'custom',
        // valuePrepareFunction: (icono) => {
        //  return this.validateIcons(icono);
        // },
        renderComponent: IconTableComponent,
        onComponentInitFunction: (instance) => {
          instance.openFollow.subscribe(res => {
            this.followUp.changeInfo(res);
          });
        },
      },
      nombre: {
        title: 'Name'
      },
      TimeState: {
        title: 'Time',
        valuePrepareFunction: (time) => {
          return this.convertTime(time);
        },
        sortDirection: 'asc'

      },
      Status: {
        title: 'Status'
      },
      Aux: {
        title: 'Aux'
      },
      Dir: {
        title: 'Dir'
      },
      login: {
        title: 'ID'
      }
    }
  };

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);

    // this.source = new LocalDataSource(this.info); // Debe ir this.info cuando se inicie a consumir las request

    this.subSearch = this.observer.viewSearch().subscribe(res => {
      this.onSearch(res);
    });
  }

  Destroy() {
    if (this.subSearch) { this.subSearch.unsubscribe(); }
  }

  realodInfo(info: Agents[]) {


    if (info.length !== 0) {
      const x = new LocalDataSource(this.filterStatic(info));
      this.source = x;
      if (this.filtroQuery) {
        this.applyFilter();
      }
      ///////////// Detectar cambios
      this.detectChanges();
    }

  }



  // initCache(x) {

  //   if (x) {
  //     this.source = new LocalDataSource(this.filterStatic(x));
  //     if (this.filtroQuery) {
  //       this.applyFilter();
  //     }
  //     ///////////// Detectar cambios
  //     this.detectChanges();
  //   } else {
  //     console.log('Sin caché');
  //   }
  // }

  validateIcons(n: number) {
    return '<i class="fas fa-' + this.observer.viewIcons[n].icon + '"></i>';
    // '<nb-icon icon="'+this.observer.viewIcons[n].icon+'" pack="'+this.observer.viewIcons[n].pack+'"></nb-icon>';
  }


  onSearch(query) {
    if (typeof query === 'boolean') {
      this.filtroQuery = undefined;
      this.source.setFilter([]);
    } else {
      this.filtroQuery = query;
      this.applyFilter();
    }
    setTimeout(() => {
      this.detection.detectChanges();
    }, 1000);

  }

  applyFilter() {

    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'nombre',
        search: this.filtroQuery
      },
      {
        field: 'TimeState',
        search: this.filtroQuery
      },
      {
        field: 'Status',
        search: this.filtroQuery
      },
      {
        field: 'Aux',
        search: this.filtroQuery
      },
      {
        field: 'login',
        search: this.filtroQuery
      }
    ], false);
  }

  onCustom(event) {
    console.log(event, 'Un evento se ha generado');
    switch (event.action) {
      case 'follow':
        break;

      default:
        break;
    }
  }


}


export abstract class KpiChartAbs extends GeneralABS implements AfterViewInit {
  KpiName = '';
  // KpiLevel = '100%';
  FcName = 'FC';
  // FcLevel = '80%';
  KpiColor = '#417DC1';
  FcColor = 'black';
  TextAxisColor = 'black';
  public kpi: KpiRaw[] = [];
  private subResize: Subscription;
  private time: string[] = [];
  public fcList: number[] = [];
  public indicatorList: number[] = [];
  public optionsUpdate;
  public options = {};


  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);
    this.subResize = this.observer.viewResize().subscribe(index => {
      // console.log(index, this.indexABS, 'llegóoooooo');
      if (index === this.indexABS) {
        this.detectChanges();
      }
    });

  }

  ngAfterViewInit() {

    // this.options = {
    //   backgroundColor: 'transparent',
    //   color: [this.KpiColor, this.FcColor],
    //   tooltip: {
    //     trigger: 'none',
    //     axisPointer: {
    //       type: 'cross',
    //     },
    //   },
    //   legend: {
    //     // data: [this.KpiName + ': ' + this.KpiLevel, 'FC: ' + this.FcLevel],
    //     data: [this.KpiName, this.FcName],
    //     textStyle: {
    //       color: '#bababa',
    //     },
    //   },
    //   grid: {
    //     top: 70,
    //     bottom: 50,
    //   },
    //   xAxis: [
    //     {
    //       type: 'category', //
    //       axisTick: {
    //         alignWithLabel: true,
    //       },
    //       axisLine: {
    //         onZero: false,
    //         lineStyle: {
    //           color: this.KpiColor,
    //         },
    //       },
    //       axisLabel: {
    //         textStyle: {
    //           color: this.TextAxisColor,
    //         },
    //       },
    //       axisPointer: {
    //         label: {
    //           formatter: params => {
    //             return (
    //               this.KpiName + ': ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
    //             );
    //           },
    //         },
    //       },
    //       data: [
    //         '2016-1',
    //         '2016-2',
    //         '2016-3',
    //         '2016-4',
    //         '2016-5',
    //         '2016-6',
    //         '2016-7',
    //         '2016-8',
    //         '2016-9',
    //         '2016-10',
    //         '2016-11',
    //         '2016-12',
    //       ],
    //     },
    //     {
    //       type: 'category',
    //       axisTick: {
    //         alignWithLabel: true,
    //       },
    //       axisLine: {
    //         onZero: false,
    //         lineStyle: {
    //           color: this.FcColor,
    //         },
    //       },
    //       axisLabel: {
    //         textStyle: {
    //           color: this.TextAxisColor,
    //         },
    //       },
    //       axisPointer: {
    //         label: {
    //           formatter: params => {
    //             return (
    //               this.FcName + ': ' + params.value + (params.seriesData.length ? ' ：' + params.seriesData[0].data : '')
    //             );
    //           },
    //         },
    //       },
    //       data: [
    //         '2015-1',
    //         '2015-2',
    //         '2015-3',
    //         '2015-4',
    //         '2015-5',
    //         '2015-6',
    //         '2015-7',
    //         '2015-8',
    //         '2015-9',
    //         '2015-10',
    //         '2015-11',
    //         '2015-12',
    //       ],
    //     },
    //   ],
    //   yAxis: [
    //     {
    //       type: 'value',
    //       axisLine: {
    //         lineStyle: {
    //           color: '#bababa',
    //         },
    //       },
    //       splitLine: {
    //         lineStyle: {
    //           color: '#bababa',
    //         },
    //       },
    //       axisLabel: {
    //         textStyle: {
    //           color: this.TextAxisColor,
    //         },
    //       },
    //     },
    //   ],
    //   series: [
    //     {
    //       name: this.KpiName,
    //       type: 'line',
    //       xAxisIndex: 1,
    //       smooth: true,
    //       data: [Math.floor((Math.random() * 10) + 1), Math.floor((Math.random() * 10) + 1), Math.floor((Math.random() * 10) + 1),
    //       Math.floor((Math.random() * 50) + 1), Math.floor((Math.random() * 50) + 1), Math.floor((Math.random() * 50) + 1),
    //       Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1),
    //       Math.floor((Math.random() * 30) + 1), Math.floor((Math.random() * 30) + 1), Math.floor((Math.random() * 30) + 1)],
    //     },
    //     {
    //       name: this.FcName,
    //       type: 'line',
    //       smooth: true,
    //       data: [Math.floor((Math.random() * 10) + 1), Math.floor((Math.random() * 10) + 1), Math.floor((Math.random() * 10) + 1),
    //       Math.floor((Math.random() * 50) + 1), Math.floor((Math.random() * 50) + 1), Math.floor((Math.random() * 50) + 1),
    //       Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1),
    //       Math.floor((Math.random() * 30) + 1), Math.floor((Math.random() * 30) + 1), Math.floor((Math.random() * 30) + 1)],
    //     },
    //   ],
    // };

    ///////////////////////////////////////////////////////////
    // const xAxisData = [];
    // const data1 = [];
    // const data2 = [];


    // this.options = {
    //   backgroundColor: '#E9EDF4',
    //   color: ['blue', 'yellow'],
    //   legend: {
    //     data: ['bar', 'bar2'],
    //     align: 'left',
    //     textStyle: {
    //       color: 'white',
    //     },
    //   },
    //   xAxis: [
    //     {
    //       data: xAxisData,
    //       silent: false,
    //       axisTick: {
    //         alignWithLabel: true,
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           color: 'red',
    //         },
    //       },
    //       axisLabel: {
    //         textStyle: {
    //           color: 'blue',
    //         },
    //       },
    //     },
    //   ],
    //   yAxis: [
    //     {
    //       axisLine: {
    //         lineStyle: {
    //           color: 'green',
    //         },
    //       },
    //       splitLine: {
    //         lineStyle: {
    //           color: 'yellow',
    //         },
    //       },
    //       axisLabel: {
    //         textStyle: {
    //           color: 'black',
    //         },
    //       },
    //     },
    //   ],
    //   series: [
    //     {
    //       name: 'bar',
    //       type: 'bar',
    //       data: data1,
    //       animationDelay: idx => idx * 10,
    //     },
    //     {
    //       name: 'bar2',
    //       type: 'bar',
    //       data: data2,
    //       animationDelay: idx => idx * 10 + 100,
    //     },
    //   ],
    //   animationEasing: 'elasticOut',
    //   animationDelayUpdate: idx => idx * 5,
    // };

    // for (let i = 0; i < 100; i++) {
    //   xAxisData.push('Category ' + i);
    //   data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
    //   data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    // }


  }
  realodInfo(info: KpiRaw[]) {
    // this.kpi = info;
    const infoIndicator: KpiRaw = this.filterStaticKpi(info);
    const f = new Date();

    if (f.getMinutes() === 30 && f.getSeconds() <= 30 ||
      f.getMinutes() === 0 && f.getSeconds() <= 30) {
      this.time = [];
      this.indicatorList = [];
      this.fcList = [];
    }
    if (infoIndicator) {
      this.time.push(moment(new Date()).format('hh:mm:ss'));
      this.indicatorList.push(infoIndicator.realValue);
      this.fcList.push(infoIndicator.previsto);
      this.KpiName = this.filter.indicator;

      this.options = {
        backgroundColor: 'transparent',
        color: [this.KpiColor, this.FcColor],
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          // data: [this.KpiName + ': ' + this.KpiLevel, 'FC: ' + this.FcLevel],
          data: [this.KpiName, this.FcName],
          textStyle: {
            color: '#bababa',
          },
        },
        grid: {
          top: 70,
          bottom: 50,
        },
        xAxis: [
          {
            type: 'category', //
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.FcColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: this.TextAxisColor,
              },
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    this.FcName + ': ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  );
                },
              },
            },
            data: this.time,
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.KpiColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: this.TextAxisColor,
              },
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    this.KpiName + ': ' + params.value + (params.seriesData.length ? ' ：' + params.seriesData[0].data : '')
                  );
                },
              },
            },
            data: this.time,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#bababa',
              },
            },
            splitLine: {
              lineStyle: {
                color: '#bababa',
              },
            },
            axisLabel: {
              textStyle: {
                color: this.TextAxisColor,
              },
            },
          },
        ],
        series: [
          {
            name: this.KpiName,
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            data: this.indicatorList,
          },
          {
            name: this.FcName,
            type: 'line',
            smooth: true,
            data: this.fcList,
          },
        ],
      };


      this.detectChanges();
    }

    //    console.log(infoIndicator, 'timeeeeeeeeeeeeeeeeeeeeee');


  }

  // initCache(name) {
  //   const x: KpiRaw[] = (this.observer.cacheInfo(name));
  //   if (x) {
  //     this.realodInfo(x);
  //     setTimeout(() => {
  //       this.detection.detectChanges();
  //       console.log('Debería cambiar el cache');
  //     }, 1000);
  //   } else {
  //     console.log('Sin caché');
  //   }
  // }

  Destroy() {
    if (this.subResize) { this.subResize.unsubscribe(); }
  }

}


export abstract class KpiIndividualAbs extends GeneralABS {
  public KpiData: KpiHtml[] = [];
  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);
  }

  realodInfo(info: KpiRaw[]) {
    if (info.length !== 0) {
      const infoIndicator: KpiRaw[] = this.filterStaticKpiInd(info);
      console.log(infoIndicator, 'adadlllllllllllllññññññññññññññññññññññ');
      if (infoIndicator) {
        const temp: KpiHtml[] = [];
        let sem;
        let showfc = true;
        let valuebar;
        infoIndicator.forEach(indicator => {

          switch (indicator.indicator) {
            case 'Queue':
              sem = indicator.realValue > 0 ? 'warning' : 'primary';
              showfc = false;
              break;

            case 'NDS':
              sem = indicator.realValue < indicator.previsto ? 'warning' : 'primary';
              break;

            case 'NDA':
              sem = indicator.realValue < indicator.previsto ? 'warning' : 'primary';
              break;

            case 'ABN':
              sem = indicator.realValue > 0 ? 'warning' : 'primary';
              showfc = false;
              break;

            case 'ACD':
              sem = 'primary';
              valuebar = indicator.previsto !== 0 && indicator.previsto ?
                (indicator.realValue / indicator.previsto) * 100 : indicator.realValue;
              break;

            case 'AHT':
              sem = indicator.realValue > (indicator.previsto === 0 ? 99999 : indicator.previsto) ? 'warning' : 'primary';
              valuebar = indicator.previsto !== 0 && indicator.previsto ?
                (indicator.realValue / indicator.previsto) * 100 : indicator.realValue;
              break;

            default:
              sem = indicator.realValue < indicator.previsto ? 'warning' : 'primary';
              break;
          }
          temp.push({
            fc: indicator.previsto,
            name: indicator.indicator,
            value: Math.floor(indicator.realValue),
            filterName: indicator.filterName,
            semaforizacion: sem,
            valueBar: valuebar,
            showFC: showfc,
          });
        });
        this.KpiData = temp;
        this.detectChanges();
      }
    }

  }

  random() {
    setInterval(() => {
      this.KpiData[0].value = Math.floor((Math.random() * 100) + 1);
      this.detection.detectChanges();
    }, 5000);
  }

  // initCache(name) {
  //   const x: KpiRaw[] = (this.observer.cacheInfo(name));
  //   if (x) {
  //     this.realodInfo(x);
  //     setTimeout(() => {
  //       this.detection.detectChanges();
  //       console.log('Debería cambiar el cache');
  //     }, 1000);
  //   } else {
  //     console.log('Sin caché');
  //   }
  // }

  filterStaticKpiInd(info: KpiRaw[]) {
    if (this.filter) {
      const kpi: KpiRaw[] = [];
      if (this.filter.skillKpiInd.length !== 0) {
        this.filter.skillKpiInd.forEach(skill => {
          const x = info.find(data => Number(data.Skill) === Number(skill)
            && data.indicator === this.filter.indicator && data.typeSkill === 'Productivo');
          if (x) {
            x.filterName = skill;
            kpi.push(x);
          }
        });
        return kpi;
      } else if (this.filter.lobkpiInd.length !== 0) {
        this.filter.lobkpiInd.forEach(lob => {

          const x = info.find(data => data.Lob === lob &&
            data.indicator === this.filter.indicator && data.typeSkill === 'Consolidado');
          if (x) {
            x.filterName = lob;
            kpi.push(x);
          }
        });
        return kpi;
      }

    }

  }

  Destroy() {

  }

}

export abstract class MapAbs extends GeneralABS implements AfterViewInit {
  @ViewChild('myBounds', { static: false, read: ElementRef }) mapContainer: ElementRef;
  public testItems = [
    {
      id: 2004, idzona: 16, x: 2, y: 4, npuesto: 327, estado: null, ext: 56633,
      zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2005, idzona: 16, x: 2, y: 5, npuesto: 326, estado: null,
      ext: 56511, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2006, idzona: 16, x: 2, y: 6, npuesto: 325, estado: null, ext: 56564,
      zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2007, idzona: 16, x: 2, y: 9, npuesto: 401, estado: null,
      ext: 56557, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2008, idzona: 16, x: 2, y: 10, npuesto: 402, estado: null, ext: 56583, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2009, idzona: 16, x: 2, y: 11, npuesto: 403, estado: null, ext: 56581, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2010, idzona: 16, x: 2, y: 12, npuesto: 404, estado: null, ext: 56554, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2011, idzona: 16, x: 2, y: 13, npuesto: 405, estado: null, ext: 56563, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2012, idzona: 16, x: 2, y: 14, npuesto: 406, estado: null, ext: 0,
      zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2013, idzona: 16, x: 3, y: 2, npuesto: 324, estado: null,
      ext: 56555, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2014, idzona: 16, x: 3, y: 3, npuesto: 323, estado: null,
      ext: 56608, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2015, idzona: 16, x: 3, y: 4, npuesto: 322, estado: null,
      ext: 56556, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2016, idzona: 16, x: 3, y: 5, npuesto: 321, estado: null,
      ext: 56760, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2017, idzona: 16, x: 3, y: 6, npuesto: 320, estado: null,
      ext: 56737, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2018, idzona: 16, x: 3, y: 8, npuesto: 400, estado: null,
      ext: 56643, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2019, idzona: 16, x: 3, y: 9, npuesto: 399, estado: null,
      ext: 56573, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2020, idzona: 16, x: 3, y: 10, npuesto: 398, estado: null, ext: 56700, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2021, idzona: 16, x: 3, y: 11, npuesto: 397, estado: null, ext: 56504, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2022, idzona: 16, x: 3, y: 12, npuesto: 396, estado: null, ext: 56508, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2023, idzona: 16, x: 3, y: 13, npuesto: 395, estado: null, ext: 56505, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2024, idzona: 16, x: 3, y: 14, npuesto: 394, estado: null, ext: 56507, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2025, idzona: 16, x: 5, y: 2, npuesto: 315, estado: null,
      ext: 56762, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2026, idzona: 16, x: 5, y: 3, npuesto: 316, estado: null,
      ext: 56547, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2027, idzona: 16, x: 5, y: 4, npuesto: 317, estado: null,
      ext: 56758, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2028, idzona: 16, x: 5, y: 5, npuesto: 318, estado: null,
      ext: 56759, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2029, idzona: 16, x: 5, y: 6, npuesto: 319, estado: null,
      ext: 56509, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2030, idzona: 16, x: 5, y: 8, npuesto: 389, estado: null,
      ext: 56509, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2031, idzona: 16, x: 5, y: 9, npuesto: 390, estado: null,
      ext: 56588, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2032, idzona: 16, x: 5, y: 10, npuesto: 391, estado: null
      , ext: 56586, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2033, idzona: 16, x: 5, y: 11, npuesto: 392, estado: null
      , ext: 56585, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2034, idzona: 16, x: 5, y: 12, npuesto: 393, estado: null
      , ext: 56543, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2035, idzona: 16, x: 6, y: 2, npuesto: 314, estado: null,
      ext: 56523, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2036, idzona: 16, x: 6, y: 3, npuesto: 313, estado: null,
      ext: 56545, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2037, idzona: 16, x: 6, y: 4, npuesto: 312, estado: null,
      ext: 56501, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2038, idzona: 16, x: 6, y: 5, npuesto: 311, estado: null,
      ext: 56589, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2039, idzona: 16, x: 6, y: 6, npuesto: 310, estado: null,
      ext: 56520, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2040, idzona: 16, x: 6, y: 8, npuesto: 388, estado: null,
      ext: 56738, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2041, idzona: 16, x: 6, y: 9, npuesto: 387, estado: null,
      ext: 56607, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2042, idzona: 16, x: 6, y: 10, npuesto: 386, estado: null, ext: 56524, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2043, idzona: 16, x: 6, y: 11, npuesto: 385, estado: null, ext: 56715, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2044, idzona: 16, x: 6, y: 12, npuesto: 384, estado: null, ext: 56606, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2045, idzona: 16, x: 6, y: 14, npuesto: 383, estado: null, ext: 56510, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2046, idzona: 16, x: 6, y: 15, npuesto: 382, estado: null, ext: 56506, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2047, idzona: 16, x: 6, y: 16, npuesto: 381, estado: null, ext: 56550, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2048, idzona: 16, x: 6, y: 17, npuesto: 380, estado: null, ext: 56560, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2049, idzona: 16, x: 6, y: 18, npuesto: 379, estado: null, ext: 56580, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2050, idzona: 16, x: 8, y: 3, npuesto: 306, estado: null,
      ext: 56578, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2051, idzona: 16, x: 8, y: 4, npuesto: 307, estado: null,
      ext: 56702, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2052, idzona: 16, x: 8, y: 5, npuesto: 308, estado: null,
      ext: 56515, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2053, idzona: 16, x: 8, y: 6, npuesto: 309, estado: null,
      ext: 56761, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2054, idzona: 16, x: 8, y: 14, npuesto: 374, estado: null, ext: 56743, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2055, idzona: 16, x: 8, y: 15, npuesto: 375, estado: null, ext: 56626, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2056, idzona: 16, x: 8, y: 16, npuesto: 376, estado: null, ext: 56540, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2057, idzona: 16, x: 8, y: 17, npuesto: 377, estado: null, ext: 56516, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2058, idzona: 16, x: 8, y: 18, npuesto: 378, estado: null, ext: 56620, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2059, idzona: 16, x: 9, y: 3, npuesto: 305, estado: null,
      ext: 56575, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2060, idzona: 16, x: 9, y: 4, npuesto: 304, estado: null,
      ext: 56534, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2061, idzona: 16, x: 9, y: 5, npuesto: 303, estado: null,
      ext: 56574, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2062, idzona: 16, x: 9, y: 6, npuesto: 302, estado: null,
      ext: 56549, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2063, idzona: 16, x: 9, y: 15, npuesto: 373, estado: null, ext: 56619, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2064, idzona: 16, x: 9, y: 16, npuesto: 372, estado: null, ext: 56512, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2065, idzona: 16, x: 9, y: 17, npuesto: 371, estado: null, ext: 56610, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2066, idzona: 16, x: 9, y: 18, npuesto: 370, estado: null, ext: 56513, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2067, idzona: 16, x: 11, y: 3, npuesto: 285, estado: null, ext: 56622, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2068, idzona: 16, x: 11, y: 4, npuesto: 286, estado: null, ext: 56576, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2069, idzona: 16, x: 11, y: 5, npuesto: 287, estado: null, ext: 56521, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2070, idzona: 16, x: 11, y: 6, npuesto: 288, estado: null, ext: 56611, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2071, idzona: 16, x: 11, y: 9, npuesto: 291, estado: null, ext: 56653, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2072, idzona: 16, x: 11, y: 10, npuesto: 292, estado: null, ext: 56514, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2073, idzona: 16, x: 11, y: 11, npuesto: 293, estado: null, ext: 56621, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2074, idzona: 16, x: 11, y: 12, npuesto: 294, estado: null, ext: 56572, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2075, idzona: 16, x: 11, y: 15, npuesto: 297, estado: null,
      ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2076, idzona: 16, x: 11, y: 16, npuesto: 298, estado: null,
      ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2077, idzona: 16, x: 11, y: 17, npuesto: 299, estado: null,
      ext: 56752, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2078, idzona: 16, x: 11, y: 18, npuesto: 300, estado: null,
      ext: 56741, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2079, idzona: 16, x: 11, y: 19, npuesto: 301, estado: null,
      ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2080, idzona: 16, x: 13, y: 3, npuesto: 277, estado: null, ext: 56592, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2081, idzona: 16, x: 13, y: 4, npuesto: 278, estado: null, ext: 565723, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2082, idzona: 16, x: 13, y: 5, npuesto: 279, estado: null, ext: 56651, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2083, idzona: 16, x: 13, y: 6, npuesto: 280, estado: null, ext: 56754, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2084, idzona: 16, x: 13, y: 9, npuesto: 281, estado: null, ext: 56623, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2085, idzona: 16, x: 13, y: 10, npuesto: 282, estado: null, ext: 56690, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2086, idzona: 16, x: 13, y: 11, npuesto: 283, estado: null,
      ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2087, idzona: 16, x: 13, y: 12, npuesto: 284, estado: null, ext: 56716, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2088, idzona: 16, x: 13, y: 15, npuesto: 173, estado: null, ext: 56857, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2089, idzona: 16, x: 13, y: 16, npuesto: 174, estado: null, ext: 56856, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2090, idzona: 16, x: 13, y: 17, npuesto: 175, estado: null, ext: 56910, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2091, idzona: 16, x: 13, y: 18, npuesto: 176, estado: null, ext: 56858, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2092, idzona: 16, x: 13, y: 19, npuesto: 177, estado: null, ext: 56701, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2093, idzona: 16, x: 14, y: 3, npuesto: 276, estado: null, ext: 56935, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2094, idzona: 16, x: 14, y: 4, npuesto: 275, estado: null, ext: 56627, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2095, idzona: 16, x: 14, y: 5, npuesto: 274, estado: null, ext: 56541, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2096, idzona: 16, x: 14, y: 6, npuesto: 273, estado: null, ext: 56593, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2097, idzona: 16, x: 14, y: 9, npuesto: 272, estado: null, ext: 56617, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2098, idzona: 16, x: 14, y: 10, npuesto: 271, estado: null, ext: 56686, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2099, idzona: 16, x: 14, y: 11, npuesto: 270, estado: null, ext: 56685, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2100, idzona: 16, x: 14, y: 12, npuesto: 269, estado: null, ext: 56717, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2101, idzona: 16, x: 14, y: 15, npuesto: 172, estado: null, ext: 56587, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2102, idzona: 16, x: 14, y: 16, npuesto: 171, estado: null, ext: 56903, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2103, idzona: 16, x: 14, y: 17, npuesto: 170, estado: null, ext: 56902, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2104, idzona: 16, x: 14, y: 18, npuesto: 169, estado: null, ext: 56901, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2105, idzona: 16, x: 14, y: 19, npuesto: 168, estado: null, ext: 56900, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2106, idzona: 16, x: 14, y: 28, npuesto: 75, estado: null, ext: 51096, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2107, idzona: 16, x: 14, y: 29, npuesto: 74, estado: null, ext: 51755, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2108, idzona: 16, x: 14, y: 30, npuesto: 73, estado: null, ext: 51087, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2109, idzona: 16, x: 14, y: 31, npuesto: 72, estado: null, ext: 51171, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2110, idzona: 16, x: 14, y: 32, npuesto: 71, estado: null, ext: 51514, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2111, idzona: 16, x: 14, y: 33, npuesto: 70, estado: null, ext: 51095, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2112, idzona: 16, x: 16, y: 3, npuesto: 261, estado: null, ext: 56522, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2113, idzona: 16, x: 16, y: 4, npuesto: 262, estado: null, ext: 56517, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2114, idzona: 16, x: 16, y: 5, npuesto: 263, estado: null, ext: 56615, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2115, idzona: 16, x: 16, y: 6, npuesto: 264, estado: null, ext: 56561, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2116, idzona: 16, x: 16, y: 7, npuesto: 265, estado: null, ext: 56562, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2117, idzona: 16, x: 16, y: 9, npuesto: 266, estado: null, ext: 56694, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2118, idzona: 16, x: 16, y: 10, npuesto: 267, estado: null, ext: 56687, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2119, idzona: 16, x: 16, y: 11, npuesto: 268, estado: null, ext: 56551, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2120, idzona: 16, x: 16, y: 16, npuesto: 164, estado: null, ext: 56736, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2121, idzona: 16, x: 16, y: 17, npuesto: 165, estado: null, ext: 56861, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2122, idzona: 16, x: 16, y: 18, npuesto: 166, estado: null, ext: 56859, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2123, idzona: 16, x: 16, y: 19, npuesto: 167, estado: null, ext: 56860, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2124, idzona: 16, x: 16, y: 22, npuesto: 80, estado: null, ext: 56747, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2125, idzona: 16, x: 16, y: 23, npuesto: 79, estado: null, ext: 56745, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2126, idzona: 16, x: 16, y: 24, npuesto: 78, estado: null, ext: 56771, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2127, idzona: 16, x: 16, y: 25, npuesto: 77, estado: null, ext: 56914, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2128, idzona: 16, x: 16, y: 26, npuesto: 76, estado: null, ext: 56773, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2129, idzona: 16, x: 16, y: 28, npuesto: 66, estado: null, ext: 56499, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2130, idzona: 16, x: 16, y: 29, npuesto: 67, estado: null, ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2131, idzona: 16, x: 16, y: 30, npuesto: 68, estado: null, ext: 51213, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2132, idzona: 16, x: 16, y: 31, npuesto: 69, estado: null, ext: 56500, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2133, idzona: 16, x: 17, y: 3, npuesto: 260, estado: null, ext: 56697, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2134, idzona: 16, x: 17, y: 4, npuesto: 259, estado: null, ext: 56698, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2135, idzona: 16, x: 17, y: 5, npuesto: 258, estado: null, ext: 56699, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2136, idzona: 16, x: 17, y: 6, npuesto: 257, estado: null, ext: 56696, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2137, idzona: 16, x: 17, y: 7, npuesto: 256, estado: null, ext: 56695, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2138, idzona: 16, x: 17, y: 9, npuesto: 255, estado: null, ext: 56753, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2139, idzona: 16, x: 17, y: 10, npuesto: 254, estado: null, ext: 56579, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2140, idzona: 16, x: 17, y: 11, npuesto: 253, estado: null, ext: 56744, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2141, idzona: 16, x: 17, y: 16, npuesto: 163, estado: null, ext: 56735, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2142, idzona: 16, x: 17, y: 17, npuesto: 162, estado: null, ext: 56734, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2143, idzona: 16, x: 17, y: 18, npuesto: 161, estado: null, ext: 56733, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2144, idzona: 16, x: 17, y: 19, npuesto: 160, estado: null, ext: 56732, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2145, idzona: 16, x: 17, y: 22, npuesto: 81, estado: null, ext: 56932, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2146, idzona: 16, x: 17, y: 23, npuesto: 82, estado: null, ext: 56926, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2147, idzona: 16, x: 17, y: 24, npuesto: 83, estado: null, ext: 56927, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2148, idzona: 16, x: 17, y: 25, npuesto: 84, estado: null, ext: 56923, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2149, idzona: 16, x: 17, y: 26, npuesto: 85, estado: null, ext: 56931, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2150, idzona: 16, x: 17, y: 28, npuesto: 65, estado: null, ext: 56624, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2151, idzona: 16, x: 17, y: 29, npuesto: 64, estado: null, ext: 56570, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2152, idzona: 16, x: 17, y: 30, npuesto: 63, estado: null, ext: 51218, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2153, idzona: 16, x: 17, y: 31, npuesto: 62, estado: null, ext: 51221, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2154, idzona: 16, x: 19, y: 3, npuesto: 245, estado: null, ext: 56641, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2155, idzona: 16, x: 19, y: 4, npuesto: 246, estado: null, ext: 56642, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2156, idzona: 16, x: 19, y: 5, npuesto: 247, estado: null, ext: 56647, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2157, idzona: 16, x: 19, y: 6, npuesto: 248, estado: null, ext: 56645, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2158, idzona: 16, x: 19, y: 7, npuesto: 249, estado: null, ext: 56646, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2159, idzona: 16, x: 19, y: 8, npuesto: 250, estado: null, ext: 56640, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2160, idzona: 16, x: 19, y: 9, npuesto: 251, estado: null, ext: 56746, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2161, idzona: 16, x: 19, y: 10, npuesto: 252, estado: null,
      ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2162, idzona: 16, x: 19, y: 16, npuesto: 156, estado: null, ext: 56936, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2163, idzona: 16, x: 19, y: 17, npuesto: 157, estado: null,
      ext: 56937, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2164, idzona: 16, x: 19, y: 18, npuesto: 158, estado: null,
      ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2165, idzona: 16, x: 19, y: 19, npuesto: 159, estado: null, ext: 56939, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2166, idzona: 16, x: 19, y: 22, npuesto: 90, estado: null, ext: 56913, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2167, idzona: 16, x: 19, y: 23, npuesto: 89, estado: null, ext: 56922, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2168, idzona: 16, x: 19, y: 24, npuesto: 88, estado: null, ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2169, idzona: 16, x: 19, y: 25, npuesto: 87, estado: null, ext: 56924, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2170, idzona: 16, x: 19, y: 26, npuesto: 86, estado: null, ext: 56748, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2171, idzona: 16, x: 19, y: 28, npuesto: 57, estado: null, ext: 54612, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2172, idzona: 16, x: 19, y: 29, npuesto: 58, estado: null, ext: 54635, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2173, idzona: 16, x: 19, y: 30, npuesto: 59, estado: null, ext: 54613, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2174, idzona: 16, x: 19, y: 31, npuesto: 60, estado: null, ext: 54612, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2175, idzona: 16, x: 19, y: 32, npuesto: 61, estado: null, ext: 54607, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2176, idzona: 16, x: 20, y: 3, npuesto: 244, estado: null, ext: 56644, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2177, idzona: 16, x: 20, y: 4, npuesto: 243, estado: null, ext: 56648, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2178, idzona: 16, x: 20, y: 5, npuesto: 242, estado: null, ext: 56636, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2179, idzona: 16, x: 20, y: 6, npuesto: 241, estado: null, ext: 56657, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2180, idzona: 16, x: 20, y: 7, npuesto: 240, estado: null, ext: 56658, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2181, idzona: 16, x: 20, y: 8, npuesto: 239, estado: null, ext: 56660, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2182, idzona: 16, x: 20, y: 9, npuesto: 238, estado: null, ext: 56635, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2183, idzona: 16, x: 20, y: 10, npuesto: 237, estado: null, ext: 56637, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2184, idzona: 16, x: 20, y: 16, npuesto: 155, estado: null, ext: 56548, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2185, idzona: 16, x: 20, y: 17, npuesto: 154, estado: null, ext: 56916, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2186, idzona: 16, x: 20, y: 18, npuesto: 153, estado: null, ext: 56769, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2187, idzona: 16, x: 20, y: 19, npuesto: 152, estado: null, ext: 56917, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2188, idzona: 16, x: 20, y: 22, npuesto: 91, estado: null, ext: 56770, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2189, idzona: 16, x: 20, y: 23, npuesto: 92, estado: null, ext: 56749, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2190, idzona: 16, x: 20, y: 24, npuesto: 93, estado: null, ext: 56920, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2191, idzona: 16, x: 20, y: 25, npuesto: 94, estado: null, ext: 56919, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2192, idzona: 16, x: 20, y: 26, npuesto: 95, estado: null, ext: 56921, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2193, idzona: 16, x: 20, y: 28, npuesto: 56, estado: null, ext: 54616, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2194, idzona: 16, x: 20, y: 29, npuesto: 55, estado: null, ext: 54617, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2195, idzona: 16, x: 20, y: 30, npuesto: 54, estado: null, ext: 54618, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2196, idzona: 16, x: 20, y: 31, npuesto: 53, estado: null, ext: 54619, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2197, idzona: 16, x: 20, y: 32, npuesto: 52, estado: null, ext: 54620, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2198, idzona: 16, x: 22, y: 3, npuesto: 229, estado: null, ext: 56537, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2199, idzona: 16, x: 22, y: 4, npuesto: 230, estado: null, ext: 56604, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2200, idzona: 16, x: 22, y: 5, npuesto: 231, estado: null, ext: 56536, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2201, idzona: 16, x: 22, y: 6, npuesto: 232, estado: null, ext: 56538, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2202, idzona: 16, x: 22, y: 7, npuesto: 233, estado: null, ext: 56529, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2203, idzona: 16, x: 22, y: 8, npuesto: 234, estado: null, ext: 56629, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2204, idzona: 16, x: 22, y: 9, npuesto: 235, estado: null, ext: 56693, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2205, idzona: 16, x: 22, y: 10, npuesto: 236, estado: null, ext: 56855, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2206, idzona: 16, x: 22, y: 15, npuesto: 147, estado: null, ext: 56518, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2207, idzona: 16, x: 22, y: 16, npuesto: 148, estado: null, ext: 56742, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2208, idzona: 16, x: 22, y: 17, npuesto: 149, estado: null,
      ext: 0, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    { id: 2209, idzona: 16, x: 22, y: 18, npuesto: 150, estado: null, ext: 56933, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2210, idzona: 16, x: 22, y: 19, npuesto: 151, estado: null, ext: 56568, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2211, idzona: 16, x: 22, y: 22, npuesto: 100, estado: null, ext: 56928, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2212, idzona: 16, x: 22, y: 23, npuesto: 99, estado: null, ext: 56929, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2213, idzona: 16, x: 22, y: 24, npuesto: 98, estado: null, ext: 56918, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2214, idzona: 16, x: 22, y: 25, npuesto: 97, estado: null, ext: 56772, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2215, idzona: 16, x: 22, y: 26, npuesto: 96, estado: null, ext: 56930, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2216, idzona: 16, x: 22, y: 28, npuesto: 47, estado: null, ext: 54671, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2217, idzona: 16, x: 22, y: 29, npuesto: 48, estado: null, ext: 54624, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2218, idzona: 16, x: 22, y: 30, npuesto: 49, estado: null, ext: 54622, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2219, idzona: 16, x: 22, y: 31, npuesto: 50, estado: null, ext: 54673, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2220, idzona: 16, x: 22, y: 32, npuesto: 51, estado: null, ext: 54621, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2221, idzona: 16, x: 23, y: 3, npuesto: 228, estado: null, ext: 56631, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2222, idzona: 16, x: 23, y: 4, npuesto: 227, estado: null, ext: 56591, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2223, idzona: 16, x: 23, y: 5, npuesto: 226, estado: null, ext: 56590, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2224, idzona: 16, x: 23, y: 6, npuesto: 225, estado: null, ext: 56595, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2225, idzona: 16, x: 23, y: 7, npuesto: 224, estado: null, ext: 56634, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2226, idzona: 16, x: 23, y: 8, npuesto: 223, estado: null, ext: 56639, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2227, idzona: 16, x: 23, y: 9, npuesto: 222, estado: null, ext: 56632, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2228, idzona: 16, x: 23, y: 10, npuesto: 221, estado: null, ext: 56603, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2229, idzona: 16, x: 23, y: 16, npuesto: 146, estado: null, ext: 56613, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2230, idzona: 16, x: 23, y: 17, npuesto: 145, estado: null, ext: 56752, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2231, idzona: 16, x: 23, y: 18, npuesto: 144, estado: null, ext: 56618, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2232, idzona: 16, x: 23, y: 19, npuesto: 143, estado: null, ext: 56750, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2233, idzona: 16, x: 23, y: 22, npuesto: 101, estado: null, ext: 56638, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2234, idzona: 16, x: 23, y: 23, npuesto: 102, estado: null, ext: 56652, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2235, idzona: 16, x: 23, y: 24, npuesto: 103, estado: null, ext: 56654, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2236, idzona: 16, x: 23, y: 25, npuesto: 104, estado: null, ext: 56650, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2237, idzona: 16, x: 23, y: 26, npuesto: 105, estado: null, ext: 56731, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2238, idzona: 16, x: 23, y: 28, npuesto: 46, estado: null, ext: 54626, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2239, idzona: 16, x: 23, y: 29, npuesto: 45, estado: null, ext: 54627, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2240, idzona: 16, x: 23, y: 30, npuesto: 44, estado: null, ext: 54628, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2241, idzona: 16, x: 23, y: 31, npuesto: 43, estado: null, ext: 54629, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2242, idzona: 16, x: 23, y: 32, npuesto: 42, estado: null, ext: 54603, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2243, idzona: 16, x: 25, y: 3, npuesto: 213, estado: null, ext: 56535, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2244, idzona: 16, x: 25, y: 4, npuesto: 214, estado: null, ext: 56530, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2245, idzona: 16, x: 25, y: 5, npuesto: 215, estado: null, ext: 56661, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2246, idzona: 16, x: 25, y: 6, npuesto: 216, estado: null, ext: 56527, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2247, idzona: 16, x: 25, y: 7, npuesto: 217, estado: null, ext: 56531, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2248, idzona: 16, x: 25, y: 9, npuesto: 218, estado: null, ext: 56533, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2249, idzona: 16, x: 25, y: 10, npuesto: 219, estado: null, ext: 56532, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2250, idzona: 16, x: 25, y: 11, npuesto: 220, estado: null, ext: 56904, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2251, idzona: 16, x: 25, y: 17, npuesto: 139, estado: null, ext: 56714, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2252, idzona: 16, x: 25, y: 18, npuesto: 140, estado: null, ext: 56915, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2253, idzona: 16, x: 25, y: 19, npuesto: 141, estado: null, ext: 56740, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2254, idzona: 16, x: 25, y: 20, npuesto: 142, estado: null, ext: 56718, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2255, idzona: 16, x: 25, y: 23, npuesto: 110, estado: null, ext: 56656, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2256, idzona: 16, x: 25, y: 24, npuesto: 109, estado: null, ext: 56655, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2257, idzona: 16, x: 25, y: 25, npuesto: 108, estado: null, ext: 56722, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2258, idzona: 16, x: 25, y: 26, npuesto: 107, estado: null, ext: 56553, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2259, idzona: 16, x: 25, y: 27, npuesto: 106, estado: null, ext: 56730, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2260, idzona: 16, x: 25, y: 29, npuesto: 37, estado: null, ext: 54670, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2261, idzona: 16, x: 25, y: 30, npuesto: 38, estado: null, ext: 54638, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2262, idzona: 16, x: 25, y: 31, npuesto: 39, estado: null, ext: 54633, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2263, idzona: 16, x: 25, y: 32, npuesto: 40, estado: null, ext: 54639, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2264, idzona: 16, x: 25, y: 33, npuesto: 41, estado: null, ext: 54631, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2265, idzona: 16, x: 26, y: 3, npuesto: 212, estado: null, ext: 56528, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2266, idzona: 16, x: 26, y: 4, npuesto: 211, estado: null, ext: 56649, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2267, idzona: 16, x: 26, y: 5, npuesto: 210, estado: null, ext: 56630, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2268, idzona: 16, x: 26, y: 6, npuesto: 209, estado: null, ext: 56628, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2269, idzona: 16, x: 26, y: 7, npuesto: 208, estado: null, ext: 56662, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2270, idzona: 16, x: 26, y: 8, npuesto: 207, estado: null, ext: 56665, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2271, idzona: 16, x: 26, y: 9, npuesto: 206, estado: null, ext: 56664, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2272, idzona: 16, x: 26, y: 10, npuesto: 205, estado: null, ext: 56599, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2273, idzona: 16, x: 26, y: 11, npuesto: 204, estado: null, ext: 56663, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2274, idzona: 16, x: 26, y: 16, npuesto: 134, estado: null, ext: 56609, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2275, idzona: 16, x: 26, y: 17, npuesto: 135, estado: null, ext: 56624, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2276, idzona: 16, x: 26, y: 18, npuesto: 136, estado: null, ext: 56691, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2277, idzona: 16, x: 26, y: 19, npuesto: 137, estado: null, ext: 56688, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2278, idzona: 16, x: 26, y: 20, npuesto: 138, estado: null, ext: 56689, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2279, idzona: 16, x: 26, y: 23, npuesto: 111, estado: null, ext: 56666, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2280, idzona: 16, x: 26, y: 24, npuesto: 112, estado: null, ext: 56667, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2281, idzona: 16, x: 26, y: 25, npuesto: 113, estado: null, ext: 56668, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2282, idzona: 16, x: 26, y: 26, npuesto: 114, estado: null, ext: 56669, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2283, idzona: 16, x: 26, y: 27, npuesto: 115, estado: null, ext: 56670, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2284, idzona: 16, x: 26, y: 29, npuesto: 36, estado: null, ext: 54636, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2285, idzona: 16, x: 26, y: 30, npuesto: 35, estado: null, ext: 54637, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2286, idzona: 16, x: 26, y: 31, npuesto: 34, estado: null, ext: 54672, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2287, idzona: 16, x: 26, y: 32, npuesto: 33, estado: null, ext: 54667, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2288, idzona: 16, x: 26, y: 33, npuesto: 32, estado: null, ext: 54669, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2289, idzona: 16, x: 26, y: 34, npuesto: 31, estado: null, ext: 54668, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2290, idzona: 16, x: 28, y: 3, npuesto: 196, estado: null, ext: 56569, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2291, idzona: 16, x: 28, y: 4, npuesto: 197, estado: null, ext: 56600, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2292, idzona: 16, x: 28, y: 5, npuesto: 198, estado: null, ext: 56601, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2293, idzona: 16, x: 28, y: 6, npuesto: 199, estado: null, ext: 56602, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2294, idzona: 16, x: 28, y: 7, npuesto: 200, estado: null, ext: 56598, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2295, idzona: 16, x: 28, y: 8, npuesto: 201, estado: null, ext: 56597, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2296, idzona: 16, x: 28, y: 9, npuesto: 202, estado: null, ext: 56596, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2297, idzona: 16, x: 28, y: 10, npuesto: 203, estado: null, ext: 56755, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2298, idzona: 16, x: 28, y: 16, npuesto: 130, estado: null, ext: 56570, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2299, idzona: 16, x: 28, y: 17, npuesto: 131, estado: null, ext: 56499, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2300, idzona: 16, x: 28, y: 18, npuesto: 132, estado: null, ext: 56692, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2301, idzona: 16, x: 28, y: 19, npuesto: 133, estado: null, ext: 56571, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2302, idzona: 16, x: 28, y: 22, npuesto: 120, estado: null, ext: 56675, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2303, idzona: 16, x: 28, y: 23, npuesto: 119, estado: null, ext: 56674, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2304, idzona: 16, x: 28, y: 24, npuesto: 118, estado: null, ext: 56673, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2305, idzona: 16, x: 28, y: 25, npuesto: 117, estado: null, ext: 56672, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2306, idzona: 16, x: 28, y: 26, npuesto: 116, estado: null, ext: 56739, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2307, idzona: 16, x: 28, y: 29, npuesto: 27, estado: null, ext: 54664, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2308, idzona: 16, x: 28, y: 30, npuesto: 28, estado: null, ext: 54665, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2309, idzona: 16, x: 28, y: 31, npuesto: 29, estado: null, ext: 54666, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2310, idzona: 16, x: 28, y: 32, npuesto: 30, estado: null, ext: 54611, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2311, idzona: 16, x: 29, y: 3, npuesto: 195, estado: null, ext: 56616, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2312, idzona: 16, x: 29, y: 4, npuesto: 194, estado: null, ext: 56542, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2313, idzona: 16, x: 29, y: 5, npuesto: 193, estado: null, ext: 56567, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2314, idzona: 16, x: 29, y: 6, npuesto: 192, estado: null, ext: 56612, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2315, idzona: 16, x: 29, y: 7, npuesto: 191, estado: null, ext: 56566, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2316, idzona: 16, x: 29, y: 8, npuesto: 190, estado: null, ext: 56909, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2317, idzona: 16, x: 29, y: 9, npuesto: 189, estado: null, ext: 56864, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2318, idzona: 16, x: 29, y: 10, npuesto: 188, estado: null, ext: 56863, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2319, idzona: 16, x: 29, y: 16, npuesto: 129, estado: null, ext: 56584, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2320, idzona: 16, x: 29, y: 17, npuesto: 128, estado: null, ext: 56853, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2321, idzona: 16, x: 29, y: 18, npuesto: 127, estado: null, ext: 56766, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2322, idzona: 16, x: 29, y: 19, npuesto: 126, estado: null, ext: 56706, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2323, idzona: 16, x: 29, y: 22, npuesto: 121, estado: null, ext: 56725, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2324, idzona: 16, x: 29, y: 23, npuesto: 122, estado: null, ext: 56726, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2325, idzona: 16, x: 29, y: 24, npuesto: 123, estado: null, ext: 56727, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2326, idzona: 16, x: 29, y: 25, npuesto: 124, estado: null, ext: 56720, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2327, idzona: 16, x: 29, y: 26, npuesto: 125, estado: null, ext: 56721, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2328, idzona: 16, x: 29, y: 29, npuesto: 26, estado: null, ext: 54663, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2329, idzona: 16, x: 29, y: 30, npuesto: 25, estado: null, ext: 54659, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2330, idzona: 16, x: 29, y: 31, npuesto: 24, estado: null, ext: 54660, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2331, idzona: 16, x: 29, y: 32, npuesto: 23, estado: null, ext: 54661, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2332, idzona: 16, x: 31, y: 3, npuesto: 181, estado: null, ext: 56544, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2333, idzona: 16, x: 31, y: 4, npuesto: 182, estado: null, ext: 56503, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2334, idzona: 16, x: 31, y: 5, npuesto: 183, estado: null, ext: 56565, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2335, idzona: 16, x: 31, y: 6, npuesto: 184, estado: null, ext: 56911, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2336, idzona: 16, x: 31, y: 7, npuesto: 185, estado: null, ext: 56912, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2337, idzona: 16, x: 31, y: 8, npuesto: 186, estado: null, ext: 56908, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2338, idzona: 16, x: 31, y: 9, npuesto: 187, estado: null, ext: 56862, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2339, idzona: 16, x: 31, y: 21, npuesto: 12, estado: null, ext: 56756, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2340, idzona: 16, x: 31, y: 22, npuesto: 13, estado: null, ext: 56757, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2341, idzona: 16, x: 31, y: 23, npuesto: 14, estado: null, ext: 56763, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2342, idzona: 16, x: 31, y: 24, npuesto: 15, estado: null, ext: 56764, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2343, idzona: 16, x: 31, y: 25, npuesto: 16, estado: null, ext: 56765, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2344, idzona: 16, x: 31, y: 26, npuesto: 17, estado: null, ext: 56497, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2345, idzona: 16, x: 31, y: 27, npuesto: 18, estado: null, ext: 56498, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2346, idzona: 16, x: 31, y: 28, npuesto: 19, estado: null, ext: 56781, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2347, idzona: 16, x: 31, y: 29, npuesto: 20, estado: null, ext: 54656, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2348, idzona: 16, x: 31, y: 30, npuesto: 21, estado: null, ext: 54655, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2349, idzona: 16, x: 31, y: 31, npuesto: 22, estado: null, ext: 54662, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2350, idzona: 16, x: 32, y: 7, npuesto: 180, estado: null, ext: 56907, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2351, idzona: 16, x: 32, y: 8, npuesto: 179, estado: null, ext: 56906, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2352, idzona: 16, x: 32, y: 9, npuesto: 178, estado: null, ext: 56905, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2353, idzona: 16, x: 32, y: 21, npuesto: 11, estado: null, ext: 56495, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    { id: 2354, idzona: 16, x: 32, y: 22, npuesto: 10, estado: null, ext: 56854, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa' },
    {
      id: 2355, idzona: 16, x: 32, y: 23, npuesto: 9, estado: null,
      ext: 56724, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2356, idzona: 16, x: 32, y: 24, npuesto: 8, estado: null,
      ext: 56774, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2357, idzona: 16, x: 32, y: 25, npuesto: 7, estado: null,
      ext: 56713, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2358, idzona: 16, x: 32, y: 26, npuesto: 6, estado: null,
      ext: 56710, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2359, idzona: 16, x: 32, y: 27, npuesto: 5, estado: null,
      ext: 56496, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2360, idzona: 16, x: 32, y: 29, npuesto: 3, estado: null,
      ext: 54644, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2361, idzona: 16, x: 32, y: 30, npuesto: 2, estado: null,
      ext: 54643, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
    {
      id: 2362, idzona: 16, x: 32, y: 31, npuesto: 1, estado: null,
      ext: 54642, zona: 'Piso2 zona norte', site: 'TPCO BTS0', central: 'Copa'
    },
  ];
  gridSize = 50;
  public widthPosition = 40.5;
  public heightPosition = 25.5;
  public subscriptionInjectItem: Subscription;
  public BoundsMap: any;
  public map = [];
  public subResize: Subscription;
  public loading = true;
  public marginInfoAgent = {
    marginleft: -200,
    margintop: -200,
  };
  public infoAgent = {
    name: 'Cesar Bustos',
    status: 'ACD',
    time: '00:07',
    Aux: ''

  };
  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);

    this.subResize = this.observer.viewResize().subscribe(index => {

      // console.log(index, this.indexABS, 'llegóoooooo');
      if (index === this.indexABS) {
        this.Bounds();
      }
    });
  }

  realodInfo(info) {
    console.log('Recibidoooooo Mapa', info);
    this.detection.detectChanges();
  }

  initCache(name) {

  }

  ngAfterViewInit() {
    // const length = this.items.length;
    // let count = 0;
    // this.subscriptionInjectItem = interval(100).pipe(
    //   take((length)),
    // ).subscribe(time => {
    //   this.map.push(this.items[count]);
    //   count++;
    //   if (count === (length)) {
    //     this.subscriptionInjectItem.unsubscribe();
    //     console.log('Finalizó el dibujado.');
    //   }
    // });
    this.map = this.testItems;
    setTimeout(() => {
      this.loading = false;
      this.detection.detectChanges();
      this.Bounds();
    }, 3000);

    // const h = this.test.nativeElement as HTMLElement;
    // console.log(h.getBoundingClientRect());

  }

  onMoveEnd($event) {
    this.Bounds();
  }

  showInfo() {
    this.marginInfoAgent = { marginleft: 0, margintop: 0 };
    this.detectChanges();
  }
  closeInfo() {
    this.marginInfoAgent = { marginleft: -200, margintop: -200 };
    this.detectChanges();
  }



  Bounds() {
    const h = this.mapContainer.nativeElement as HTMLElement;
    console.log(h.getBoundingClientRect(), 'MAPA');
    this.BoundsMap = h.getBoundingClientRect();
    this.observer.setBoundPuesto(this.BoundsMap, this.indexABS);
  }

  Destroy() {
    if (this.subscriptionInjectItem) { this.subscriptionInjectItem.unsubscribe(); }
    if (this.subResize) { this.subResize.unsubscribe(); }

  }

}


export abstract class PositionAbs extends GeneralABS implements AfterViewInit {
  @ViewChild('puesto', { static: false, read: ElementRef }) puesto: ElementRef;
  public widthPosition = 40.5;
  public heightPosition = 25.5;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  // Time = 0;
  Time;
  public backGroundColor = '#ffff';

  public subBouns: Subscription;
  public myBounds: any;
  public show = false;

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);

    this.subBouns = this.observer.viewBoundPuesto().subscribe(res => {
      this.calculateBound(res);

    });
  }

  ngAfterViewInit() {
    this.Bounds();
  }

  Bounds() {
    const h = this.puesto.nativeElement as HTMLElement;
    // console.log(h.getBoundingClientRect(), 'puesto');
    this.myBounds = h.getBoundingClientRect();
  }

  calculateBound(info) {
    const bounds = info[0];
    if (info[1] === this.indexABS) {
      this.Bounds();
      if (
        (this.myBounds.left /*+ this.myBounds.width*/) > (bounds.left + bounds.width) ||
        (this.myBounds.left + this.widthPosition) < (bounds.left) ||
        (this.myBounds.top /*+ this.myBounds.height*/) > (bounds.top + bounds.height) ||
        (this.myBounds.top + this.heightPosition) < (bounds.top)
      ) {
        this.Time = 'Fuera';
        this.show = false;
        // console.log('Fuera');
      } else {
        // this.Time = 'Dentro';
        // setInterval(() => {
        this.Time = this.convertTime(Math.floor((Math.random() * 100) + 1));
        this.backGroundColor = this.observer.Colors[Math.floor((Math.random() * 7) + 1)];
        this.detection.detectChanges();
        // }, 5000);
        this.show = true;
        // console.log('Dentro');
      }
      this.detectChanges();
    }
  }

  time() {
    // setInterval(() => {
    //   this.Time = Math.floor((Math.random() * 100) + 1);
    //   this.detection.detectChanges();
    // }, 5000);
  }

  realodInfo() {

  }

  initCache(name) {

  }

  Destroy() {
    if (this.subBouns) { this.subBouns.unsubscribe(); }
  }

}


export abstract class FollowUpAbs extends GeneralABS implements AfterViewInit {
  // @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  source: LocalDataSource;
  subSearch: Subscription;
  public subsFollowList: Subscription;
  public subsEndFollow: Subscription;

  protected name = 'followUp';
  private ApiRest: ApiRestComponent;

  public settings = {
    // mode: 'external',
    mode: 'inline',
    // hideSubHeader: true,
    sort: true,
    attr: {
      class: 'FollowList',
    },
    editable: true,

    actions: {
      position: 'right',
      edit: false,
      delete: false,
      add: false,
      custom: [
        {
          name: 'confirm',
          title: '<i class="fas fa-clipboard-check"></i>',
        },
        //     {
        //       name: 'details',
        //       title: '<i class="nb-search"></i> ',
        //     },
        //     {
        //       name: 'destinataries',
        //       title: '<i class="nb-email"></i> ',
        //     },
        //     {
        //       name: 'remove',
        //       title: '<i class="nb-trash"></i> ',
        //     },
        //     {
        //       name: 'download',
        //       title: '<i class="nb-arrow-thin-down"></i>',
        //     },
      ],
    },
    columns: {
      nombre: {
        title: 'Name'
      },
      requestByUser: {
        title: 'Request By'
      },
      nameLob: {
        title: 'LOB'
      },
      Badge: {
        title: 'Reason'
      },
      // tiempo: {
      //   title: 'Time',
      //   valuePrepareFunction: (time) => {
      //     return this.convertTime(time);
      //   },
      //   sortDirection: 'asc'

      // },
      obs: {
        title: 'Obs'
      },
      followStatus: {
        title: 'Follow Status',
        sortDirection: 'asc'
      },
      ObSend: {
        title: 'Obs End'
      },
    }
  };
  constructor(
    public observer: ObserverService,
    public detection: ChangeDetectorRef,
    public dialog: NbDialogService,
    public request: RequestsService,
    public toastr: NbToastrService,
    public ngZone: NgZone
  ) {
    super(observer, ngZone, detection);
    this.subsFollowList = this.observer.viewObsFollow().subscribe(res => {
      this.source = new LocalDataSource(res);
    });
    this.ApiRest = this.observer.viewApiRest(this.name);
  }

  ngAfterViewInit() {
    // const info = [
    //   {
    //     nombre: 'Pepe',
    //     requestby: 'bustosmoreno.5',
    //     lob: 'Rebel',
    //     estadoactual: 'AUX',
    //     tiempo: 700,
    //     followR: 'ACW',
    //     followS: 'Following'
    //   },
    //   {
    //     nombre: 'Jill',
    //     requestby: 'bustosmoreno.5',
    //     lob: 'TS',
    //     estadoactual: 'ACD',
    //     tiempo: 1530,
    //     followR: 'Break',
    //     followS: 'Following'
    //   }
    // ];


    // this.source = new LocalDataSource(info);
  }

  onCustom(event) {
    console.log(event);
    switch (event.action) {
      case 'confirm':
        this.openConfirm(event.data);
        break;

      default:
        break;
    }
  }

  create() {

  }


  openConfirm(data: FollowList) {
    if (data.followStatus !== 'Inactive') {

      const dialog = this.dialog.open(ConfirmComponent,
        {
          closeOnBackdropClick: false, closeOnEsc: false, autoFocus: false,
          context: { name: data.nombre, status: data.Badge }
        })
        .onClose.subscribe(resp => {
          if (resp) {
            if (this.ApiRest) {
              const apiBody: ApiBody = {
                source: this.ApiRest.source,
                body: {
                  requestByUser: this.request.userInfo.data[0].ccmsuser,
                  followId: data.id,
                  observationEnd: resp,
                  case: 0
                }
              };
              this.subsEndFollow = this.request.ApiGeneral(apiBody).subscribe(res => {
                this.toastr.success('FollowUp completed');
                this.subsEndFollow.unsubscribe();
              }, err => {
                this.toastr.warning('Error completing follow Up', 'Try again');
                this.subsEndFollow.unsubscribe();
              });
            }
          }
        });
    }

  }


  realodInfo() {

  }

  initCache(name) {

  }

  cache() {
    this.source = new LocalDataSource(this.observer.followList);
  }

  Destroy() {
    if (this.subsFollowList) { this.subsFollowList.unsubscribe(); }
    if (this.subsEndFollow) { this.subsEndFollow.unsubscribe(); }

  }

}

export abstract class StatesMapAbs extends GeneralABS implements AfterViewInit {
  public estados = [];
  public puestos = [];
  public loading = false;
  public marginInfoAgent = {
    marginleft: -250,
  };

  public infoAgent = {
    nombre: '',
    Status: '',
    TimeState: 0,
    login: 0,
    Aux: ''
  };
  public iconos: IconActions[] = [];
  // public colors: string[] = [];
  // tslint:disable-next-line: only-arrow-functions
  public tiempoDescendente = (a, b) => {
    if (a.TimeState < b.TimeState) {
      return 1;
    }
    if (a.TimeState > b.TimeState) {
      return -1;
    }
    return 0;
  }

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public functions: FunctionsService, public ngZone: NgZone) {
    super(observer, ngZone, detection);
  }

  ngAfterViewInit() {
    this.iconos = this.observer.viewIcons;
    // this.colors = this.observer.Colors;
    // this.organizeEstados();

  }

  // initCache(name) {
  //   const x: Agents[] = (this.observer.cacheInfo(name));
  //   if (x) {
  //     const filter = this.filterStatic(x);
  //     const estados = filter.map(data => data.Status);
  //     this.estados = [];
  //     this.estados = [...new Set(estados)].sort();
  //     this.puestos = [];
  //     this.estados.forEach(estado => {
  //       const c = filter.filter(data => data.Status === estado);
  //       this.puestos.push({ lobName: estado, agentes: c.sort(this.tiempoDescendente) });
  //     });
  //     this.detection.detectChanges();
  //     ///////////// Detectar cambios
  //     this.detection.detectChanges();
  //     setTimeout(() => {
  //       this.detection.detectChanges();
  //       console.log('Debería cambiar el cache');
  //     }, 1000);
  //   } else {
  //     console.log('Sin caché');
  //   }
  // }

  realodInfo(info: Agents[]) {
    if (info.length !== 0) {
      const filter = this.filterStatic(info);
      if (this.infoAgent.login !== 0) {
        this.infoAgent = filter.find(data => Number(data.login) === Number(this.infoAgent.login));
      }
      const estados = filter.map(data => data.Status);
      this.estados = [];
      this.estados = [...new Set(estados)].sort();
      this.puestos = [];
      this.estados.forEach(estado => {
        const c = filter.filter(data => data.Status === estado);
        this.puestos.push({ lobName: estado, agentes: c.sort(this.tiempoDescendente) });
      });
      this.detectChanges()
    }
  }

  showInfo(info: Agents) {
    this.infoAgent = info;
    this.marginInfoAgent = { marginleft: -15 };
    this.detectChanges();
  }
  closeInfo() {
    this.marginInfoAgent = { marginleft: -250 };
    this.infoAgent = {
      nombre: '',
      Status: '',
      TimeState: 0,
      login: 0,
      Aux: ''
    };
    this.detectChanges();
  }
  Destroy() {

  }

}

export abstract class ConsolidateAuxAbs extends GeneralABS {
  public titles: string[] = [];
  public lobs: any[] = [];
  public row: Row[] = [];
  public AgentesRes: Agents[] = [];
  public suma: any;
  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);
  }


  realodInfo(Agentes: Agents[]) {
    if (Agentes) {
      if (Agentes.length) {
        const agentsAux = Agentes.filter(data => { return data.Aux !== '' });
        console.log(Agentes, 'Tabla de lobs')
        const titles = agentsAux.map(data => data.Aux);
        this.titles = [];
        this.titles = [...new Set(titles)].sort(this.AcsTitles);
        // this.widthTitle = 100 / this.titles.length;
        this.AgentesRes = Agentes;
        const lobs = Agentes.map(data => data.Lob);
        this.lobs = [];
        this.lobs = [...new Set(lobs)];
        this.row = [];
        this.suma = new Object();
        this.lobs.forEach(lob => {
          let cantidad: any[] = [];
          this.titles.forEach(title => {
            const c = Agentes.filter(data => data.Lob === lob && data.Aux === title).length;
            cantidad.push({ aux: title, cantidad: c })
            this.suma[title] = this.suma[title] === undefined ? c : this.suma[title] + c;
          });
          this.row.push({ lob: lob, auxs: cantidad });
        });
        console.log(this.suma);
        this.detectChanges();
      }
    }
  }



  // initCache(name) {
  //   const x = this.observer.cacheInfo(name);
  //   console.log('Información cacheada, verificarrrrrrrrrrrrrrrrrrrrrrrrr', x);
  //   this.realodInfo(x);
  // }

  count(aux) {
    return this.suma[aux];
  }
  Destroy() {
  }
}

export abstract class RTMAbs extends GeneralABS {
  // public AcsTitles = function (a, b) {
  //   if (a > b) {
  //     return 1;
  //   }
  //   if (a < b) {
  //     return -1;
  //   }
  //   return 0;
  // };
  // public listInfo: RTMlist[] = [];
  @ViewChild(FollowUpPopoverComponent, { static: true, read: FollowUpPopoverComponent }) followUp: FollowUpPopoverComponent;
  source: LocalDataSource;
  subSearch: Subscription;
  filtroQuery: any;
  public settings = {
    mode: 'external',
    hideSubHeader: true,
    sort: true,
    attr: {
      class: 'agentsList',
    },
    pager: {
      display: true,
      perPage: 1000
    },

    actions: {
      position: 'left',
      edit: false,
      delete: false,
      add: false,
    },

    columns: {
      alarm: {
        title: '',
        type: 'custom',
        renderComponent: IconTableComponent,
        onComponentInitFunction: (instance) => {
          instance.openFollow.subscribe(res => {
            this.followUp.changeInfo(res);
          });
        },
      },
      nombre: {
        title: 'Name'
      },
      descripcion: {
        title: 'Alarm',
        // valuePrepareFunction: (time) => {
        //   return this.convertTime(time);
        // },
        sortDirection: 'asc'

      },
      estado: {
        title: 'Estado/Aux'
      },
      tiempoad: {
        title: 'Ex/InAd',
        valuePrepareFunction: (time) => {
          return this.convertTime(time);
        },
      },
      idccms: {
        title: 'Idccms'
      }
    }
  };

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);
    this.subSearch = this.observer.viewSearch().subscribe(res => {
      this.onSearch(res);
    });
  }


  realodInfo(info: RTMlist[]) {
    if (info.length !== 0) {
      const x = new LocalDataSource(info);
      this.source = x;
      if (this.filtroQuery) {
        this.applyFilter();
      }
      ///////////// Detectar cambios
      this.detectChanges();
    };
    // this.listInfo = info;
    // if (Agentes) {
    //   const agentsAux = Agentes.filter(data => { return data.Aux !== '' });
    //   console.log(Agentes, 'Tabla de lobs')
    //   const titles = agentsAux.map(data => data.Aux);
    //   this.titles = [];
    //   this.titles = [...new Set(titles)].sort(this.AcsTitles);
    //   // this.widthTitle = 100 / this.titles.length;
    //   this.AgentesRes = Agentes;
    //   const lobs = Agentes.map(data => data.Lob);
    //   this.lobs = [];
    //   this.lobs = [...new Set(lobs)];
    //   this.row = [];
    //   this.suma = new Object();
    //   this.lobs.forEach(lob => {
    //     let cantidad: any[] = [];
    //     this.titles.forEach(title => {
    //       const c = Agentes.filter(data => data.Lob === lob && data.Aux === title).length;
    //       cantidad.push({ aux: title, cantidad: c })
    //       this.suma[title] = this.suma[title] === undefined ? c : this.suma[title] + c;
    //     });
    //     this.row.push({ lob: lob, auxs: cantidad });
    //   });
    //   console.log(this.suma);
    // this.refresh();
    // }
    console.log(info, 'descarga RTMMMMMMMMMMMMMMMMMMMMMMMMMM');
  }


  // refresh() {
  //   setTimeout(() => {
  //     this.detection.detectChanges();
  //   }, 1000);
  // }

  // initCache(name) {
  //   // const x = this.observer.cacheInfo(name);
  //   // console.log('Información cacheada, verificarrrrrrrrrrrrrrrrrrrrrrrrr', x);
  //   // this.realodInfo(x);
  //   const x = (this.observer.cacheInfo(name));
  //   if (x) {
  //     this.source = new LocalDataSource(x);
  //     if (this.filtroQuery) {
  //       this.applyFilter();
  //     }
  //     ///////////// Detectar cambios
  //     this.detection.detectChanges();
  //     setTimeout(() => {
  //       this.detection.detectChanges();
  //       console.log('Debería cambiar el cache');
  //     }, 1000);
  //   } else {
  //     console.log('Sin caché');
  //   }
  // }

  // count(aux) {
  //   return this.suma[aux];
  // }

  onSearch(query) {
    if (typeof query === 'boolean') {
      this.filtroQuery = undefined;
      this.source.setFilter([]);
    } else {
      this.filtroQuery = query;
      this.applyFilter();
    }
    setTimeout(() => {
      this.detectChanges();
    }, 1000);

  }

  applyFilter() {

    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'nombre',
        search: this.filtroQuery
      },
      {
        field: 'descripcion',
        search: this.filtroQuery
      },
      {
        field: 'estado',
        search: this.filtroQuery
      },
      {
        field: 'idccms',
        search: this.filtroQuery
      }
    ], false);
  }

  onCustom(event) {
    console.log(event, 'Un evento se ha generado');
  }


  Destroy() {
    if (this.subSearch) { this.subSearch.unsubscribe(); }
  }
}

export abstract class KpisConsolidatedAbs extends GeneralABS {
  @ViewChild(FollowUpPopoverComponent, { static: true, read: FollowUpPopoverComponent }) followUp: FollowUpPopoverComponent;
  source: LocalDataSource;
  subSearch: Subscription;
  filtroQuery: any;
  public settings = {
    mode: 'external',
    hideSubHeader: true,
    sort: true,
    attr: {
      class: 'agentsList',
    },
    pager: {
      display: true,
      perPage: 1000
    },

    actions: {
      position: 'left',
      edit: false,
      delete: false,
      add: false,
    },

    columns: {
      // alarm: {
      //   title: '',
      //   type: 'custom',
      //   renderComponent: IconTableComponent,
      //   onComponentInitFunction: (instance) => {
      //     instance.openFollow.subscribe(res => {
      //       this.followUp.changeInfo(res);
      //     });
      //   },
      // },
      // nombre: {
      //   title: 'Name'
      // },
      // descripcion: {
      //   title: 'Alarm',
      //   // valuePrepareFunction: (time) => {
      //   //   return this.convertTime(time);
      //   // },
      //   sortDirection: 'asc'

      // },
      // estado: {
      //   title: 'Estado/Aux'
      // },
      // tiempoad: {
      //   title: 'Ex/InAd',
      //   valuePrepareFunction: (time) => {
      //     return this.convertTime(time);
      //   },
      // },
      // idccms: {
      //   title: 'Idccms'
      // }
      Nombre: {
        title: 'Lob'
      },
      consolidadoAHT: {
        title: 'AHT',
        valuePrepareFunction: (aht) => {
          return Math.floor(aht);
        },
        sortDirection: 'desc'
      },
      consolidadoABN: {
        title: 'ABN'
      },
      consolidadoACD: {
        title: 'ACD'
      },
      consolidadoQueue: {
        title: 'Queue'
      },
      consolidadoNds: {
        title: 'NDS',
        valuePrepareFunction: (nds) => {
          return '%' + nds;
        },
      }
    }
  };

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);
    // this.subSearch = this.observer.viewSearch().subscribe(res => {
    //   this.onSearch(res);
    // });
  }


  realodInfo(info: KpiConsolidated[]) {
    console.log(info, 'Informaciónnnnnnnnnnnnnnnnnn KPIS');


    if (info.length !== 0) {
      const x = new LocalDataSource(this.filterKpiConsolidated(info));
      this.source = x;
      if (this.filtroQuery) {
        this.applyFilter();
      }
      ///////////// Detectar cambios
      this.detectChanges();
    };

    console.log(info, 'descarga RTMMMMMMMMMMMMMMMMMMMMMMMMMM');
  }


  // refresh() {
  //   setTimeout(() => {
  //     this.detection.detectChanges();
  //   }, 1000);
  // }

  // initCache(name) {
  //   // const x = this.observer.cacheInfo(name);
  //   // console.log('Información cacheada, verificarrrrrrrrrrrrrrrrrrrrrrrrr', x);
  //   // this.realodInfo(x);
  //   const x = (this.observer.cacheInfo(name));
  //   if (x) {
  //     this.source = new LocalDataSource(this.filterKpiConsolidated(x));
  //     if (this.filtroQuery) {
  //       this.applyFilter();
  //     }
  //     ///////////// Detectar cambios
  //     this.detection.detectChanges();
  //     setTimeout(() => {
  //       this.detection.detectChanges();
  //       console.log('Debería cambiar el cache');
  //     }, 1000);
  //   } else {
  //     console.log('Sin caché');
  //   }
  // }

  // onSearch(query) {
  //   if (typeof query === 'boolean') {
  //     this.filtroQuery = undefined;
  //     this.source.setFilter([]);
  //   } else {
  //     this.filtroQuery = query;
  //     this.applyFilter();
  //   }
  //   setTimeout(() => {
  //     this.detection.detectChanges();
  //   }, 1000);
  // }

  applyFilter() {

    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'nombre',
        search: this.filtroQuery
      },
      {
        field: 'descripcion',
        search: this.filtroQuery
      },
      {
        field: 'estado',
        search: this.filtroQuery
      },
      {
        field: 'idccms',
        search: this.filtroQuery
      }
    ], false);
  }

  onCustom(event) {
    console.log(event, 'Un evento se ha generado');
  }


  Destroy() {
    if (this.subSearch) { this.subSearch.unsubscribe(); }
  }
}

export abstract class AgentGroupAbs extends GeneralABS {
  @ViewChild(FollowUpPopoverComponent, { static: true, read: FollowUpPopoverComponent }) followUp: FollowUpPopoverComponent;
  source: LocalDataSource;
  subSearch: Subscription;
  filtroQuery: any;
  public settings = {
    mode: 'external',
    hideSubHeader: true,
    sort: true,
    attr: {
      class: 'agentsList',
    },
    pager: {
      display: true,
      perPage: 1000
    },

    actions: {
      position: 'left',
      edit: false,
      delete: false,
      add: false,
    },

    columns: {
      // alarm: {
      //   title: '',
      //   type: 'custom',
      //   renderComponent: IconTableComponent,
      //   onComponentInitFunction: (instance) => {
      //     instance.openFollow.subscribe(res => {
      //       this.followUp.changeInfo(res);
      //     });
      //   },
      // },
      // nombre: {
      //   title: 'Name'
      // },
      // descripcion: {
      //   title: 'Alarm',
      //   // valuePrepareFunction: (time) => {
      //   //   return this.convertTime(time);
      //   // },
      //   sortDirection: 'asc'

      // },
      // estado: {
      //   title: 'Estado/Aux'
      // },
      // tiempoad: {
      //   title: 'Ex/InAd',
      //   valuePrepareFunction: (time) => {
      //     return this.convertTime(time);
      //   },
      // },
      // idccms: {
      //   title: 'Idccms'
      // }

      Group: {
        title: 'Lob'
      },
      acd: {
        title: 'ACD',
        // valuePrepareFunction: (aht) => {
        //   return Math.floor(aht);
        // },
        sortDirection: 'desc'
      },
      aux: {
        title: 'AUX'
      },
      avail: {
        title: 'AVAIL'
      },
      other: {
        title: 'OTHER'
      },
      acw: {
        title: 'ACW',
        // valuePrepareFunction: (nds) => {
        //   return '%' + nds;
        // },
      }
    }
  };

  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public ngZone: NgZone) {
    super(observer, ngZone, detection);
    // this.subSearch = this.observer.viewSearch().subscribe(res => {
    //   this.onSearch(res);
    // });
  }


  realodInfo(info: AgentGroup[]) {
    console.log(info, 'Informaciónnnnnnnnnnnnnnnnnn KPIS');


    if (info.length !== 0) {
      const x = new LocalDataSource(this.filterAgentGroup(info));
      this.source = x;
      if (this.filtroQuery) {
        this.applyFilter();
      }
      ///////////// Detectar cambios
  this.detectChanges();
    };

    console.log(info, 'descarga RTMMMMMMMMMMMMMMMMMMMMMMMMMM');
  }



  // refresh() {
  //   setTimeout(() => {
  //     this.detection.detectChanges();
  //   }, 1000);
  // }

  // initCache(name) {
  //   // const x = this.observer.cacheInfo(name);
  //   // console.log('Información cacheada, verificarrrrrrrrrrrrrrrrrrrrrrrrr', x);
  //   // this.realodInfo(x);
  //   const x = (this.observer.cacheInfo(name));
  //   if (x) {
  //     this.source = new LocalDataSource(this.filterAgentGroup(x));
  //     if (this.filtroQuery) {
  //       this.applyFilter();
  //     }
  //     ///////////// Detectar cambios
  //     this.detection.detectChanges();
  //     setTimeout(() => {
  //       this.detection.detectChanges();
  //       console.log('Debería cambiar el cache');
  //     }, 1000);
  //   } else {
  //     console.log('Sin caché');
  //   }
  // }

  // onSearch(query) {
  //   if (typeof query === 'boolean') {
  //     this.filtroQuery = undefined;
  //     this.source.setFilter([]);
  //   } else {
  //     this.filtroQuery = query;
  //     this.applyFilter();
  //   }
  //   setTimeout(() => {
  //     this.detection.detectChanges();
  //   }, 1000);
  // }

  applyFilter() {

    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'nombre',
        search: this.filtroQuery
      },
      {
        field: 'descripcion',
        search: this.filtroQuery
      },
      {
        field: 'estado',
        search: this.filtroQuery
      },
      {
        field: 'idccms',
        search: this.filtroQuery
      }
    ], false);
  }

  onCustom(event) {
    console.log(event, 'Un evento se ha generado');
  }


  Destroy() {
    if (this.subSearch) { this.subSearch.unsubscribe(); }
  }
}

export abstract class RtmPieAbs extends GeneralABS {
  options: any = {};
  subs: Subscription[] = [];
  subTheme: Subscription;
  constructor(public observer: ObserverService, public detection: ChangeDetectorRef, public theme: NbThemeService, public ngZone: NgZone) {
    super(observer, ngZone, detection);
    this.subs.push(this.observer.viewResize().subscribe(index => {
      if (index === this.indexABS) {
        this.detectChanges();
      }
    }));
  }


  realodInfo(info: RTMlist[]) {
    if (info.length !== 0) {

      this.ngZone.runOutsideAngular(() => {
        const filterNull = info.filter(data => { return data.descripcion !== '' });
        const titles = filterNull.map(data => data.descripcion);
        const legend = [...new Set(titles)].sort(this.AcsTitles);
        const data = [{ value: 0, name: '' }];
        legend.forEach(l => {
          data.push({ name: l, value: filterNull.filter(d => d.descripcion === l).length });
        })
        this.pie(legend, data);

      });
    }
  }

  // public detectChanges() {
  //   this.detection.detectChanges();
  //   setTimeout(() => {
  //     this.detection.detectChanges();
  //   }, 100);
  // }

  // refresh() {
  //   setTimeout(() => {
  //     this.detection.detectChanges();
  //   }, 1000);
  // }

  // initCache(name) {
  //   // const x = this.observer.cacheInfo(name);
  //   // console.log('Información cacheada, verificarrrrrrrrrrrrrrrrrrrrrrrrr', x);
  //   // this.realodInfo(x);
  //   const x = (this.observer.cacheInfo(name));
  //   if (x) {
  //     // this.source = new LocalDataSource(x); ///////// Pendiente verificar
  //     this.realodInfo(x);

  //     ///////////// Detectar cambios
  //     this.detection.detectChanges();
  //     setTimeout(() => {
  //       this.detection.detectChanges();
  //       console.log('Debería cambiar el cache');
  //     }, 1000);
  //   } else {
  //     console.log('Sin caché');
  //   }
  // }

  pie(legend: string[], data) {
    if (this.subTheme) {this.subTheme.unsubscribe(); };
   this.subTheme = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        // toolbox: {
        //   show: true,
        //   showTitle: true,
        //   orient: 'horizontal',

        // },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legend, //['USA', 'Germany', 'France', 'Canada', 'Russia'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Alamrs',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: data,
            // [
            //   { value: 335, name: 'Germany' },
            //   { value: 310, name: 'France' },
            //   { value: 234, name: 'Canada' },
            //   { value: 135, name: 'Russia' },
            //   { value: 1548, name: 'USA' },
            // ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              position: 'inside',
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
      this.detectChanges();
    });

    this.detectChanges();
    // setTimeout(() => {
    //   this.detection.detectChanges();
    //   console.log('Debería cambiar');
    // }, 1000);


  }


  onCustom(event) {
    console.log(event, 'Un evento se ha generado');
  }


  Destroy() {
    if (this.subTheme) {this.subTheme.unsubscribe(); };
    this.subs.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })
  }
}