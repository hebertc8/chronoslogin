import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainMenuRoutingModule } from './main-menu-routing.module';
// import { MenuComponent } from './menu/menu.component';
import { GeneralModuleModule } from '../general-module/general-module.module';
import { MainMenuComponent } from './main-menu.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { CentralComponent } from '../main-sections/dashboard/accessories/central/central.component';
// import { DasboardSettingsComponent } from './menu/settings/dasboard-settings/dasboard-settings.component';


@NgModule({
  declarations: [
    MainMenuComponent,
    HeaderMenuComponent,
    CentralComponent
  ],
  imports: [
    CommonModule,
    MainMenuRoutingModule,
    GeneralModuleModule
  ]
})
export class MainMenuModule { }
