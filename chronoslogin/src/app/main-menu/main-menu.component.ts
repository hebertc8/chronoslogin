import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  GlobalVariablesService
} from 'src/app/services/global-variables.service';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { ObserverService } from '../services/observer.service';
import { Subscription, Subject } from 'rxjs';
import { NbMenuService, NbThemeService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { ProfileMenu, UserInfoHeader } from '../services/interfaces';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  @ViewChild('menu', { read: HeaderMenuComponent }) menu: HeaderMenuComponent;

  private destroy$: Subject<void> = new Subject<void>();
  showMenuHeader = false;
  class = ''; // fullScreen
  subScrren: Subscription;
  viewProfileMenu: ProfileMenu[] = [];
  userInfoHeader: UserInfoHeader;
  classCentral = '';
  subsLogoCentral: Subscription;
  currentTheme = 'default';

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  constructor(
    private nbMenuService: NbMenuService,
    private globalVarible: GlobalVariablesService,
    public router: Router,
    private observer: ObserverService,
    private user: RequestsService,
    private themeService: NbThemeService,
  ) {
    this.viewProfileMenu = this.globalVarible.viewprofileMenu;

    this.subsLogoCentral = this.observer.viweLogoCentral().subscribe(res => {
      this.userInfoHeader.Central = res;
    });
  }

  ngOnInit(): void {
    this.currentTheme = this.themeService.currentTheme;
    this.userInfoHeader = this.user.userInfo.data[0];
    this.userInfoHeader.Picture = 'data:image/png;base64,' + this.userInfoHeader.Picture;
    this.subScrren = this.observer.obsSreen().subscribe((bit) => {
      this.class = bit ? 'fullScreen' : '';
    });
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'menu-action'),
        map(({ item: { target } }) => target)
      )
      .subscribe((target) => {
        if (target === 'login') {
          this.user.logout();
        }
        this.router.navigate([target]);
      });
  }
  ngOnDestroy() {
    if (this.subScrren) {
      this.subScrren.unsubscribe();
    }
    if (this.subsLogoCentral) { this.subsLogoCentral.unsubscribe(); }
    this.destroy$.next();
    this.destroy$.complete();
  }
  menuAppear() {
    this.showMenuHeader = !this.showMenuHeader;

    if (this.showMenuHeader) {
      this.menu.appear();
    } else {
      this.menu.disappear();
    }
  }

  openCentral() {
    this.classCentral = this.classCentral === 'Open' ? '' : 'Open';
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }
}
