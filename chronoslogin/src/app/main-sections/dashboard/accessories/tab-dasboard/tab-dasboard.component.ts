import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogConfirmationComponent } from 'src/app/general-components/dialog-confirmation/dialog-confirmation.component';
import { ObserverService } from 'src/app/services/observer.service';
import { Subscription } from 'rxjs';
import { InfoCentralDashboard, ApiRestComponent, ApiBody, UserInfoHeader, DashboardSelected } from 'src/app/services/interfaces';
import { elementAt } from 'rxjs/operators';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-tab-dasboard',
  templateUrl: './tab-dasboard.component.html',
  styleUrls: ['./tab-dasboard.component.scss']
})
export class TabDasboardComponent implements OnInit, OnDestroy {
  @ViewChild('containerRel', { read: ElementRef, static: true }) containerRel: ElementRef;
  @Input() infoCentral: InfoCentralDashboard;
  @Output() searchConfig = new EventEmitter();
  protected name = 'Tabs';
  private ApiRest: ApiRestComponent;
  private dashSelected: InfoCentralDashboard;
  private dashSelectedTemp: InfoCentralDashboard;
  private userInfo: UserInfoHeader;
  public subsRequestSave: Subscription;
  public subsRequestDelete: Subscription;
  public subsRequestAdd: Subscription;
  public tempDashboards: DashboardSelected;
  public classAdd = 'hide';
  public nameNewDashboard = '';
  private osbChangeMain: Subscription;

  public loadTabs = false;

  dashboards: InfoCentralDashboard[] = [];

  indexSelected = 0;
  indexSelectedTemp = 0;
  screen = false;

  public validateFirstChange = false;


  //////// Subscriptions//////////
  public subCurrentCentral: Subscription;
  public subCurrentScreen: Subscription;
  public subChangeDashboard: Subscription;

  //////// Subscriptions//////////

  public styles = {
    // position: 'fixed',
    // left: undefined,
  };


  constructor(
    private dialog: NbDialogService,
    private observer: ObserverService,
    private request: RequestsService,
    private toastr: NbToastrService,
    private detection: ChangeDetectorRef
  ) {

    this.subChangeDashboard = this.observer.viweLogoCentral().subscribe(res => {
      // this.dashSelected = this.dashSelectedTemp;
      // this.indexSelected = this.indexSelectedTemp;
if (!this.validateFirstChange) {

  this.validateFirstChange = true;
} else {
  if (this.indexSelectedTemp !== this.indexSelected) {
    this.indexSelected = this.indexSelectedTemp;
  }
}
      this.loadTab(false);
    });




    // Observar cambio de Central
    this.subCurrentCentral = this.observer.obsCurrentCentral().subscribe((info: { info: DashboardSelected, tipo: number }) => {

      console.log(info, true, 'info central actual')
      if (info.tipo !== 1) {
        this.resetAdd();
        this.tempDashboards = info.info;
        this.infoCentral = {
          Central: info.info.dash.Central,
          NameDashboard: info.info.dash.nameDashboard,
          idcentral: info.info.dash.idCentral,
          iddash: info.info.dash.idDashboard,
          tipo: info.info.dash.typeDashboard,
          main: info.info.dash.main
        };
        this.dashSelected = this.infoCentral;
        this.dashboards = [];
        info.info.listDash.forEach(das => {
          this.dashboards.push({
            Central: das.idCentral.toString(),
            NameDashboard: das.nameDashboard,
            idcentral: das.idCentral,
            iddash: das.idDashboard,
            tipo: das.typeDashboard
          });
        });

        this.indexSelected = this.dashboards.findIndex(das => das.iddash === this.infoCentral.iddash);
        console.log(this.dashSelected, 'Verificar dashSelectssssssssssssssssssssssss', this.dashboards, this.indexSelected);
      }

      // const temporal = this.infoCentral;
      // temporal.NameDashboard = temporal.NameDashboard + 'gll';
      // this.dashboards.unshift(temporal);
      // this.indexSelected++;
      // console.log(this.dashboards, 'sdsdsdsds', this.indexSelected);
    });
    this.osbChangeMain = this.observer.viewMainCentralTab().subscribe(res => {
      if (this.infoCentral.Central === res && this.infoCentral.tipo === 1) {
        this.infoCentral.main = 'si';
      } else if (this.infoCentral.tipo === 1) {
        this.infoCentral.main = 'no';
      }
    });

   
  }

