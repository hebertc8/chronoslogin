import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Subscription, interval, from } from 'rxjs';
import { take } from 'rxjs/operators';
import { ObserverService } from 'src/app/services/observer.service';
import { InfoCentralDashboard, ApiRestComponent, ApiBody, Centrales, Central, Dashboard, DashboardSelected, Template } from 'src/app/services/interfaces';
import { RequestsService } from 'src/app/services/requests.service';
import { NbPopoverDirective, NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogConfirmationComponent } from 'src/app/general-components/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-central',
  templateUrl: './central.component.html',
  styleUrls: ['./central.component.scss']
})
export class CentralComponent implements OnInit, OnDestroy {
  @ViewChild('bodyCard', { read: ElementRef, static: true }) containerScroll: ElementRef;
  @ViewChild('cardDashboard', { read: ElementRef, static: true }) dashScroll: ElementRef;
  @ViewChildren(NbPopoverDirective, { read: NbPopoverDirective }) popover: QueryList<NbPopoverDirective>;
  @Output() openClose = new EventEmitter();
  public central: Central[] = [];
  protected name = 'Centrales';
  public centrales: Central[] = [];
  public subscriptionInjectItem: Subscription;
  public subscriptionReload: Subscription;
  public subsGetInfo: Subscription;
  public subsMainCentral: Subscription;
  private subGetTemplate: Subscription;
  private ApiRest: ApiRestComponent;
  public dash: Dashboard[] = [];
  public countTry = 0;
  private nameCentral: string;
  public AcsType = (a, b) => {
    if (a.typeDashboard < b.typeDashboard) {
      return 1;
    }
    if (a.typeDashboard > b.typeDashboard) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }
  public orderCentrals = (a, b) => {
    if (a.NameCentral > b.NameCentral) {
      return 1;
    }
    if (a.NameCentral < b.NameCentral) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

  constructor(
    private observer: ObserverService,
    private request: RequestsService,
    private dialog: NbDialogService,
    private toastr: NbToastrService,
  ) {
    this.subscriptionReload = this.observer.viewReloadCentrals().subscribe(res => {
      setTimeout(() => {
        this.getInfo();
      }, 1000);
    });

  }

  ngOnInit(): void {
    this.getInfo();


    // Invertir Scroll
    const item = this.containerScroll.nativeElement as HTMLElement;
    // tslint:disable-next-line: only-arrow-functions
    item.addEventListener('wheel', (e) => {

      if (e.deltaY > 0) { item.scrollLeft += 100; }
      else if (e.deltaY < 0) { item.scrollLeft -= 100; }
      // else { item.scrollLeft -= 100; }
    });




    // // Invertir Scroll
    // const item2 = this.dashScroll.nativeElement as HTMLElement;
    // // tslint:disable-next-line: only-arrow-functions
    // window.addEventListener('wheel', (e) => {

    //   if (e.deltaX > 0) { item.scrollLeft += 100; }
    //   else { item.scrollLeft -= 100; }
    // });

  }

  getInfo() {
    if (this.countTry < 3) {
      this.countTry++;
      if (this.subsGetInfo) { this.subsGetInfo.unsubscribe(); }
      this.ApiRest = this.observer.viewApiRest(this.name);
      if (this.ApiRest) {
        const apiBody: ApiBody = {
          source: this.ApiRest.source,
        };
        this.subsGetInfo = this.request.ApiGeneral(apiBody).subscribe((res: Centrales) => {
          if (res.Data) {

            this.central = res.Data[0].ActiveCentrals.sort(this.orderCentrals);
            this.renderCentral();
          }
          this.subsGetInfo.unsubscribe();
        }, err => {
          this.toastr.warning(err, 'Trying againg...');
          setTimeout(() => {
            this.getInfo();
          }, 10000);
          this.subsGetInfo.unsubscribe();
        });
      }
    }

  }

  renderCentral() {
    const length = this.central.length;

    if (length !== 0) {
      this.centrales = [];
      let count = 0;
      this.subscriptionInjectItem = interval(200).pipe(
        take((length)),

      ).subscribe(time => {
        this.centrales.push(this.central[count]);
        count++;
        if (count === (length)) {
          this.subscriptionInjectItem.unsubscribe();
        }
      });
    }
  }

  centralClicked(das: Dashboard[], nameCentral, main) {
    this.dash = das.sort();
    this.dash.forEach(da => {
      da.main = main;
    });
    this.nameCentral = nameCentral;
  }

  updateDashboard(x: Dashboard) {
    x.Central = this.nameCentral;
    const info: DashboardSelected = { dash: x, listDash: this.dash };
    this.openClose.emit(false);
    this.observer.setCentral(info, 0);
    this.popover.forEach(pop => {
      pop.hide();
    });

  }

  mainCentral(NameCentral, das: Dashboard[]) {
    const dialog = this.dialog.open(DialogConfirmationComponent,
      {
        closeOnBackdropClick: false, closeOnEsc: false, autoFocus: false,
        context: { message: 'Change default central to: ' + NameCentral + '. ' }
      })
      .onClose.subscribe(resp => {

        if (resp) {
          if (this.ApiRest) {
            const apiBody: ApiBody = {
              source: this.ApiRest.subItems[0].source,
              body: { central: NameCentral }
            };
            this.subsMainCentral = this.request.ApiGeneral(apiBody).subscribe(res => {
              this.getInfo();
              this.observer.setMainCentralTab(NameCentral);
              this.chanteTemplateStorage(das, NameCentral);
              this.toastr.success('Change to ' + NameCentral + ' ' + res[0].Result, 'Main Central');
              this.subsMainCentral.unsubscribe();
            }, err => {
              this.subsMainCentral.unsubscribe();
              this.toastr.warning(err);
            });
          }
        }

      });
  }

  chanteTemplateStorage(das: Dashboard[], NameCentral: string) {
    if (this.subGetTemplate) { this.subGetTemplate.unsubscribe(); }
    const temp = das.find(data => data.typeDashboard === 1);
    if (temp) {
      if (this.ApiRest) {
        const apiBody: ApiBody = {
          source: this.ApiRest.subItems[1].source,
          body: { idDash: temp.idDashboard }
        };
        this.subGetTemplate = this.request.ApiGeneral(apiBody).subscribe((res: Template[]) => {
          this.request.changeTemplate(res[0].Template, temp.idDashboard, NameCentral);
          this.subGetTemplate.unsubscribe();
        });
      }
    }
  }


  ngOnDestroy() {
    if (this.subscriptionInjectItem) { this.subscriptionInjectItem.unsubscribe(); }
    if (this.subsGetInfo) { this.subsGetInfo.unsubscribe(); }
    if (this.subscriptionReload) { this.subscriptionReload.unsubscribe(); }
    if (this.subsMainCentral) { this.subsMainCentral.unsubscribe(); }
    if (this.subGetTemplate) { this.subGetTemplate.unsubscribe(); }
  }

}


