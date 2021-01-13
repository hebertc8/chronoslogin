import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { MainMenuComponent } from './main-menu/main-menu.component';
// import { MenuComponent } from './main-menu/menu/menu.component';
// import { DasboardSettingsComponent } from './main-menu/menu/settings/dasboard-settings/dasboard-settings.component';
// import { VtoOvertimeComponent } from './main-menu/menu/settings/vto-overtime/vto-overtime.component';
// import { MapManagerComponent } from './main-menu/menu/settings/map-manager/map-manager.component';
// import { GridsterModule } from 'angular-gridster2';
// import { DashboardComponent } from './main-sections/dashboard/dashboard.component';
// import { RightClickComponent } from './main-sections/dashboard/accessories/right-click/right-click.component';
// import { ComponentFactoryComponent } from './component-factory/component-factory.component';
import { AgentListComponent } from './main-sections/components/agent-list/agent-list.component';
// import { ConfigComponent } from './main-sections/dashboard/accessories/config/config.component';
// import { HeaderMenuComponent } from './main-menu/header-menu/header-menu.component';
// import { CentralComponent } from './main-sections/dashboard/accessories/central/central.component';
// import { TabDasboardComponent } from './main-sections/dashboard/accessories/tab-dasboard/tab-dasboard.component';
import { DialogConfirmationComponent } from './general-components/dialog-confirmation/dialog-confirmation.component';
// import { ConfigComponentComponent } from './general-components/config-component/config-component.component';
import { ProfileComponent } from './main-sections/profile/profile.component';
import { ClientCentralComponent } from './main-sections/profile/client-central/client-central.component';
import { ManageCentralsComponent } from './main-sections/profile/manage-centrals/manage-centrals.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { SearchAgentComponent } from './main-sections/dashboard/accessories/search-agent/search-agent.component';
import { KpiChartComponent } from './main-sections/components/kpi-chart/kpi-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
// import { MisionBotComponent } from './mision-bot/mision-bot.component';
// import { NebularModule } from './nebular/nebular.module';
import { MisionbotSettingsComponent } from './main-menu/menu/settings/misionbot-settings/misionbot-settings.component';
import { DashboardMisionBotComponent } from './mision-bot/dashboard-mision-bot/dashboard-mision-bot.component';
import { HistoryMisionBotComponent } from './mision-bot/history-mision-bot/history-mision-bot.component';
import { MisionBotConfigComponent } from './mision-bot/mision-bot-config/mision-bot-config.component';
import { AdvisersListComponent } from './mision-bot/mision-bot-config/advisers-list/advisers-list.component';
import { MatrixListComponent } from './mision-bot/mision-bot-config/matrix-list/matrix-list.component';
import { ConfigCreateComponent } from './mision-bot/mision-bot-config/config-create/config-create.component';
import { ActivateComponent } from './mision-bot/dashboard-mision-bot/activate/activate.component';
// import { MainMapManagerComponent } from './main-sections/main-map-manager/main-map-manager.component';
// import { MapComponent } from './main-sections/main-map-manager/map/map.component';
import { ContextMenuMapComponent } from './main-sections/main-map-manager/context-menu-map/context-menu-map.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { KpiIndividualComponent } from './main-sections/components/kpi-individual/kpi-individual.component';
import { MapDashboardComponent } from './main-sections/components/map-dashboard/map-dashboard.component';
import { MapDashbord2Component } from './main-sections/components/map-dashbord2/map-dashbord2.component';
import { MapV3Component } from './main-sections/components/map-v3/map-v3.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { PositionComponent } from './main-sections/components/map-v3/position/position.component';
import { FollowUpComponent } from './main-sections/dashboard/accessories/follow-up/follow-up.component';
import { ConfirmComponent } from './main-sections/dashboard/accessories/follow-up/confirm/confirm.component';
import { StatesMapComponent } from './main-sections/components/states-map/states-map.component';
import { IconTableComponent } from './main-sections/components/agent-list/icon-table/icon-table.component';
import { InterceptorService } from './services/interceptor/interceptor.service';
import { ErrorInterceptor } from './services/interceptor/error-interceptor';
import { FollowUpPopoverComponent } from './main-sections/components/agent-list/follow-up-popover/follow-up-popover.component';
// import { FilterKpisComponent } from './general-components/filter-kpis/filter-kpis.component';
// import { FilterKpisIndComponent } from './general-components/filter-kpis-ind/filter-kpis-ind.component';
import { AgentFilterComponent } from './main-sections/components/agent-filter/agent-filter.component';
// import { FilterAgentFilterComponent } from './general-components/filter-agent-filter/filter-agent-filter.component';
import { ThemeModule } from './nebular/@theme/theme.module';
// import { TpAlertComponent } from './tp-alert/tp-alert.component';
import { ConsolidateAuxComponent } from './main-sections/components/consolidate-aux/consolidate-aux.component';
import { RTMComponent } from './main-sections/components/rtm/rtm.component';
import { KpisConsolidatedComponent } from './main-sections/components/kpis-consolidated/kpis-consolidated.component';
// import { FilterKpiConsolidatedComponent } from './general-components/filter-kpi-consolidated/filter-kpi-consolidated.component';
import { AgentGroupComponent } from './main-sections/components/agent-group/agent-group.component';
import { RtmPieComponent } from './main-sections/components/rtm-pie/rtm-pie.component';
// import { LoadingComponent } from './miscellaneous/loading/loading.component';
import { GeneralModuleModule } from './general-module/general-module.module';
// import { LoginRegisterComponent } from './login-register/login-register.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // MainMenuComponent,
    // MenuComponent,
    // DasboardSettingsComponent,
    // VtoOvertimeComponent,
    // MapManagerComponent,
    // DashboardComponent,
    // RightClickComponent,
    // ComponentFactoryComponent,
    AgentListComponent,
    // ConfigComponent,
    // HeaderMenuComponent,
    // CentralComponent,
    // TabDasboardComponent,
    DialogConfirmationComponent,
    // ConfigComponentComponent,
    ProfileComponent,
    ClientCentralComponent,
    ManageCentralsComponent,
    // SearchAgentComponent,
    KpiChartComponent,
    // MisionBotComponent,
    MisionbotSettingsComponent,
    DashboardMisionBotComponent,
    HistoryMisionBotComponent,
    MisionBotConfigComponent,
    AdvisersListComponent,
    MatrixListComponent,
    ConfigCreateComponent,
    ActivateComponent,
    // MainMapManagerComponent,
    // MapComponent,
    ContextMenuMapComponent,
    KpiIndividualComponent,
    MapDashboardComponent,
    MapDashbord2Component,
    MapV3Component,
    PositionComponent,
    FollowUpComponent,
    ConfirmComponent,
    StatesMapComponent,
    IconTableComponent,
    FollowUpPopoverComponent,
    // FilterKpisComponent,
    // FilterKpisIndComponent,
    AgentFilterComponent,
    // FilterAgentFilterComponent,
    // TpAlertComponent,
    ConsolidateAuxComponent,
    RTMComponent,
    KpisConsolidatedComponent,
    // FilterKpiConsolidatedComponent,
    AgentGroupComponent,
    RtmPieComponent,
    // LoginRegisterComponent,
    // LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    // FormsModule,
    HttpClientModule,
    // ReactiveFormsModule,
    // GridsterModule,
    // DragDropModule,
    // NebularModule,
    Ng2SmartTableModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    AngularDraggableModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'CSRF-Token',
    }),
    GeneralModuleModule,
    ThemeModule.forRoot(),

  ],
  providers: [ClientCentralComponent,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
