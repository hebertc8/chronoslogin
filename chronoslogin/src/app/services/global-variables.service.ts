import { Injectable } from '@angular/core';
import { AgentListComponent } from '../main-sections/components/agent-list/agent-list.component';
import { ConfigComponent } from '../main-sections/dashboard/accessories/config/config.component';
import { ObserverService } from './observer.service';
import { KpiChartComponent } from '../main-sections/components/kpi-chart/kpi-chart.component';
import { KpiIndividualComponent } from '../main-sections/components/kpi-individual/kpi-individual.component';
import { MapV3Component } from '../main-sections/components/map-v3/map-v3.component';
import { StatesMapComponent } from '../main-sections/components/states-map/states-map.component';
import { ListComponents, ProfileMenu, HeaderMenu, IconActions, ApiRestComponent, IconRTM } from './interfaces';
import { ConsolidateAuxComponent } from '../main-sections/components/consolidate-aux/consolidate-aux.component';
import { RTMComponent } from '../main-sections/components/rtm/rtm.component';
import { KpisConsolidatedComponent } from '../main-sections/components/kpis-consolidated/kpis-consolidated.component';
import { AgentGroupComponent } from '../main-sections/components/agent-group/agent-group.component';
import { RtmPieComponent } from '../main-sections/components/rtm-pie/rtm-pie.component';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
  private info = new Object();

  private ListComponet: ListComponents[] = [
    {
      nameToShow: 'Agent List',
      name: 'agents',
      component: AgentListComponent,
      icon: {
        icon: 'address-card',
        pack: 'fa',
        options: { animation: { type: 'spin' } },
      },
      enabledCreate: true,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 28, maxItemCols: 20 },
      filterIndex: 0,
      filterComponent: 'FilterAgent'
    },
    //  {
    //   nameToShow: 'Map',
    //   name: 'MapV3',
    //   component: MapV3Component,
    //   icon: {
    //     icon: 'building',
    //     pack: 'fa',

    //     options: { animation: { type: 'spin' } },
    //   },
    //   enabledCreate: true,
    //   optionGrid: { minItemRows: 6, minItemCols: 6, maxItemRows: 20, maxItemCols: 20 },
    //   filterIndex: 0,
    // },
    {
      nameToShow: 'Kpi Chart',
      name: 'kpis',
      component: KpiChartComponent,
      icon: {
        icon: 'chart-line',
        pack: 'fa',

        options: { animation: { type: 'spin' } },
      },
      enabledCreate: false,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 20, maxItemCols: 20 },
      filterIndex: 0,
      filterComponent: 'FilterKpi'
    }, {
      nameToShow: 'Kpi Ind',
      name: 'kpis',
      component: KpiIndividualComponent,
      icon: {
        icon: 'radio-button-on-outline',
        pack: 'eva',

        options: { animation: { type: 'zoom' } },
      },
      enabledCreate: false,
      optionGrid: { minItemRows: 3, minItemCols: 3, maxItemRows: 28, maxItemCols: 8 },
      filterIndex: 0,
      filterComponent: 'FilterKpiInd'
    }, {
      nameToShow: 'States Map',
      name: 'agents',
      component: StatesMapComponent,
      icon: {
        icon: 'table',
        pack: 'fa',

        options: { animation: { type: 'zoom' } },
      },
      enabledCreate: true,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 28, maxItemCols: 20 },
      filterIndex: 0,
      filterComponent: 'FilterAgent'
    }, {
      nameToShow: 'Filter Agent',
      name: 'agents',
      component: AgentListComponent,
      icon: {
        icon: 'user-lock',
        pack: 'fa',

        options: { animation: { type: 'zoom' } },
      },
      enabledCreate: false,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 28, maxItemCols: 20 },
      filterIndex: 0,
      filterComponent: 'FilterAgentFilter'
    },
     {
      nameToShow: 'Aux Consolidated',
      name: 'agents',
      component: ConsolidateAuxComponent,
      icon: {
        icon: 'list-alt',
        pack: 'fa',
        options: { animation: { type: 'spin' } },
      },
      enabledCreate: true,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 28, maxItemCols: 20 },
      filterIndex: 0,
      // filterComponent: 'FilterAgent'
    },
    {
      nameToShow: 'RTM',
      name: 'RTM',
      component: RTMComponent,
      icon: {
        icon: 'stopwatch',
        pack: 'fa',
        options: { animation: { type: 'spin' } },
      },
      enabledCreate: true,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 28, maxItemCols: 20 },
      filterIndex: 0,
      // filterComponent: 'FilterAgent'
    }, {
      nameToShow: 'Kpi Consolidated',
      name: 'kpisConsolidated',
      component: KpisConsolidatedComponent,
      icon: {
        icon: 'vector-square',
        pack: 'fa',
        options: { animation: { type: 'spin' } },
      },
      enabledCreate: false,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 28, maxItemCols: 20 },
      filterIndex: 0,
      filterComponent: 'FilterKpiConsolidated'
    },
     {
      nameToShow: 'Agent Group',
      name: 'AgentGroup',
      component: AgentGroupComponent,
      icon: {
        icon: 'users',
        pack: 'fa',
        options: { animation: { type: 'spin' } },
      },
      enabledCreate: false,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 28, maxItemCols: 20 },
      filterIndex: 0,
      filterComponent: 'FilterKpiConsolidated'
    },
     {
      nameToShow: 'RTM Pie',
      name: 'RTM',
      component: RtmPieComponent,
      icon: {
        icon: 'chart-pie',
        pack: 'fa',
        options: { animation: { type: 'spin' } },
      },
      enabledCreate: true,
      optionGrid: { minItemRows: 4, minItemCols: 4, maxItemRows: 28, maxItemCols: 40 },
      filterIndex: 0,
    },
  ];

  private profileMenu: ProfileMenu[] = [
    // {
    //   title: 'Profile',
    //   icon: { icon: 'user-circle', pack: 'fa' },
    //   target: 'main/profile',
    // },
    {
      title: 'Log Out',
      icon: { icon: 'sign-out-alt', pack: 'fa' },
      target: 'login',
    },
  ];

  private headerMenu: HeaderMenu[] = [
    {
      icon: { icon: 'home', pack: 'fa' },
      route: 'menu',
    },
    {
      icon: { icon: 'retweet', pack: 'fa' },
      route: 'tpAlert',
    },
    // {
    //   icon: { icon: 'code-branch', pack: 'fa' },
    //   route: '',
    // },
    // {
    //   icon: { icon: 'map-marker', pack: 'fa' },
    //   route: '',
    // },
  ];

  private iconsStates: IconActions[] = [
    {
      icon: 'question-circle',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'stop-circle',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'headset',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'exclamation',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'user',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'graduation-cap',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'coffee',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'male',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'comment-dots',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'tools',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'sink',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'phone-volume',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'users',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'grin',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'exclamation-triangle',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'address-book',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }, {
      icon: 'search-location',
      pack: 'fa',
      options: { animation: { type: 'zoom' } },
    }
  ];

  private iconsRTM: IconRTM[] = [
    {
      icon: 'utensils',
      pack: 'fa',
      alarm: 100,
    }, {
      icon: 'stopwatch',
      pack: 'fa',
      alarm: 101,
      status: 'danger'
    }, {
      icon: 'stopwatch',
      pack: 'fa',
      alarm: 102,
      status: 'danger'
    }, {
      icon: 'arrow-circle-left',
      pack: 'fa',
      alarm: 200,
      status: 'warning'
    }, {
      icon: 'arrow-circle-left',
      pack: 'fa',
      alarm: 201,
      status: 'warning'
    }, {
      icon: 'arrow-circle-left',
      pack: 'fa',
      alarm: 202,
      status: 'warning'
    }, {
      icon: 'arrow-circle-right',
      pack: 'fa',
      alarm: 300,
      status: 'warning'
    }, {
      icon: 'arrow-circle-right',
      pack: 'fa',
      alarm: 301,
      status: 'warning'
    }, {
      icon: 'arrow-circle-right',
      pack: 'fa',
      alarm: 302,
      status: 'warning'
    }, {
      icon: 'wifi-off-outline',
      pack: 'eva',
      alarm: 400,
      status: 'primary'
    }, {
      icon: 'calendar-times',
      pack: 'fa',
      alarm: 500,
      status: 'primary'
    }, {
      icon: 'sign-in-alt',
      pack: 'fa',
      alarm: 600,
      status: 'danger'
    }, {
      icon: 'sign-out-alt',
      pack: 'fa',
      alarm: 700,
      status: 'danger'
    },

  ]

  private ApiRestComponent: ApiRestComponent[] = [
    {
      name: 'Centrales',
      source: 'centralesDashboards',
      subItems: [
        {
          name: 'mainCentral',
          source: 'mainCentral'
        }, {
          name: 'Template',
          source: 'template',
        }
      ]
    }, {
      name: 'Lobs',
      source: 'lobs'
    }, {
      name: 'Tabs',
      subItems: [
        {
          name: 'SaveDeleteInsert',
          source: 'addDashboards',
        }, {
          name: 'Share',
          source: 'Faltante',
        }
      ]
    }, {
      name: 'Dashboard',
      subItems: [
        {
          name: 'Template',
          source: 'template',
        }
      ]

    }, {
      name: 'lobSkill',
      source: 'lobSkill'
    },
    {
      name: 'followUp',
      source: 'followAgents'
    }

  ];

  private colors: string[] = [
    '#FFB800',
    '#BABABA',
    '#002C90',
    '#FF7F00',
    '#C03529',
    '#3C185A',
    '#278D00',
    '#0070F6',
    '#FFB800'
  ];

  constructor(private observer: ObserverService) {
    this.observer.setInfoGeneral(this.ListComponet);
    this.observer.setIcons(this.iconsStates);
    this.observer.setApiRestComponent(this.ApiRestComponent);
    this.observer.setColors(this.colors);
    this.observer.setIconsRTM(this.iconsRTM);

  }

  public get viewComponents() {
    return this.ListComponet;
  }
  public get viewprofileMenu() {
    return this.profileMenu;
  }

  public get viewHeaderMenu() {
    return this.headerMenu;
  }
}
