import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FunctionsService } from '../services/functions.service';
import { ApiBody } from '../services/interfaces';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit, OnDestroy {
  sub: Subscription[] = [];
  subTime: Subscription;
  form: FormGroup;
  formEmail: FormGroup;
  formPass: FormGroup;
  load = false;
  showPassword = false;
  message = '';
  step = 0;
  timeRemaining = 300;
  timeRemainingShow = '05:00';
  barValueTime = 100;
  resentCodeShow = false;

  textButton = 0;

  emailTemp = '';
  codeTemp = 0;
  passTemp = '';

  ////// token
  private token = '';

  tabs = [
    {
      title: 'Route tab #1',
      route: './verify',
      icon: 'home',
      responsive: true, // hide title before `route-tabs-icon-only-max-width` value
    },
    {
      title: 'Route tab #2',
      route: './code',
    }
  ];




  constructor(private fb: FormBuilder, private functions: FunctionsService, private req: RequestsService, private toastr: NbToastrService) {

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

    ///////////// 2

    this.formEmail = fb.group({
      email: [null, [Validators.email, Validators.required]],
      code: [null],
      // password: [null, Validators.required],
      // passwordC: [null, Validators.required],
    }
      // , {
      //   validator: this.functions.MustMatch('password', 'passwordC')
      // }
    );

    this.formEmail.get('email').valueChanges.subscribe(res => {
      this.emailTemp = res;
    });


    //////////// 3
    this.formPass = fb.group({
      password: [null, Validators.compose([
        Validators.required,
        this.functions.patternValidator(/\d/, { hasNumber: true }),
        this.functions.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        this.functions.patternValidator(/[a-z]/, { hasSmallCase: true }),
        // this.functions.patternValidator(/[ [!@#$%^&*()_+-=[]{};':"|,.<>/?]/](<mailto:!@#$%^&*()_+-=[]{};':"|,.<>/?]/>), { hasSpecialCharacters: true }),
        Validators.minLength(8)])
      ],
      passwordC: [null, Validators.required]
      // password: [null, Validators.required],
      // passwordC: [null, Validators.required],
    }
      , {
        validator: this.functions.MustMatch('password', 'passwordC')
      }
    );

  }

  get f() { return this.form.controls; }
  get fe() { return this.formEmail.controls; }
  get fp() { return this.formPass.controls; }

  ngOnInit(): void {
  }

  verify() {

    this.load = true;
    const input = this.form.value;
    let body: ApiBody = {
      source: environment.routes.register,
      body: { CCMSUser: input.user }
    }

    this.form.get('user').disable();
    this.sub.push(
      this.req.ApiGeneral(body).subscribe((res: any) => {

        console.log(true, 'Respuesta verify', res, this.message);
        if (res.token && res.result === true) {
          this.step++;
          this.token = res.token;

        } else {
          this.form.get('user').enable();
          this.message = res[0].Result;
        }
        this.load = false;
      }, err => {
        this.load = false;
        this.form.get('user').enable();
        console.error('Error verify', err);
      })


    )
  }

  convertTime(time) {
    // let hours:any = Math.floor( time / 3600 );
    // let minutes:any = Math.floor( (time % 3600) / 60 );
    let minutes: any = Math.floor(time / 60);
    let seconds: any = time % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ':' + seconds;
  }

  InitTimeRemaining() {
    this.resentCodeShow = false;
    let count = 0;
    let timeTemp = this.timeRemaining;
    this.subTime = interval(1000).pipe(
      take((this.timeRemaining)),

      // tslint:disable-next-line: no-shadowed-variable
    ).subscribe(time => {

      // info['matches'][count].picture = './assets/images/userDefault.svg';
      // await this.post.getPicture( info['matches'][count].idccms).then(res => {
      //      info['matches'][count].picture = 'data:image/png;base64,' + res['result'][0].picture;
      timeTemp--;
      this.timeRemainingShow = this.convertTime(timeTemp);
      this.barValueTime = (timeTemp / this.timeRemaining) * 100;

      // });
      count++;
      if (count === (this.timeRemaining)) {
        this.resentCodeShow = true;
        this.subTime.unsubscribe();

      }
    });
  }

  sendCode() {
    this.load = true;
    this.timeRemainingShow = '05:00';
    const input2 = this.form.value;
    let body: ApiBody = {
      source: environment.routes.sendCode,
      body: { CCMSUser: input2.user, email: this.emailTemp, code: 0, type: 1 }
    }
    this.formEmail.get('email').disable();
    this.sub.push(
      this.req.ApiRegister(body, this.token).subscribe((res: any) => {
        console.log(true, 'Respuesta send Code', res, this.message);


        if (res[0].Result.includes('enviado')) {
          this.formEmail.get('code').setValidators([Validators.required, Validators.max(999999), Validators.min(100000), Validators.pattern('[0-9]+'), Validators.maxLength(6), Validators.minLength(6)]);
          this.message = res[0].Result;
          this.InitTimeRemaining();
          this.textButton = 1;
        } else if (res[0].Result.includes('está registrado')) {
          this.toastr.warning(res[0].Result);
          this.formEmail.get('email').enable();
        } else {
          this.message = '';
          this.toastr.warning('Algo salió mal');
          this.formEmail.get('email').enable();
        }

        this.load = false;
      }, err => {
        this.load = false;
        this.formEmail.get('email').enable();
        console.error('Error send code', err);
      })


    )
  }

  verifyCode() {
    this.load = true;
    if (!this.emailTemp) {
      this.emailTemp = this.formEmail.value.email;
    }
    this.codeTemp = this.formEmail.value.code;
    this.timeRemainingShow = '05:00';
    const input2 = this.form.value;
    let body: ApiBody = {
      source: environment.routes.sendCode,
      body: { CCMSUser: input2.user, email: this.emailTemp, code: this.codeTemp, type: 0 }
    }
    this.formEmail.get('code').disable();
    this.sub.push(
      this.req.ApiRegister(body, this.token).subscribe((res: any) => {
        console.log(true, 'Respuesta validate Code', res);


        if (res === true) {
          this.step++;
        } else if (res == false) {
          this.toastr.warning('Código inválido', 'Chronos');
          this.formEmail.get('code').enable();
        }

        this.load = false;
      }, err => {
        this.load = false;
        this.formEmail.get('code').enable();
        console.error('Error código', err);
      })


    )

  }

  sendPass() {
    this.load = true;

    let input = btoa(this.formPass.value.password);
    const input2 = this.form.value;
    let body: ApiBody = {
      source: environment.routes.registerUser,
      body: { CCMSUser: input2.user, email: this.emailTemp, token: 'dd' + input.slice(0, 1) + 'c' + input.slice(1) }
    }
    this.formPass.get('password').disable();
    this.formPass.get('passwordC').disable();
    this.sub.push(
      this.req.ApiRegister(body, this.token).subscribe((res: any) => {
        console.log(true, 'Respuesta register usuario', res);


        if (res[0].Result.includes('exitoso')) {
          this.step++;
        } else {
          this.toastr.warning('Algo salió mal');
        }

        this.load = false;
      }, err => {
        this.load = false;
        this.formPass.get('password').enable();
        this.formPass.get('passwordC').enable();
        console.error('Error register usuario', err);
      })


    )
  }

  cancel() {
    location.reload();
  }

  ngOnDestroy() {
    if (this.subTime) { this.subTime.unsubscribe() };
    this.sub.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })
  }

}
