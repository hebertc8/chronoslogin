import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FunctionsService } from 'src/app/services/functions.service';
import { ApiBody } from 'src/app/services/interfaces';
import { RequestsService } from 'src/app/services/requests.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit {
  sub: Subscription[] = [];
  form: FormGroup;
  load = false;
  showPassword = false;
  message = '';
  constructor(private fb: FormBuilder, private functions: FunctionsService, private req: RequestsService) {
    this.form = fb.group({
      user: [null, Validators.required],
      // password: [null, Validators.required],
      // passwordC: [null, Validators.required],
    }
      // , {
      //   validator: this.functions.MustMatch('password', 'passwordC')
      // }
    );

    this.form.get('user').valueChanges.subscribe(res => {
      this.message = '';
    });

  }
  get f() { return this.form.controls; }
  ngOnInit(): void {
  }

  login() {
    const input = this.form.value;

    let body: ApiBody = {
      source: environment.routes.register,
      body: { CCMSUser: input.user }
    }

    this.sub.push(
      this.req.ApiGeneral(body).subscribe((res: any) => {

        if (res === 'true') {
          //...

        } else {
          this.message = res[0].Result;
        }

        console.log(true, 'Respuesta register', res, this.message);
      }, err => {
        console.error('Error register', err);
      })


    )

  }
}
