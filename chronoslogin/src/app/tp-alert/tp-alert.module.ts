import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TpAlertRoutingModule } from './tp-alert-routing.module';
import { GeneralModuleModule } from '../general-module/general-module.module';
import { TpAlertComponent } from './tp-alert.component';


@NgModule({
  declarations: [
    TpAlertComponent
  ],
  imports: [
    CommonModule,
    TpAlertRoutingModule,
    GeneralModuleModule
  ]
})
export class TpAlertModule { }
