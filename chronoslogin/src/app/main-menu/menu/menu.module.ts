import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { DasboardSettingsComponent } from './settings/dasboard-settings/dasboard-settings.component';
import { GeneralModuleModule } from 'src/app/general-module/general-module.module';


@NgModule({
  declarations: [
    MenuComponent,
    DasboardSettingsComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    GeneralModuleModule
  ]
})
export class MenuModule { }
