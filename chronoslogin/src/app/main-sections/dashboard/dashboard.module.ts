import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TabDasboardComponent } from './accessories/tab-dasboard/tab-dasboard.component';
import { GeneralModuleModule } from 'src/app/general-module/general-module.module';
import { GridsterModule } from 'angular-gridster2';
import { ComponentFactoryComponent } from 'src/app/component-factory/component-factory.component';
import { RightClickComponent } from './accessories/right-click/right-click.component';
import { SearchAgentComponent } from './accessories/search-agent/search-agent.component';
import { ConfigComponent } from './accessories/config/config.component';
import { LoadingComponent } from 'src/app/miscellaneous/loading/loading.component';
import { ConfigComponentComponent } from 'src/app/general-components/config-component/config-component.component';
import { FilterAgentFilterComponent } from 'src/app/general-components/filter-agent-filter/filter-agent-filter.component';
import { FilterKpiConsolidatedComponent } from 'src/app/general-components/filter-kpi-consolidated/filter-kpi-consolidated.component';
import { FilterKpisComponent } from 'src/app/general-components/filter-kpis/filter-kpis.component';
import { FilterKpisIndComponent } from 'src/app/general-components/filter-kpis-ind/filter-kpis-ind.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AgentListComponent } from '../components/agent-list/agent-list.component';
import { FollowUpPopoverComponent } from '../components/agent-list/follow-up-popover/follow-up-popover.component';
import { IconTableComponent } from '../components/agent-list/icon-table/icon-table.component';


@NgModule({
  declarations: [
    DashboardComponent,
    TabDasboardComponent,
    ComponentFactoryComponent,
    RightClickComponent,
    SearchAgentComponent,
    ConfigComponent,
    LoadingComponent,
    ConfigComponentComponent,
    FilterAgentFilterComponent,
    FilterKpiConsolidatedComponent,
    FilterKpisComponent,
    FilterKpisIndComponent,
    // AgentListComponent,
    // FollowUpPopoverComponent,
    // IconTableComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GeneralModuleModule,
    GridsterModule,
    // Ng2SmartTableModule
  ]
})
export class DashboardModule { }
