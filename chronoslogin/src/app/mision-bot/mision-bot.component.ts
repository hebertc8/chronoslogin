import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mision-bot',
  templateUrl: './mision-bot.component.html',
  styleUrls: ['./mision-bot.component.scss']
})
export class MisionBotComponent implements OnInit {

  tabs: any[] = [
    {
      title: 'Dashboard',
      icon: 'list-outline',
      responsive: true,
      route: ['./'],
    },
    {
      title: 'Configurations',
      icon: 'settings-outline',
      responsive: true,
      route: [ './configuration' ]
    },
    {
      title: 'History',
      icon: 'book-outline',
      responsive: true,
      route: [ './history' ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
