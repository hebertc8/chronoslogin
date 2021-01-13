import { Component, OnInit } from '@angular/core';
import { ObserverService } from 'src/app/services/observer.service';

@Component({
  selector: 'app-search-agent',
  templateUrl: './search-agent.component.html',
  styleUrls: ['./search-agent.component.scss'],
})
export class SearchAgentComponent implements OnInit {

  searchName;

  constructor(private observer: ObserverService) { }

  ngOnInit(): void {
  }

  search(n) {
    if (n === null) {
      n = this.searchName === undefined || this.searchName === '' ? false : true;
    }

    if (n) {
      const x = this.searchName === undefined || this.searchName === '' ? false : this.searchName;
      this.observer.setSearch(x);
    } else {
      this.observer.setSearch(false);
      this.searchName = undefined;
    }
  }

}
