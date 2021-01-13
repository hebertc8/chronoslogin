import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { compactTypes } from 'angular-gridster2/lib/gridsterConfig.interface';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { RightClickComponent } from './accessories/right-click/right-click.component';
import { ObserverService } from 'src/app/services/observer.service';
import { NbWindowService, NbToastrService } from '@nebular/theme';
import { FollowUpComponent } from './accessories/follow-up/follow-up.component';
import { ListComponents, Remove, InfoCentralDashboard, DashboardSelected, ApiRestComponent, ApiBody, Template } from 'src/app/services/interfaces';
import { RequestsService } from 'src/app/services/requests.service';

let undoAll: Array<any> = [];



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(RightClickComponent, { read: ElementRef }) rightClick: ElementRef;

  protected name = 'Dashboard';
  private ApiRest: ApiRestComponent;
  public distanceBettwen = 3;
  RightClick = { left: 0, top: 0, opacity: 0, display: 'none' };
  searchConfigShow = { status: 0, display: 'none', animation: '' };
  selectSearchConfig = undefined;
  positionSearch = { x: 0, y: 0 };
  public configObject = new Object();
  public showButtonFollow = true;

  public variablesComponent = {
    x: 0,
    y: 0,
    cols: 1,
    rows: 1,
    component: null,
    maxItemCols: undefined,
    maxItemRows: undefined,
    minItemCols: undefined,
    minItemRows: undefined,
    filter: undefined
  };
  public countTry = 0;
  public showTabs = false;
  public subscriptionInjectItem: Subscription;
  public subChangeCentral: Subscription;
  public subGetTemplate: Subscription;
  public subSave: Subscription;
  public loadingDashboard = true;
  public compact: compactTypes[] = ['none', 'compactUp'];
  public changeOrder = 0;
  public positionRightClick = { x: 0, y: 0 };
  public countChanges = 0;
  public widthRightClick = 412;
  public infoCentral: InfoCentralDashboard;

  public options: GridsterConfig = {
    pushItems: true,
    swap: false,
    gridType: 'verticalFixed',
    displayGrid: 'onDrag&Resize',
    floating: false,
    margin: this.distanceBettwen,
    disablePushOnDrag: false,
    disableScrollHorizontal: true,
    outerMarginTop: null,
    outerMarginRight: null,
    outerMarginBottom: null,
    outerMarginLeft: null,
    useTransformPositioning: false,
    mobileBreakpoint: 640,
    maxCols: 30,
    minCols: 30,

    // compactType: this.compact[this.changeOrder],

    draggable: { enabled: true, ignoreContent: true, dragHandleClass: 'headerFactory' },
    resizable: { enabled: true },


    // fixedColWidth: 40.5,
    fixedRowHeight: 25.5,
    keepFixedHeightInMobile: false,
    keepFixedWidthInMobile: false,
    // enableEmptyCellClick: true,
    enableEmptyCellContextMenu: true,
    // emptyCellClickCallback: this.addPuesto.bind(this),
    emptyCellContextMenuCallback: this.addPuesto.bind(this),

    enableEmptyCellDrag: true,
    emptyCellDragCallback: this.addPuesto.bind(this),
    // emptyCellDropCallback: this.addPuesto.bind(this),
    // emptyCellDragCallback: this.addPuesto.bind(this)
    // maxCols: 30,
    itemChangeCallback: this.itemChange.bind(this),
    itemResizeCallback: this.itemResize.bind(this),
  };
  dashboard: Array<any>;
  dashboardUndoAll: Array<any>;


  constructor(
    private observer: ObserverService,
    private window: NbWindowService,
    private gloablVariables: GlobalVariablesService,
    private user: RequestsService,
    private request: RequestsService,
    private toastr: NbToastrService
  ) {

    this.subChangeCentral = this.observer.obsCurrentCentral().subscribe((res: { info: DashboardSelected, tipo: number }) => {
      // this.initDashboard();
      this.reloadChangeDashboard(res);
    });

    this.subSave = this.observer.viewSave().subscribe(res => {
      this.UpdateTemplate();
    });
  }

  ngOnInit() {
    this.initCentral();
  }

  initCentral(info?) {
    this.infoCentral = this.user.userInfo.data[0];
    this.infoCentral.tipo = 1;
    this.infoCentral.main = 'si';
    this.observer.setCurrentCentral(this.infoCentral.Central);
    this.observer.confirmChangeCentral(this.infoCentral.Central);
    this.initDashboard(this.user.userInfo.data[0].template);
    this.showTabs = true;
  }

  initDashboard(template) {
    this.loadingDashboard = true;
    let items = [];
    if (template) {
      items = JSON.parse(template);
      this.loadingDashboard = false;
    } else {
      items = [
        { cols: 4, rows: 4, y: 0, x: 0, component: 'Agent List' },
        // { cols: 2, rows: 2, y: 0, x: 2, component: 'Test2' },
        // { cols: 2, rows: 2, y: 0, x: 4, component: 'Test2' },
        // { cols: 2, rows: 2, y: 0, x: 6, component: 'Test2' },
        // { cols: 2, rows: 2, y: 0, x: 8, component: 'Test2' },
        // { cols: 2, rows: 2, y: 0, x: 10, component: 'Test2' },
        // { cols: 2, rows: 2, y: 3, x: 2, component: 'Test2' },
        // { cols: 2, rows: 2, y: 5, x: 2, component: 'Test2' },
        // { cols: 2, rows: 2, y: 7, x: 2, component: 'Test2' },
        // { cols: 2, rows: 2, y: 7, x: 4, component: 'Test2' },
        // { cols: 2, rows: 2, y: 7, x: 6, component: 'Test2' },
        // { cols: 2, rows: 2, y: 7, x: 8, component: 'Test2' },
        // { cols: 2, rows: 2, y: 10, x: 2, component: 'Test2' },
        // { cols: 2, rows: 2, y: 13, x: 2, component: 'Test2' },
        // { cols: 2, rows: 2, y: 13, x: 6, component: 'Kpi In' },
      ];
    }

    this.dashboard = [];

    const length = items.length;
    let count = 0;
    this.subscriptionInjectItem = interval(200).pipe(
      take((length)),

      // tslint:disable-next-line: no-shadowed-variable
    ).subscribe(time => {

      // info['matches'][count].picture = './assets/images/userDefault.svg';
      // await this.post.getPicture( info['matches'][count].idccms).then(res => {
      //      info['matches'][count].picture = 'data:image/png;base64,' + res['result'][0].picture;
      this.dashboard.push(items[count]);

      // });
      count++;
      if (count === (length)) {
        this.subscriptionInjectItem.unsubscribe();
        this.loadingDashboard = false;
        undoAll = this.dashboard.map(widget => ({ ...widget }));
        this.UpdateTemplate();
      }
    });
  }

  reloadChangeDashboard(central: { info: DashboardSelected, tipo: number }) {
    // if (this.countTry < 4) {

      if (this.subGetTemplate) { this.subGetTemplate.unsubscribe(); }
      // this.countTry++;
      this.loadingDashboard = true;
      const temp = central;
      this.ApiRest = this.observer.viewApiRest(this.name);
      if (this.ApiRest) {
        const apiBody: ApiBody = {
          source: this.ApiRest.subItems[0].source,
          body: { idDash: central.info.dash.idDashboard }
        };
        this.subGetTemplate = this.request.ApiGeneral(apiBody).subscribe((res: Template[]) => {
          this.infoCentral = {
            Central: central.info.dash.Central,
            NameDashboard: central.info.dash.nameDashboard,
            idcentral: central.info.dash.idCentral,
            iddash: central.info.dash.idDashboard,
            tipo: central.info.dash.typeDashboard,
            main: central.info.dash.main
          };
          this.observer.confirmChangeCentral(central.info.dash.Central);
          this.initDashboard(res[0].Template);
          this.subGetTemplate.unsubscribe();
        }, err => {
          this.toastr.warning(err, 'Trying again template...');
          this.loadingDashboard = false;
          setTimeout(() => {
            // this.reloadChangeDashboard(temp);
          }, 3000);
          this.subGetTemplate.unsubscribe();
        });
      }
    // }
  }

  ngAfterViewInit() {


  }

  itemChange(item, itemComponent) {
    // console.info('itemChanged', item, itemComponent);
    // this.UpdateTemplate();
  }

  itemResize(item, itemComponent) {

    const isLargeNumber = (element) => element === item;
    const index = this.dashboard.findIndex(isLargeNumber);
    this.observer.setResize(index);
    // this.UpdateTemplate();
    // console.log('itemResized', item, itemComponent, index);
  }
  UpdateTemplate() {
    const temp = JSON.stringify(this.dashboard);
    this.observer.setTemplate(temp);
  }


  undo() {
    console.log('Undooooooooo', this.dashboard, undoAll);
    this.dashboard = [];
    setTimeout(() => {
      this.dashboard = undoAll.map(widget => ({ ...widget })); // .map(item => ({...item})));
    }, 200);
    // this.changedOptions();
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(ob: Remove) {

    this.dashboard.splice(ob.index, 1);
    this.changedOptions();

    let find = false;
    let item;

    for (const componente of this.dashboard) {
      item = this.gloablVariables.viewComponents.find(comp => comp.nameToShow === componente.component);
      if (item && item.name === ob.source) {
        find = true;
        break;
      }
    }
    if (!find) {
      console.log('Se va a detener');
      this.observer.stopRequest(ob.source);
    } else {
      console.log('Aún lo usan');
    }
  }


  addPuesto(event: MouseEvent, item: GridsterItem) {

    if (item.cols !== 1 && item.rows !== 1) {


      this.positionRightClick = {
        x: 0,
        y: 0
      };
      const x = event.clientX > 1250 ? event.clientX - this.widthRightClick : event.clientX;
      const y = event.clientY > 800 ? event.clientY - 150 : event.clientY;

      console.log(event.clientX, event.clientY, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddddddddd');

      // this.componentFactory(RightClickComponent, this.SelectComponent);
      this.RightClick = { left: x, top: y, opacity: 1, display: 'flex' };

      // setTimeout(() => {
      //   this.RightClick.opacity = 0;
      // }, 3000);
      this.variablesComponent = {
        x: item.x,
        y: item.y,
        cols: item.cols,
        rows: item.rows,
        component: null,
        maxItemCols: undefined,
        maxItemRows: undefined,
        minItemCols: undefined,
        minItemRows: undefined,
        filter: undefined
      };

      setTimeout(() => {

        const t = this.rightClick.nativeElement as HTMLElement;
        this.widthRightClick = this.rightClick.nativeElement.clientWidth;
        // console.log(this.widthRightClick);
      }, 1000);

      // this.dashboard.push({id: 0, idzona: 0, x: item.x, y: item.y, cols: 1, rows: 1, dragEnabled: true});
    }
  }


  createComponent(component: ListComponents) {

    this.RightClick.top = -250;


    setTimeout(() => {
      this.RightClick.display = 'none';
    }, 800);

    if (component.enabledCreate) {

      const options = component.optionGrid;

      this.variablesComponent.component = component.nameToShow;
      this.variablesComponent.minItemRows = options.minItemRows,
        this.variablesComponent.minItemCols = options.minItemCols,
        this.variablesComponent.maxItemCols = options.maxItemCols,
        this.variablesComponent.maxItemRows = options.maxItemRows,


        // tslint:disable-next-line: max-line-length
        this.variablesComponent.rows = this.variablesComponent.rows <= options.minItemRows ? options.minItemRows : (this.variablesComponent.rows >= options.maxItemRows ? options.maxItemRows : this.variablesComponent.rows);
      // tslint:disable-next-line: max-line-length
      this.variablesComponent.cols = this.variablesComponent.cols <= options.minItemCols ? options.minItemCols : (this.variablesComponent.cols >= options.maxItemCols ? options.maxItemCols : this.variablesComponent.cols);


      this.variablesComponent.filter = component.filter;
      // this.variablesComponent.cols = this.variablesComponent.rows = 1;

      // console.log(this.variablesComponent, 'aquiiiiii')
      // tslint:disable-next-line: max-line-length
      this.dashboard.push(this.variablesComponent);
    }
  }


  ngOnDestroy() {
    if (this.subscriptionInjectItem) { this.subscriptionInjectItem.unsubscribe(); }
    this.observer.stopSocketAll();
    if (this.subChangeCentral) { this.subChangeCentral.unsubscribe(); }
    if (this.subSave) { this.subSave.unsubscribe(); }
    if (this.subGetTemplate) { this.subGetTemplate.unsubscribe(); }
  }

  setConfig(n) {

    console.log(n, 'Emitido');

    switch (n) {
      case 1:
        this.organize();
        break;
      case 2:
        this.undo();
        break;
      case 3:
        this.cleanDashboard();
        break;

      default:
        break;
    }

  }
  changeOrderFunction(n) {
    this.options.compactType = this.compact[n];
    this.changedOptions();
  }

  organize() {
    this.changeOrderFunction(1);
    setTimeout(() => {
      this.changeOrderFunction(0);
    }, 800);
  }

  cleanDashboard() {
    this.dashboard = [];
    this.observer.stopSocketAll();
  }


  openFollowUp() {
    this.showButtonFollow = false;
    const windowsRef = this.window.open(FollowUpComponent, { title: 'Follow Up Agents', closeOnBackdropClick: false, closeOnEsc: false });
    windowsRef.onClose.subscribe(res => {
      this.showButtonFollow = true;
    });
  }

  openSearchConfig(tipo) {
    this.selectSearchConfig = tipo;
    this.searchConfigShow.status = 1;
    this.searchConfigShow.animation = ',all .3s';
    this.positionSearch = { x: 0, y: 0 };
    setTimeout(() => {
      this.searchConfigShow.animation = '';
    }, 200);
    this.searchConfigShow.display = 'unset';
  }

  closeSearchConfig() {
    this.searchConfigShow.status = 0;
    setTimeout(() => {
      this.searchConfigShow.display = 'none';
      this.positionSearch = { x: 0, y: 0 };
    }, 400);
  }
}

