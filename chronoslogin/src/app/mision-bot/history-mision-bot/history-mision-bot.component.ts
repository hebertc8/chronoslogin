import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-mision-bot',
  templateUrl: './history-mision-bot.component.html',
  styleUrls: ['./history-mision-bot.component.scss'],
})
export class HistoryMisionBotComponent implements OnInit {
  dataHisto = [
    { time: new Date(), action: 'ejemplo action', skill: 12323 },
    { time: new Date(), action: 'ejemplo action 2', skill: 12323 },
    { time: new Date(), action: 'ejemplo action 3', skill: 12323 },
    { time: new Date(), action: 'ejemplo action 4', skill: 12323 },
    { time: new Date(), action: 'ejemplo action 5', skill: 12323 },
  ];
  history = [
    { id: 1, name: '2020-05-11 alert' },
    { id: 2, name: '2020-05-10 alert' },
    { id: 3, name: '2020-05-09 alert' },
    { id: 4, name: '2020-05-08 alert' },
    { id: 5, name: '2020-05-07 alert' },
    { id: 6, name: '2020-05-06 alert' },
    { id: 7, name: '2020-05-05 alert' },
    { id: 8, name: '2020-05-04 alert' },
  ];

  selectId: number = null;
  hide: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  loadHis() {
    if (this.selectId) {
      this.hide = false;
    }
  }
}
