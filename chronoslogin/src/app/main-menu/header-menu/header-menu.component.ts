import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { Router, UrlTree } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { HeaderMenu } from 'src/app/services/interfaces';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit, OnDestroy {

  public menu: HeaderMenu[] = [];
  subscriptionInjectItem: Subscription;
  constructor(private globalVarible: GlobalVariablesService, private route: Router) { }

  ngOnInit(): void {
  }

  redirect(route: string) {
    this.route.navigate(['main/' + route]);
  }

  appear() {
    const m = this.globalVarible.viewHeaderMenu;
    const length = m.length;
    let count = 0;
    this.subscriptionInjectItem = interval(200).pipe(
      take((length)),

      // tslint:disable-next-line: no-shadowed-variable
    ).subscribe(time => {

      // info['matches'][count].picture = './assets/images/userDefault.svg';
      // await this.post.getPicture( info['matches'][count].idccms).then(res => {
      //      info['matches'][count].picture = 'data:image/png;base64,' + res['result'][0].picture;
      this.menu.push(m[count]);

      // });
      count++;
      if (count === (length)) {
        this.subscriptionInjectItem.unsubscribe();
      }
    });
  }

  disappear() {
    const length = this.menu.length;
    let count = 1;
    this.subscriptionInjectItem = interval(200).pipe(
      take((length)),

      // tslint:disable-next-line: no-shadowed-variable
    ).subscribe(time => {

      // info['matches'][count].picture = './assets/images/userDefault.svg';
      // await this.post.getPicture( info['matches'][count].idccms).then(res => {
      //      info['matches'][count].picture = 'data:image/png;base64,' + res['result'][0].picture;
      this.menu.splice((length - count), 1);

      // });
      count++;
      if (count === (length + 1)) {
        this.subscriptionInjectItem.unsubscribe();
      }
    });

  }

  ngOnDestroy() {
    if (this.subscriptionInjectItem) { this.subscriptionInjectItem.unsubscribe(); }
  }

}
