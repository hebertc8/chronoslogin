// tslint:disable-next-line: max-line-length
import { Component, OnInit, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewChild, ViewContainerRef, Input, EventEmitter, Output, ElementRef, ChangeDetectorRef } from '@angular/core';
import { GlobalVariablesService } from '../services/global-variables.service';
import { FilterSelected, ListComponents, Remove } from '../services/interfaces';

@Component({
  selector: 'app-component-factory',
  templateUrl: './component-factory.component.html',
  styleUrls: ['./component-factory.component.scss']
})
export class ComponentFactoryComponent implements OnInit {
  @ViewChild('Component', { static: false, read: ViewContainerRef }) Component;
  @ViewChild('test', { static: false, read: ElementRef }) test: ElementRef;

  @Input() nameComponent: string;
  @Input() index: number;
  @Input() filter: FilterSelected;
  @Output() removeComponent = new EventEmitter();

  componentRef: ComponentRef<any>;

  public icon = { icon: 'question', pack: 'fa' };
  public flipped = false;
  public show = false;
  public source = '';
  public titleFilter = '';
  public load = false;
  public showComponent = false;


  constructor(private resolver: ComponentFactoryResolver, private globalVariable: GlobalVariablesService, private detection: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.init();

  }


  componentFactory(component: any, container: any): ComponentRef<any> {
    // container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(component);
    return this.componentRef = container.createComponent(factory);
  }

  init() {
    const c = this.globalVariable.viewComponents.find(data => data.nameToShow === this.nameComponent);
    console.log(this.nameComponent, c);
    if (c !== undefined) {
      this.icon = c.icon;
      this.source = c.name;
      setTimeout(() => {
        this.componentFactory(c.component, this.Component);
        this.componentRef.instance.filter = this.filter;
        this.componentRef.instance.name = this.source;
        this.componentRef.instance.index = this.index;
        this.componentRef.instance.ready.subscribe(res => {
          // alert('Leega info');
          this.showComponent = true;
          this.refresh();
        });
        // const h = this.test.nativeElement as HTMLElement;
        // console.log(h.getBoundingClientRect());
        console.log('LLegóooooo', this.nameComponent);
      }, 500);
      this.title(c);
    } else {
      console.log('Componente aun no creado', this.nameComponent);
    }
  }

  refresh() {
    this.detection.detectChanges();
    setTimeout(() => {
      this.detection.detectChanges();
    }, 1000);
  }

  remove() {
    const remove: Remove = { index: this.index, name: this.nameComponent, source: this.source };
    this.removeComponent.emit(remove);
  }

  flip() {
    this.flipped = !this.flipped;
    this.show = !this.show;
    if (!this.flipped) {
      this.init();
    }
  }

  title(c: ListComponents) {
    if (this.filter) {

      switch (this.nameComponent) {
        case 'Agent List':
          this.titleFilterAgents();
          break;

        case 'States Map':
          this.titleFilterAgents();
          break;

        case 'Kpi Chart':
          if (this.filter.lobKpi) {
            this.titleFilter = this.filter.indicator + ' ' + this.filter.lobKpi;
          } else if (this.filter.skillKpi) {
            this.titleFilter = this.filter.indicator + ' ' + this.filter.skillKpi;
          }
          break;

        case 'Kpi Consolidated':
          this.titleFilter = this.nameComponent + ': ' + this.filter;
          break;
        case 'Agent Group':
          this.titleFilter = this.nameComponent + ': ' + this.filter;
          break;

        default:
          break;
      }

    } else {
      switch (this.nameComponent) {
        case 'Agent List' || 'States Map':
          this.titleFilter = 'All agents';
          break;

        default:
          this.titleFilter = c.nameToShow;
          break;
      }
    }
  }


  titleFilterAgents() {
    if (this.filter.NES) {
      this.titleFilter = 'Agent Nesting';
    } else if (this.filter.NameSupervisor) {
      this.titleFilter = 'Sup: ' + this.filter.NameSupervisor;
    } else if (this.filter.skill.length !== 0 && this.filter.skill[0] !== null) {
      this.titleFilter = this.filter.skill.join('-');
    } else if (this.filter.subLob.length !== 0 && this.filter.subLob[0] !== null) {
      this.titleFilter = this.filter.subLob.join('-');
    } else if (this.filter.lob.length !== 0 && this.filter.lob[0] !== null) {
      this.titleFilter = this.filter.lob.join('-');
    }
  }




}
