import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeVerifyComponent } from './code-verify/code-verify.component';
import { LoginRegisterComponent } from './login-register.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';


const routes: Routes = [
  {
    path: '',
    component: LoginRegisterComponent,
    children: [
      {
        component: VerifyUserComponent,
        path:'verify'
      },
      {
        component: CodeVerifyComponent,
        path:'code'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRegisterRoutingModule { }
