import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ApiBody, DataUser } from './interfaces';
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private path = environment.apiUrl + '/api/';
  constructor(private http: HttpClient) {
  }

  //////////////////////// [ LOGIN ] ////////////////////////////////
  login(body) {
    return this.http.post(this.path + 'login', { body })
      .pipe(

        map((info: any) => {
          console.log(info);
          if (info.token) {
            return this.enc(info, body);
          } else {
            return 'error';
          }
        })
      );
  }

  protected enc(info, body?) {
    if (body) {
      info = { ...info, tpAlert: CryptoJS.AES.encrypt(JSON.stringify(body), moment(new Date()).format('YYYY-MM-DD')).toString().replaceAll('/', 'ñ').replaceAll('+', '!') }
      console.log(info, 'aquíii la información de logueo del usuario', body);
    }



    // const base = btoa(JSON.stringify(info)).split('');
    // const c = btoa(JSON.stringify(info)).split('');
    // const alg = moment(new Date()).format('YYYYMMDD').split('');
    // for (let index = 0; index < 8; index++) {
    //   base.splice(Number(alg[index]), 0, Math.random().toString(36).substring(2, 3));
    // }
    // const res = base.join('');
    // localStorage.setItem('x', res);
    localStorage.setItem('x', CryptoJS.AES.encrypt(JSON.stringify(info), moment(new Date()).format('YYYY-MM-DD')).toString());
    return 'Ok';
  }

  protected dec(): DataUser {
    // try {
    //   const alg = moment(new Date()).format('YYYYMMDD').split('').reverse();
    //   const base = localStorage.getItem('x').split('');
    //   for (let index = 0; index < 8; index++) {
    //     base.splice(Number(alg[index]), 1);
    //   }
    //   const res = JSON.parse(atob(base.join('')));
    //   return res;
    // } catch (error) {
    //   return null;
    // }
    try {
      return JSON.parse(
        CryptoJS.AES.decrypt(localStorage.getItem('x'), moment(new Date()).format('YYYY-MM-DD')).toString(CryptoJS.enc.Utf8));
    } catch (error) {
      this.logout();
    }
  }

  get userInfo(): DataUser {
    return this.dec();
  }

  logout() {
    localStorage.clear();
  }

  changeTemplate(template: string, idDash, nameCentral) {

    const temp = this.userInfo;
    temp.data[0].template = template;
    temp.data[0].iddash = idDash;
    temp.data[0].Central = nameCentral;
    console.log(template, 'cambiarrrrrrrrTemplate', idDash, nameCentral, temp)
    this.enc(temp);
  }

  //////////////////////// [ LOGIN ] ////////////////////////////////

  //////////////////////// [ ApiGeneral ] ////////////////////////////////

  ApiGeneral(apiBody: ApiBody) {
    return this.http.post(this.path + apiBody.source, apiBody.body);
  }

  ApiRegister(apiBody: ApiBody, token) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8').set('Authorization', `Bearer ${token}`).set('Access-Control-Allow-Origin', '*');
    return this.http.post(this.path + apiBody.source, apiBody.body, {headers: headers});
  }

}
