import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMenuComponent } from './main-menu.component';



const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    children: [
      {
        path: 'menu',
        loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule),
        data: { preload: true, mainPath: '/main/menu' },
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../main-sections/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { preload: true, mainPath: '/main/dashboard' },
      },
      {
        path: 'tpAlert',
        loadChildren: () => import('../tp-alert/tp-alert.module').then(m => m.TpAlertModule),
        data: { preload: true, mainPath: '/main/tpAlert' },
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainMenuRoutingModule { }
