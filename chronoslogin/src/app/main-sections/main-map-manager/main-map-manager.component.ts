import { Component, OnInit } from '@angular/core';
import { ClientCentralComponent } from '../profile/client-central/client-central.component';
import { map } from './map/map.component';
import { DeviceDetectorService } from 'ngx-device-detector';

interface Zone {
  id?: number;
  name?: string;
  map?: map[];
}

interface Site {
  id?: number;
  name?: string;
  zones?: Zone[];
}

interface CentralSite {
  nameCenter: string;
  Sites: Site[];
}

@Component({
  selector: 'app-main-map-manager',
  templateUrl: './main-map-manager.component.html',
  styleUrls: ['./main-map-manager.component.scss'],
})
export class MainMapManagerComponent implements OnInit {
  dataMock: CentralSite[] = [
    {
      nameCenter: 'BBVA',
      Sites: [
        {
          id: 1,
          name: 'Sede Bogota',
          zones: [
            {
              id: 1,
              name: 'Piso 6',
              map: [
                {
                  maps: { cols: 1, rows: 1, y: 0, x: 0 },
                  posts: {
                    ext: 1234,
                    position: 1,
                    status: '',
                  },
                },
                {
                  maps: { cols: 1, rows: 1, y: 3, x: 4 },
                  posts: {
                    ext: 1234,
                    position: 1,
                    status: '',
                  },
                },
                {
                  maps: { cols: 1, rows: 1, y: 5, x: 7 },
                  posts: {
                    ext: 1234,
                    position: 1,
                    status: '',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  hideAddSite = false;
  hideAddZone = false;
  hideMap = false;
  centralSelected: string;
  siteSelected: string;
  zoneSelected: string;
  textSite: string;
  textZone: string;
  loadMapData: map[] = [];
  central: any[] = this.centralComp.central;

  constructor(
    private centralComp: ClientCentralComponent,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {
  }

  get isDesktop() {
    return this.deviceService.isDesktop();
  }

  hideSite(status: boolean) {
    this.hideAddSite = status;
    this.siteSelected = null;
    this.hideMap = false;
    this.textSite = null;
  }
  hideZone(status: boolean) {
    this.hideAddZone = status;
    this.zoneSelected = null;
    this.hideMap = false;
    this.textZone = null;
  }
  addZone() {
    const indexCenter = this.dataMock.findIndex(
      (x) => x.nameCenter === this.centralSelected
    );
    const indexSite = this.dataMock[indexCenter].Sites.findIndex(
      (x) => x.name === this.siteSelected
    );
    this.dataMock[indexCenter].Sites[indexSite].zones.push({
      name: this.textZone,
      map: [],
    });
    this.hideZone(false);
  }
  addSite() {
    const index = this.dataMock.findIndex(
      (x) => x.nameCenter === this.centralSelected
    );
    if (index) {
      this.dataMock.push({
        nameCenter: this.centralSelected,
        Sites: [{ name: this.textSite, zones: [] }],
      });
    } else {
      this.dataMock[index].Sites.push({ name: this.textSite, zones: [] });
    }
    this.hideSite(false);
  }
  selectCentral(res: string) {
    this.centralSelected = res;
    this.hideSite(false);
    this.hideZone(false);
  }
  selectSite(res: string) {
    this.hideMap = false;
    this.siteSelected = res;
  }

  loadMap(site: string, zone: string, maps: map[]) {
    this.siteSelected = site;
    this.zoneSelected = zone;
    this.loadMapData = maps;
    this.hideMap = true;
  }

  saveMap() {
    const temp: CentralSite[] = [];
    temp.push({
      nameCenter: this.centralSelected,
      Sites: [
        {
          name: this.siteSelected,
          zones: [{ name: this.zoneSelected, map: this.loadMapData }],
        },
      ],
    });

    const index = temp.findIndex((x) => x.nameCenter === this.centralSelected);
    const indexSite = temp[index].Sites.findIndex(
      (x) => x.name === this.siteSelected
    );
    const indexZone = temp[index].Sites[indexSite].zones.findIndex(
      (x) => x.name === this.zoneSelected
    );
    const existNull = temp[index].Sites[indexSite].zones[indexZone].map.find(
      (x) => x.posts.ext === 0
    );

    if (existNull) {
      alert('elementos no completos');
    } else {
    }
    console.log(temp);
  }
}
