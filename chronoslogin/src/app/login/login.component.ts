import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestsService } from '../services/requests.service';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showPassword = false;
  form: FormGroup;
  send = false;
  load = false;

  constructor(private fb: FormBuilder, private router: Router, private request: RequestsService, private toastr: NbToastrService) {

    this.form = fb.group({
      user: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.load = true;
    const input = this.form.value;
    const info = {
      user: input.user,
      pass: input.password,
    };
    const userInfo = btoa(JSON.stringify(info));
    const body = 'dd' + userInfo.slice(0, 1) + 'c' + userInfo.slice(1);
    console.log(userInfo, body);
    this.request.login(body).subscribe(res => {
      if (res === 'Ok') {
        this.router.navigate(['/main/menu']);
        setTimeout(() => {
          this.toastr.success('Welcome!', 'Chronos', { icon: 'user-check', iconPack: 'fa', position: NbGlobalLogicalPosition.BOTTOM_END });
        }, 1000);
      } else {
        this.toastr.warning(res, ':C', { icon: 'user-slash', iconPack: 'fa', position: NbGlobalLogicalPosition.BOTTOM_END });
      }
      this.load = false;
    }, error => {
      this.load = false;
    });
  }

}
