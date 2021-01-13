export interface ListComponents {
    nameToShow: string;
    name: string;
    component: any;
    icon: IconActions;
    enabledCreate: boolean;
    optionGrid?: OptionsGrid;
    filterIndex?: number;
    filter?: FilterSelected;
    filterComponent?: string;
}

export interface FilterSelected {
    lob?: string[];
    subLob?: string[];
    skill?: string[];
    indicator?: string;
    // tslint:disable-next-line: align
    lobKpi?: string;
    skillKpi?: string;
    lobkpiInd?: string[];
    skillKpiInd?: string[];
    idsFilter?: string;
    idSupervisor?: string;
    NameSupervisor?: string;
    NES?: string;
}

export interface IconActions {
    icon: string;
    pack: string;
    nameComponent?: string;
    options?: any;
}

interface OptionsGrid {
    minItemRows: number;
    maxItemRows: number;
    minItemCols: number;
    maxItemCols: number;
}
export interface ProfileMenu {
    title: string;
    icon: Icon;
    target: string;
}

export interface HeaderMenu {
    route: string;
    icon: Icon;
}

interface Icon {
    icon: string;
    pack: string;
}

export interface Remove {
    index: number;
    name: string;
    source: string;
}

export interface UserInfoHeader {
    NameUser: string;
    ccmsuser: string;
    Picture: string;
    Central: string;
}

export interface InfoCentralDashboard {
    idcentral: number;
    iddash: number;
    Central: string;
    NameDashboard: string;
    tipo: number;
    main?: string;
}

export interface Agents {
    Aux: string;
    badge: string;
    NameCentral: string;
    coloraux: number;
    colorestado: number;
    detalleskill: string;
    Dir: string;
    Status: string;
    Ext: number;
    hastaaux: number;
    hastaestado: number;
    iconoaux: number;
    iconoestado: number;
    Lob: string;
    lobok: string;
    login: number;
    nombre: string;
    sublob: string;
    TimeState: number;
    total: number;
    Skills: string;
    idSupervisor: string;
}

export interface SocketArray {
    name: string;
    socket: any;
}

export interface ApiRestComponent {
    name: string;
    source?: string;
    subItems?: ApiRestComponent[];
}

export interface ApiBody {
    source: string;
    body?: any;
}

export interface Centrales {
    Data: ActiveCentrals[];
}

interface ActiveCentrals {
    ActiveCentrals: Central[];
    idccmsUser: number;
}

export interface Central {
    NameCentral: string;
    main: string;
    // status: string;
    ActiveDashboards: Dashboard[];
}

export interface Dashboard {
    idCentral: number;
    idDashboard: number;
    nameDashboard: string;
    typeDashboard: number;
    Central?: string;
    main?: string;
}

export interface User {
    Central: string;
    NameDashboard: string;
    NameUser: string;
    Picture: string;
    UserType: number;
    ccmsuser: string;
    idccms: number;
    idcentral: number;
    iddash: number;
    keys: string;
    template: string;
    typeDashboard: string;
}

export interface DashboardSelected {
    dash: Dashboard;
    listDash: Dashboard[];
}

export interface Template {
    Template: string;
}

export interface LobSkill {
    NameCentral: string;
    Lob: string;
    SubLob: string;
    DetailSkill: string;
    Skill: number;
}

export interface KpisSelect {
    name: string;
    indicator: string;
}

export interface KpiRaw {
    Lob: string;
    NameCentral: string;
    Skill: number;
    formatoKpi: string;
    indicator: string;
    previsto: number;
    realValue: number;
    typeSkill: string;
    filterName?: string | number;
}

export interface KpiHtml {
    name: string;
    value: number;
    fc: number;
    filterName: string | number;
    semaforizacion: string;
    valueBar: number;
    showFC: boolean;
}

export interface FollowList {
    id: number;
    login: number;
    nombre: string;
    requestById: number;
    requestByUser: string;
    requestDate: string;
    NameCentral: string;
    nameLob: string;
    followStatus: string;
    Badge: string;
    obs: string;
    requestEndDate: string;
    requestEndBy: string;
    ObSend: string;
    Conectado: number;
}

export interface DataUser {
    data: Data[];
    token: string;
    tpAlert: string;
}

export interface Data {
    Central: string;
    NameDashboard: string;
    NameUser: string;
    Picture: string;
    UserType: number;
    ccmsuser: string;
    idccms: number;
    idcentral: number;
    iddash: number;
    keys: string;
    template: string;
    typeDashboard: string;
    tipo: number;
}


////////////////////// Consolidate Aux /////////////////////
export interface Row {
    lob: string;
    auxs: Cantidad[];
}

export interface Cantidad {
    Aux: string;
    cantidad: number;

}


///////////////////// RTM ///////////////////
 
export interface RTMlist {
    Central: string;
    lob: string;
    idccms: string;
    nombre: string;
    estado: string;
    alarm: number;
    descripcion: string;
    tiempoad: number;
}

export interface IconRTM {
    icon: string;
    pack: string;
    alarm: number;
    status?: string;
}

///////////////// Filtro Supervisor //////////

export interface ListSupervisor {
    NameSupervisor: string;
    idSupervisor: string;

}


///////////////// KpiConsolidated ///////////

export interface KpiConsolidated {
    NameCentral: string;
    Tipo: string;
    Nombre: string;
    consolidadoAHT: number;
    consolidadoABN: number;
    consolidadoACD: number;
    consolidadoQueue: number;
    consolidadoNds: number;
}

////////////////// AgentGroup ///////////

export interface AgentGroup {
    NameCentral: string;
    type: string;
    Group: number;
    acd: number;
    aux: number;
    avail: number;
    other: number;
    acw: number;
}