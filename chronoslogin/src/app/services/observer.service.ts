import { Injectable } from '@angular/core';
import { Subject, Subscription, Subscribable, Observable } from 'rxjs';
import { RequestsService } from './requests.service';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { ListComponents, IconActions, SocketArray, Agents, ApiRestComponent, DashboardSelected, LobSkill, ApiBody, FollowList, IconRTM, ListSupervisor } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ObserverService {
  protected nameLob = 'lobSkill';

  // Observables
  private currentCentralObs = new Subject<any>(); // Observable de la central actual
  private screenObs = new Subject<any>(); // Observable del estado de fullScreen
  private search = new Subject<any>(); // Observable del filtro de búsqueda para las tablas
  private boundPuestos = new Subject<any>(); // Observable de las coordenadas del mapa
  private obsResize = new Subject<any>(); // Observable del cambio de tamaño de los mapas
  private obsSave = new Subject<any>(); // Observable para guardar Dashboard
  private obsRealodCentrals = new Subject<any>(); // Observable que vuelve a consultar las centrales
  private obsLogoCentral = new Subject<any>(); // Observable para informar del cambio de logo
  private obsFollow = new Subject<any>(); // Observable para enviar lista de followUp
  private socket; // Socket de conexión principal
  private obsMainCentralTab = new Subject<any>(); // Observable para informar a las tabs cuando la central principal ha cambiado

  //////////////// private agentsList = new Subject<object>();
  private infoGeneral = new Object(); // Un objeto de observables
  private cacheInfoGeneral = new Object(); // Un objeto que almacena la información que llega para ser consumida por nuevos componentes
  public ObjectRequest = new Object(); // Un objeto que almacena el nombre del recurso de cada componente
  public sokectArray: SocketArray[] = []; // Una lista de eventos de socket (Agentes, Kpis... etc)
  private subRequest: Subscription; // Contiene suscripción a la respuesta de la conexión del socket principal
  public iconos: IconActions[] = []; // Lista de objetos con la info de los íconos globales para las listas
  public ApiRestComponent: ApiRestComponent[] = []; // Lista de objetos con los nombres y rutas a consumir por ApiRest
  private colors: string[] = []; // Almacena la paleta de colores de semaforización
  private lobSkill: LobSkill[] = []; // Almacena los lob y skill por campaña para los filtros
  private FollowList: FollowList[] = []; // Almacena la lista de followUp
  public subLobSkill: Subscription; //Suscripción de descarga de lista de supervisores
  public listSupervisor: ListSupervisor[] = [];

  public subSupervisor: Subscription;
  private iconsRTM: IconRTM[] = [];

  public countTry = 0;
  public countTrySup = 0;

  private currentCentral = ''; // Central actual
  private screen = false; // estado del fullScreen

  private currentTemplate: string; // Almacena el template del dashboard actual

  constructor(private user: RequestsService) { }


  //////////////////////////////////////// [OBSERVERS] ///////////////////////////////////////////////////////////////////
  setCentral(info: DashboardSelected, tipo?) {
    // EnvÍa Observable para que conozcan el cambio de la central
    this.stopSocketAll();
    
    this.currentCentralObs.next({ info, tipo });
    this.setCurrentCentral(info.dash.Central);
  }

  setCurrentCentral(name: string) {
    // Establece globalmente la central a consumir
    this.currentCentral = name;
    this.getLobSkill();
    this.getSupervisorList();
  }

  obsCurrentCentral() {
    // retorna el la información como observable de la central que cambió
    return this.currentCentralObs.asObservable();
  }

  setSave() {
    this.obsSave.next(true);
  }

  viewSave() {
    return this.obsSave.asObservable();
  }

  setRealodCentrals() {
    this.obsRealodCentrals.next();
  }

  setColors(colors: string[]) {
    this.colors = colors;
  }

  getLobSkill() {
    if (this.countTry < 3) {
    if (this.subLobSkill) { this.subLobSkill.unsubscribe(); }
    this.countTry++;
    // const api: ApiRestComponent = this.ApiRestComponent.find(data => data.name === this.nameLob);
    // if (api) {
      const body: ApiBody = {
        source: environment.routes.lobSkill,
        body: { central: this.currentCentral }
      };
      console.log(body, 'fffffffffffffffffffaaaaaaaaaaaaaaaaaaasssssssssssssssssssssssssss');
      this.subLobSkill = this.user.ApiGeneral(body).subscribe((res: LobSkill[]) => {
        this.lobSkill = res;
        console.log(res, 'lobsssssssssssssssssssss');
        this.subLobSkill.unsubscribe();
      }, err => {
        this.getLobSkill();
        this.subLobSkill.unsubscribe();
      });
    // }
  }

  }

  getSupervisorList() {
    if (this.countTrySup < 3) {
    if (this.subSupervisor) { this.subSupervisor.unsubscribe(); }
    this.countTrySup++;
      const body: ApiBody = {
        source: environment.routes.listSupervisor,
        body: { Central: this.currentCentral }
      };
      this.subSupervisor = this.user.ApiGeneral(body).subscribe((res: ListSupervisor[]) => {
        this.listSupervisor = res;
        console.log(res, 'Supervisoresssssssssss');
        this.subSupervisor.unsubscribe();
      }, err => {
        this.getSupervisorList();
        this.subSupervisor.unsubscribe();
      });
  }

  }

  confirmChangeCentral(name: string) {
    this.obsLogoCentral.next(name);
  }

  viweLogoCentral() {
    return this.obsLogoCentral.asObservable();
  }


  setScreen() {
    // Cambio y emite el observable del estado de FullScreen
    this.screen = !this.screen;
    this.screenObs.next(this.screen);
  }

  obsSreen() {
    // Retorna observable de FullScreen
    return this.screenObs.asObservable();
  }

  setTemplate(template: string) {
    this.currentTemplate = template;
  }

  setInfoGeneral(components: ListComponents[]) {
    // Crea Objeto con observable de cada uno componentes de Chronos estableciéndolos por el nombre del mismo
    components.forEach(c => {
      this.infoGeneral[c.name] = new Subject<Agents[]>();
    });
  }

  setFollow(info: FollowList[]) {
    this.obsFollow.next(info);
  }

  viewObsFollow() {
    return this.obsFollow.asObservable();
  }

  public get followList() {
    return this.FollowList;
  }

  setIcons(icons: IconActions[]) {
    // Carga los íconos globales para los estados de las tablas de agentes
    this.iconos = icons;
  }

  setIconsRTM(icons: IconRTM[]) {
    // Carga los íconos globales para los estados de las tablas de agentes
    this.iconsRTM = icons;
  }

  setApiRestComponent(list: ApiRestComponent[]) {
    // Asigna la lista de recursos apiRest del global
    this.ApiRestComponent = list;
  }

  setMainCentralTab(nameCentral) {
    this.obsMainCentralTab.next(nameCentral);
  }

  viewMainCentralTab() {
    return this.obsMainCentralTab.asObservable();
  }

  public viewApiRest(name: string) {
    // Devuelve el objeto con la info del recuro ApiRest
    return this.ApiRestComponent.find(data => data.name === name);
  }

  public get viewIcons() {
    // Devuelve la lista de íconos globales
    return this.iconos;
  }

  public get viewIconsRTM() {
    // Devuelve la lista de íconos globales
    return this.iconsRTM;
  }

  public get viewLobSkill() {
    // Retorna los lobSkill de la central actual
    return this.lobSkill;
  }

  public get viewListSupervisor() {
    // Retorna lista de supervisores de la central actual
    return this.listSupervisor;
  }


  public get Sreen() {
    // Devuelve el estado del FullScreen
    return this.screen;
  }

  public get Colors() {
    // Devueleve la lista de colores para semaforización de estados/aux
    return this.colors;
  }

  public get centralCurrent() {
    return this.currentCentral;
  }

  public cacheInfo(name) {
    if (!this.cacheInfoGeneral) {
      this.cacheInfoGeneral = new Object();
    }
    return this.cacheInfoGeneral[name];
  }

  public get template() {
    // Devuelve el template actual
    return this.currentTemplate;
  }

  set(object, name) {
    // Emite la información que llega de los emitsSocket como un Observable a los componentes que corresponda al nombre
    console.log(object, 'recibe next', name);
    this.infoGeneral[name].next(object[name]);
    if (!this.cacheInfoGeneral) {
      this.cacheInfoGeneral = new Object();
    }
    this.cacheInfoGeneral[name] = object[name];

  }
  viewInfoGeneral(name: string) {
    // Retorna la información de los sockets correspondiente al recurso del componente
    return this.infoGeneral[name].asObservable();
  }

  viewReloadCentrals() {
    return this.obsRealodCentrals.asObservable();
  }

  setSearch(name: any) {
    // Emite el valor criterio para que las tablas se filtren
    this.search.next(name);
  }

  viewSearch() {
    // Devuelve el valor observable para el filtro de las tablas
    return this.search.asObservable();
  }

  ///////////////////// Puestos Mapa
  setBoundPuesto(bounds, index) {
    // Emite las coordenadas he index del mapa cada puesto
    this.boundPuestos.next([bounds, index]);
  }

  viewBoundPuesto() {
    // Los puestos observan las coordenadas he index
    return this.boundPuestos.asObservable();
  }

  ///////////// PuestoResize
  setResize(index) {
    /* Si un mapa cambia de tamaño este emite el index del mismo
    para que los puestos calculen de nuevo si están dentro o fuera del rango visual */
    this.obsResize.next(index);
  }

  viewResize() {
    // Los puestos observa si el tamaño de su mapa contenedor ha cambiado
    return this.obsResize.asObservable();
  }

  //////////////////////////////////////// [OBSERVERS] ///////////////////////////////////////////////////////////////////




  //////////////////////////////////////// [SOCKET CONECCTION] ///////////////////////////////////////////////////////////////////
  initSocket(name: string) {
    // Verifica si es la primera vez que inicia el proceso para inicializar la variable
    if (!this.ObjectRequest) { this.ObjectRequest = new Object(); }


    // Verifica si ya existe un proceso de socket con el mismo recuro, para evitar duplicidad
    if (!this.ObjectRequest[name]) {

      // Agrega a la lista de request el nombre del recurso del componente
      this.ObjectRequest[name] = name;

      // Verifica si se está inicializando por primera vez para ingresar al roomSocket
      if (!this.subRequest) {
        console.log('Iniciando Subscription');
        // Inicia la suscripción a espera de la respuesta de la conexión al RoomSocket
        this.subRequest = this.setupSocketConnection().subscribe((result) => {
          console.log(result + ' connection.');
        }, err => {
          console.log('Error al conectar: ' + err);
          // this.stopRequest(name);
        });
      } else {
        this.OnSockets();
      }
    } else {
      console.log('Socket ya existe');
    }

  }

  stopRequest(name: string) {
    // Cuando un componente se elimina, este se elimina de la lista de sockets para ahorrar recursos del navegador
    delete this.ObjectRequest[name];
    console.log(this.ObjectRequest);
    console.log(this.sokectArray, 'asssssssssssssss');

    for (let index = 0; index < this.sokectArray.length; index++) {
      if (this.sokectArray[index].name === name) {
        // Apaga el evento que estaba pendiente de los emits del socket del back
        this.socket.off(name + this.currentCentral);
        // Lo elimina de la lista
        this.sokectArray.splice(index, 1);
        break;
      }
    }
    console.log(this.sokectArray, 'eliminadoooooooooo');


    if (this.subRequest) { this.subRequest.unsubscribe(); }

    console.log(Object.keys(this.ObjectRequest).length, 'Objetooooooooooooooooooooooo');
    if (Object.keys(this.ObjectRequest).length === 0) {
      this.stopSocketAll();
    }
  }


  setupSocketConnection() {
    console.log('Iniciando configuración de sokect');

    // Inicia la configuración para el SocketConecction principal
    this.socket = io(environment.SOCKET_ENDPOINT + '/agentsRooms', {
      query: {
        token: this.user.userInfo.token
      },
    });

    // Conexión al Room de la central global
    this.socket.emit('joinRoom', this.currentCentral);



    // Como observables se espera la respuesta de la conexión al sokcetRoom
    return new Observable(obs => {

      this.socket.on('err', (err) => {
        console.error('error socket', err);
        this.reloadSocket();


        // obs.error(err);
      });

      this.socket.on('success', (res) => {
        console.log('El sokcet ha conectado tío.', res);

        // this.socket.on('agentsCopa', (result) => {
        //   console.log('aaaaaaaaaaaasdasdascccccccccccccc', result);
        // });
        this.OnSockets();
        this.reloadSocket();
        this.loadFollow();
        obs.next(res);
      });

    });
  }

  reloadSocket() {
    this.socket.on('reload', (reload) => {

      // if (this.socket) {
      //   this.socket.close();
      // }
      console.log('reconectandooooo socket');
      setTimeout(() => {
        this.socket = io(environment.SOCKET_ENDPOINT + '/agentsRooms', {
          query: {
            token: this.user.userInfo.token
          },
        });
        this.socket.emit('joinRoom', this.currentCentral);
        this.socket.on('success', (res) => {
          this.OnSockets();
      //    this.reloadSocket();
          this.loadFollow();
        });
      }, 5000);

    });
  }

  loadFollow() {
    this.socket.on(this.currentCentral + 'FollowAgents', (res) => {
      this.FollowList = res;
      this.setFollow(res);
    });
  }


  OnSockets() {
    /* De acuerdo a los recursos de los componentes
    agregados en ObjectRequest crea los sokects para recibir la información, creando en sokectArray de estos */
    this.deleteSockets();
    console.log(Object.keys(this.ObjectRequest), 'fffffffffffffffffffffff', this.sokectArray);
    Object.keys(this.ObjectRequest).forEach(element => {
      this.sokectArray.push({
        name: element, socket: this.socket.on(element + this.currentCentral, (result) => {
          this.ObjectRequest[element] = result.length === 0 ? [] : result;
          this.set(this.ObjectRequest, element);
        })

      });
    });

    console.log(this.sokectArray, 'Entriesssssssssss');
  }


  stopSocketAll() {
    // Cierra la conexión del socket principal
    if (this.socket) { this.socket.close(); }
    if (this.subRequest) {
      this.subRequest.unsubscribe();
      this.subRequest = undefined;
    }
    delete this.ObjectRequest;
    this.deleteSockets();
    delete this.cacheInfoGeneral;

    console.log('Todo detenido', this.subRequest);
  }

  deleteSockets() {
    // Apaga los eventos sokects
    if (this.sokectArray.length !== 0) {
      // for (let index = 0; index < this.sokectArray.length; index++) {
      this.sokectArray.forEach(sok => {
        this.socket.off(sok.name + this.currentCentral);
        console.log('Eliminado, ', sok.name + this.currentCentral);
      });
      this.sokectArray = [];
      // this.socket.off(this.sokectArray[index].name + this.currentCentral);
      // console.log('Eliminado, ', this.sokectArray[index].name + this.currentCentral)
      // this.sokectArray.splice(index, 1);

      // }
    }
  }
  //////////////////////////////////////// [SOCKET CONECCTION] ///////////////////////////////////////////////////////////////////

}
