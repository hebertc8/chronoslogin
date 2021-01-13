import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRegisterRoutingModule } from './login-register-routing.module';
import { GeneralModuleModule } from '../general-module/general-module.module';
import { LoginRegisterComponent } from './login-register.component';
import { CodeVerifyComponent } from './code-verify/code-verify.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';


@NgModule({
  declarations: [

    LoginRegisterComponent,

    CodeVerifyComponent,

    VerifyUserComponent
  ],
  imports: [
    CommonModule,
    LoginRegisterRoutingModule,
    GeneralModuleModule
  ]
})
export class LoginRegisterModule { }
