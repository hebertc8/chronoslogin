import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TpAlertComponent } from './tp-alert.component';


const routes: Routes = [
  {
    path: '',
    component: TpAlertComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TpAlertRoutingModule { }
