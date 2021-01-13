import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LoginComponent } from './login/login.component';
// import { MainMenuComponent } from './main-menu/main-menu.component';
// import { MenuComponent } from './main-menu/menu/menu.component';
// import { DashboardComponent } from './main-sections/dashboard/dashboard.component';
// import { ProfileComponent } from './main-sections/profile/profile.component';
// import { MisionBotComponent } from './mision-bot/mision-bot.component';
// import { HistoryMisionBotComponent } from './mision-bot/history-mision-bot/history-mision-bot.component';
// import { DashboardMisionBotComponent } from './mision-bot/dashboard-mision-bot/dashboard-mision-bot.component';
// import { MisionBotConfigComponent } from './mision-bot/mision-bot-config/mision-bot-config.component';
// import { MainMapManagerComponent } from './main-sections/main-map-manager/main-map-manager.component';
import { LoginGuard } from './services/guards/login.guard';
import { ValidateLoginGuard } from './services/guards/validate-login.guard';
// import { TpAlertComponent } from './tp-alert/tp-alert.component';


const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'prefix' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./login-register/login-register.module').then( m => m.LoginRegisterModule),
    data: { preload: true, mainPath: '/register' },
    // canActivate: [LoginGuard]
  },
  {
    path: 'main',
    // component: MainMenuComponent,
    canActivate: [ValidateLoginGuard],
    loadChildren: () => import('./main-menu/main-menu.module').then( m => m.MainMenuModule),
    data: { preload: true, mainPath: '/main' },


    // children: [
    //   {
    //     path: 'menu',
    //     // component: MenuComponent,
    //     // canActivate: [ValidateLoginGuard]
    //     loadChildren: () => import('./main-menu/main-menu.module').then( m => m.MainMenuModule),
    //     data: { preload: true, mainPath: '/main/menu' },
    //   },
    //   {
    //     path: 'dashboard',
    //     // component: DashboardComponent,
    //     // canActivate: [ValidateLoginGuard]
    //     loadChildren: () => import('./main-sections/main-sections.module').then( m => m.MainSectionsModule),
    //     data: { preload: true, mainPath: '/main/dashboard' },
    //   },
    //   {
    //     path: 'map-manager',
    //     component: MainMapManagerComponent,
    //     canActivate: [ValidateLoginGuard]
    //   },
    //   {
    //     path: 'tpAlert',
    //     // component: TpAlertComponent,
    //     // canActivate: [ValidateLoginGuard]
    //     loadChildren: () => import('./tp-alert/tp-alert.module').then( m => m.TpAlertModule),
    //     data: { preload: true, mainPath: '/main/tpAlert' },
    //   },
    //   // {
    //   //   path: 'misionbot',
    //   //   component: MisionBotComponent,
    //   //   canActivate: [ValidateLoginGuard],
    //   //   children: [
    //   //     {
    //   //       path: '',
    //   //       component: DashboardMisionBotComponent,
    //   //     },
    //   //     {
    //   //       path: 'history',
    //   //       component: HistoryMisionBotComponent,
    //   //     },
    //   //     {
    //   //       path: 'configuration',
    //   //       component: MisionBotConfigComponent,
    //   //     }
    //   //   ]
    //   // },
    //   {
    //     path: 'profile',
    //     component: ProfileComponent,
    //     canActivate: [ValidateLoginGuard],
    //   }
    // ]

  },
  /* {
      path: 'pages',
      loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },*/

  { path: '**', redirectTo: 'login' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