  ngOnInit(): void {
    this.getInfo();
    this.userInfo = this.request.userInfo.data[0];
    //////////////////// Test mientras se define funcionamiento de dashboard
    this.dashSelected = this.infoCentral;
    this.tempDashboards =
    {
      dash: {
        idCentral: this.infoCentral.idcentral,
        idDashboard: this.infoCentral.iddash,
        nameDashboard: this.infoCentral.NameDashboard,
        typeDashboard: this.infoCentral.tipo,
        Central: this.infoCentral.Central,
        main: this.infoCentral.main
      },
      listDash: []
    };
    this.dashboards.push(this.dashSelected);
    //////////////

    this.screen = this.observer.Sreen;
    // Observar cambio a fullScreen
    this.subCurrentScreen = this.observer.obsSreen().subscribe(screen => {
      this.screen = screen;
    });


    // Invertir Scroll
    const item = this.containerRel.nativeElement as HTMLElement;
    // tslint:disable-next-line: only-arrow-functions
    item.addEventListener('wheel', (e) => {

      if (e.deltaY > 0) { item.scrollLeft += 100; }
      else { item.scrollLeft -= 100; }
    });

  }



  getInfo() {
    this.ApiRest = this.observer.viewApiRest(this.name);
  }

  delete(name, id) {
    // Abrir Modal estandar para confirmar acción de eliminar dashboard
    const dialog = this.dialog.open(DialogConfirmationComponent,
      {
        closeOnBackdropClick: false, closeOnEsc: false, autoFocus: false,
        context: { message: 'Delete dashboard: ' + name + '. ' }
      })
      .onClose.subscribe(resp => {

        if (resp) {
          if (this.ApiRest) {
            this.observer.setSave();
            const apiBody: ApiBody = {
              source: this.ApiRest.subItems[0].source,
              body: {
                case: 3,
                idDash: id,
                user: this.userInfo.ccmsuser,
              }
            };
            this.subsRequestDelete = this.request.ApiGeneral(apiBody).subscribe(res => {
              this.toastr.success(res[0].Result);
              this.observer.setRealodCentrals();
              this.dashboards = this.dashboards.filter(data => data.iddash !== id);
              this.subsRequestDelete.unsubscribe();
            }, err => {
              this.toastr.warning(err, 'Try again.');
              this.subsRequestDelete.unsubscribe();
            });
          }
        }

      });
  }

  fullScreen() {
    this.observer.setScreen();
  }

  loadTab(b) {
    // setTimeout(() => {
    this.loadTabs = b;
    this.detection.detectChanges();
    // }, 4000)
  }

  selectDashboard(e: MouseEvent, dashInfo: InfoCentralDashboard, index: number) {
    this.loadTab(true);
    this.dashSelectedTemp = dashInfo;

    this.tempDashboards.dash = {
      idCentral: this.dashSelectedTemp.idcentral,
      idDashboard: this.dashSelectedTemp.iddash,
      nameDashboard: this.dashSelectedTemp.NameDashboard,
      typeDashboard: this.dashSelectedTemp.tipo,
      Central: this.infoCentral.Central,
    };
    this.changeTemplate();

    this.indexSelectedTemp = index;
    // this.loadTab();



    // this.dashboards.shift();
    // const temporal = this.dashSelected;
    // temporal.NameDashboard = temporal.NameDashboard + 'gll';
    // this.dashboards.unshift(dashInfo);
    // console.log(this.indexSelected, 'seleccionadooooooooooooooooooooo')

    // Animación para seleccionar dashboard
    this.styles = {
      // position: 'fixed',
      // left: e.clientX - 49,
    };

    // setTimeout(() => {
    //   this.styles.left = 0;
    // }, 1000);
  }

  save() {
    // Abrir Modal estandar para confirmar acción de guardar dashboard
    console.error('Verificar aquíiiiiii', this.dashSelected);
    const dialog = this.dialog.open(DialogConfirmationComponent,
      {
        closeOnBackdropClick: false, closeOnEsc: false, autoFocus: false,
        context: { message: 'Save dashboard: ' + this.infoCentral.NameDashboard + '. ' }
      })
      .onClose.subscribe(resp => {
        if (resp) {

          if (this.ApiRest) {
            this.observer.setSave();
            const apiBody: ApiBody = {
              source: this.ApiRest.subItems[0].source,
              body: {
                case: 2,
                idDash: this.tempDashboards.dash.idDashboard,
                user: this.userInfo.ccmsuser,
                template: this.observer.template,
              }
            };
            this.subsRequestSave = this.request.ApiGeneral(apiBody).subscribe(res => {
              this.toastr.success(res[0].Result);
              if (this.infoCentral.main === 'si' && this.infoCentral.tipo === 1) {
                this.request.changeTemplate(this.observer.template, this.infoCentral.iddash, this.infoCentral.Central);
              }
              this.subsRequestSave.unsubscribe();
            }, err => {
              this.toastr.warning(err, 'Try again.');
              this.subsRequestSave.unsubscribe();
            });
          }
        }

      });
  }

  add() {
    // Abrir Modal estandar para confirmar acción de eliminar dashboard
    const dialog = this.dialog.open(DialogConfirmationComponent,
      {
        closeOnBackdropClick: false, closeOnEsc: false, autoFocus: false,
        context: { message: 'Create dashboard: ' + this.nameNewDashboard + '. ' }
      })
      .onClose.subscribe(resp => {

        if (resp) {
          if (this.ApiRest) {
            this.observer.setSave();
            const apiBody: ApiBody = {
              source: this.ApiRest.subItems[0].source,
              body: {
                case: 1,
                central: this.infoCentral.Central,
                name: this.nameNewDashboard,
                user: this.userInfo.ccmsuser,
              }
            };
            this.subsRequestAdd = this.request.ApiGeneral(apiBody).subscribe(res => {
              this.toastr.success('Dashboard ' + this.nameNewDashboard + ' created successfully.', 'Chronos');
              this.observer.setRealodCentrals();
              this.addTabCreate(res);
              this.resetAdd();
              this.subsRequestAdd.unsubscribe();
            }, err => {
              this.toastr.warning(err, 'Try again.');
              this.subsRequestAdd.unsubscribe();
            });
          }
        }

      });
  }
  openSearchConfig(tipo) {
    // Emite para mostrar u ocultar el componente de búsqueda
    this.searchConfig.emit(tipo);

  }

  changeTemplate() {
    this.observer.setCentral(this.tempDashboards, 1);
  }

  showAdd() {
    if (this.classAdd === 'hide') {
      this.classAdd = 'show';
    } else {
      this.add();
    }

  }

  resetAdd() {
    this.nameNewDashboard = '';
    this.classAdd = 'hide';
  }

  addTabCreate(id) {
    const temp: InfoCentralDashboard = {
      Central: this.infoCentral.Central,
      NameDashboard: this.nameNewDashboard,
      idcentral: this.infoCentral.idcentral,
      iddash: id,
      tipo: 0
    };
    this.dashboards.push(temp);
  }


  ngOnDestroy() {
    // Desconectar subscripciones
    if (this.subCurrentCentral) { this.subCurrentCentral.unsubscribe(); }
    if (this.subCurrentScreen) { this.subCurrentScreen.unsubscribe(); }
    if (this.subsRequestSave) { this.subsRequestSave.unsubscribe(); }
    if (this.subsRequestDelete) { this.subsRequestDelete.unsubscribe(); }
    if (this.subsRequestAdd) { this.subsRequestAdd.unsubscribe(); }
    if (this.osbChangeMain) { this.osbChangeMain.unsubscribe(); }
    if (this.subChangeDashboard) { this.subChangeDashboard.unsubscribe(); }
  }

}
