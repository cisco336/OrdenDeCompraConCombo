import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith, skip } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { RequireMatch } from './customValidators';
import {
  animate,
  state,
  style,
  transition,
  trigger,
  query,
  stagger,
  animateChild
} from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { ExportAsExcelFileService } from 'src/app/services/export-as-excel-file.service';
import { ComponentsService } from 'src/app/services/components.service';
import { Estado, Proveedores, OrdenDeCompra } from '../../models/models';
import { HostListener } from '@angular/core';
import * as moment from 'moment';
import * as constants from '../../constants/constants';
import { DialogService } from 'src/app/services/dialog.service';
import { Helper } from 'src/app/common/helper.class';

// REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as actions from '../../redux/actions/';

@Component({
  selector: 'app-ordenes-compra',
  templateUrl: './ordenes-compra.component.html',
  styleUrls: ['./ordenes-compra.component.scss'],
  animations: [
    trigger('entering', [
      transition('* <=> *', [
        // each time the binding value changes
        query(
          ':leave',
          [
            stagger(100, [
              animate(
                '0.5s',
                style({ opacity: 0, transform: 'translateY(-100px)' })
              )
            ]),
            query('@child', [animateChild()], { optional: true })
          ],
          { optional: true }
        ),
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(100px)' }),
            stagger(50, [
              animate('0.5s', style({ opacity: 1, transform: 'translateY(0)' }))
            ]),
            query('@child', [animateChild()], { optional: true })
          ],
          { optional: true }
        )
      ])
    ]),
    trigger('child', [
      state(
        'true',
        style({ transform: 'translateX(0)', opacity: 1, height: '*' })
      ),
      state(
        'false',
        style({ transform: 'translateX(200px)', opacity: 0, height: 0 })
      ),
      transition('0 => 1', animate('.5s ease-out')),
      transition('1 => 0', animate('.5s ease-out'))
    ]),
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.2s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        // each time the binding value changes
        query(
          ':leave',
          [stagger(100, [animate('0.5s', style({ opacity: 0 }))])],
          { optional: true }
        ),
        query(
          ':enter',
          [
            style({ opacity: 0 }),
            stagger(100, [animate('0.5s', style({ opacity: 1 }))])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class OrdenesCompraComponent implements OnInit, OnDestroy {
  mainFilterForm: FormGroup;
  filter: FormControl;
  proveedores: Proveedores[] = [];
  estados: Estado[] = [];
  expandedElement: OrdenDeCompra;
  queryDetallesDialog: {
    p_transaccion: string;
    p_pmg_po_number: string;
    p_vpc_tech_key: string;
    p_fecha_inicio: string;
    p_fecha_fin: string;
    p_fecha_real: string;
    p_id_estado: string;
    p_origen: string;
    p_usuario: string;
  };
  displayedColumns: string[] = ['Select', 'PMG_PO_NUMBER', 'AUX', 'ACTIONS'];
  aux: any;
  screenHeight = 0;
  screenWidth = 0;
  dataSource;
  selection = new SelectionModel<OrdenDeCompra>(true, []);

  proveedor;
  tableMessage = '';
  date: any;
  filteredProveedores: Observable<Proveedores[]>;
  filteredEstados: Observable<Estado[]>;
  fechaInicioSubscription;
  fechaFinSubscription;
  routeSubscription;
  proveedoresControlSubscription;
  cambioEstadoSubscription;
  detallesSubscription;
  guiaSubscription;

  usr = '';
  key = '';
  TOKEN = '';

  isLoading = true;
  noData = false;
  render = false;

  // Textos
  tooltips = constants.tooltips;
  matFormFieldText = constants.matFormFieldText;
  errorMessagesText = constants.errorMessagesText;
  strings = constants.strings;
  longMessages = constants.longMessages;
  errorMessage = '';
  helper = Helper;

  filterInput = new FormControl('', []);

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  constructor(
    public _dialog: MatDialog,
    _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _route: ActivatedRoute,
    private _dataService: DataService,
    private _excelExport: ExportAsExcelFileService,
    private _componentService: ComponentsService,
    private _dialogService: DialogService,
    private store: Store<AppState>
  ) {
    // Validators
    this.mainFilterForm = _formBuilder.group({
      proveedorControl: ['', [Validators.required, RequireMatch]],
      estadosControl: ['', [Validators.required, RequireMatch]],
      fechaInicioControl: [
        moment().subtract(1, 'months'),
        [Validators.required]
      ],
      fechaFinControl: [moment(), [Validators.required]]
    });
    this.onResize();
  }

  //#region REDUX
  /**
   * Obtener proveedores y asignarlos en el store
   */
  getProveedores() {
    // Se enciende el Loader
    this._dataService
      .getProveedores()
      .toPromise()
      .then(
        proveedores => {
          this.store.dispatch(
            new actions.GetProvidersSuccessAction(proveedores['Value'])
          );
        },
        () => {
          this.store.dispatch(new actions.GetProvidersFailAction());
        }
      );
  }

  /**
   * Obtener los estados y asignarlos en el store
   */
  getEstados() {
    this._dataService.getEstados()
      .toPromise()
      .then(estados => {
        this.store.dispatch(new actions.GetStatesSuccessAction(estados['Value']));
      }, () => {
          this.store.dispatch(new actions.GetStatesFailAction());
      });
  }
  //#endregion REDUX

  exportXlsx() {
    this._excelExport.exportAsExcelFile(
      this.dataSource.data,
      'Ordenes_de_compra_' + this.proveedor
    );
  }

  ngOnInit() {
    debugger
    this.routeSubscription = this._route.params;
    this._route.queryParams.pipe(skip(0)).subscribe(params => {
      if (!params['token']) {
        this.usr = '';
        this._componentService.isLoading.next(false);
        this.errorMessage = this.errorMessagesText.noPrivileges;
      } else {
        // const y = Helper.decrypt(params.token.toString());

        const y = params['token'];

        if (!y.split(';')[1] || !y.split(';')[2] || !y.split(';')[3]) {
          this.errorMessage = 'Datos de inicio de sesión incorrectos.';
          this.usr = '';
        }
        this.usr = y.split(';')[1];
        this.key = y.split(';')[2];
        this.TOKEN = y.split(';')[3];

        // REDUX
        this.getProveedores();
        this.getEstados();
        // REDUX

        this.appStart(this.key);
        this._componentService.user.next(this.usr);
        localStorage.setItem('user', this.usr);

        // if (this.TOKEN) {
        //   try {
        //     this._dataService.setToken(this.TOKEN);
        //   } catch (error) {
        //     this._toastr.error('Error al decodificar token');
        //   }
        //   this._dataService.getAutorizar().subscribe(
        //     data => {
        //       if (data) {
        //         this._componentService.user.next(this.usr);
        //         this.appStart(this.key);
        //       }
        //     },
        //     error => {
        //       switch (error.status) {
        //         case 401:
        //           this._toastr.warning('Usuario No autorizado.');
        //           break;
        //         case 500:
        //           this._toastr.error('Error en el servicio de autorización.');
        //           break;
        //         default:
        //           this._toastr.error('Error de comunicación.');
        //           break;
        //       }
        //       this._componentService.isLoading.next(false);
        //     }
        //   );
        // }
      }
    });
  }

  appStart(key?) {
    // this._dataService
    //   .getProveedores()
    //   .toPromise()
    //   .then(
    //     getProveedoresData => {
    //       if (
    //         !getProveedoresData['Estado'] ||
    //         getProveedoresData['Value'][0]['Código']
    //       ) {
    //         this.errorHandling(this.errorMessagesText.providersError);
    //         this._componentService.isLoading.next(false);
    //       } else {
    //         this.proveedores = getProveedoresData['Value'];

            // this.filteredProveedores = this.mainFilterForm
            //   .get('proveedorControl')
            //   .valueChanges.pipe(
            //     startWith(''),
            //     map(value =>
            //       typeof value === 'string' ? value : value.DESCRIPCION
            //     ),
            //     map(descripcion =>
            //       descripcion
            //         ? this._filterProveedor(descripcion)
            //         : this.proveedores.slice()
            //     )
            //   );
    
    //         if (this.proveedores.length === 1) {
    //           this.mainFilterForm
    //             .get('proveedorControl')
    //             .setValue(this.proveedores[0]);
    //           this.mainFilterForm.get('proveedorControl').disable();
    //           this.proveedor = this.proveedores[0]['NOMBRE_PROVEEDOR'];
    //         } else {
    //           this.proveedoresControlSubscription = this.mainFilterForm
    //             .get('proveedorControl')
    //             .valueChanges.subscribe(data => {
    //               this.proveedor = data.DESCRIPCION;
    //             });
    //         }
    //         this._dataService
    //           .getEstados()
    //           .toPromise()
    //           .then(
    //             data => {
    //               if (
    //                 !data['Estado'] ||
    //                 data['Value'][0]['Código'] ||
    //                 data['Value'][0]['ID_ERROR']
    //               ) {
    //                 this.errorHandling(this.errorMessagesText.statesError);
    //                 this.render = false;
    //                 this._componentService.isLoading.next(false);
    //               } else {
    //                 this._componentService.isLoading.next(false);
    //                 this._componentService.estados.next(data['Value']);
    //                 this.estados = data['Value'];
    //                 const x = this.estados[0];
    //                 x.DESCRIPCION =
    //                   x.DESCRIPCION.charAt(0).toUpperCase() +
    //                   x.DESCRIPCION.substr(1).toLowerCase();
    //                 this.mainFilterForm.get('estadosControl').setValue(x);
    //                 this._componentService.isLoading.next(false);
    //                 this._componentService.estados.next(this.estados);
    //                 this.filteredEstados = this.mainFilterForm
    //                   .get('estadosControl')
    //                   .valueChanges.pipe(
    //                     startWith(''),
    //                     map(value =>
    //                       typeof value === 'string' ? value : value.DESCRIPCION
    //                     ),
    //                     map(descripcion =>
    //                       descripcion
    //                         ? this._filterEstados(descripcion)
    //                         : this.estados.slice()
    //                     )
    //                   );
    //                 const form = this.mainFilterForm;
    //                 this.queryDetallesDialog = {
    //                   p_transaccion: 'GD',
    //                   p_pmg_po_number: null,
    //                   p_vpc_tech_key: form.get('proveedorControl').value['ID'],
    //                   p_fecha_inicio: form
    //                     .get('fechaInicioControl')
    //                     .value.format('DD/MM/YYYY'),
    //                   p_fecha_fin: form
    //                     .get('fechaFinControl')
    //                     .value.format('DD/MM/YYYY'),
    //                   p_fecha_real: '-1',
    //                   p_id_estado: form.get('estadosControl').value.ID,
    //                   p_origen: '-1',
    //                   p_usuario: this._componentService.user.value
    //                 };
    //               }
    //             },
    //             error => {
    //               this.errorHandling(error);
    //               this.mainFilterForm
    //                 .get('estadosControl')
    //                 .setErrors({ incorrect: true });
    //               this.mainFilterForm.get('estadosControl').disable();
    //               this._componentService.isLoading.next(false);
    //             }
    //           );
    //         this.fechaInicioSubscription = this.mainFilterForm
    //           .get('fechaInicioControl')
    //           .valueChanges.subscribe(() => {
    //             this.compareDates();
    //           });
    //         this.fechaFinSubscription = this.mainFilterForm
    //           .get('fechaFinControl')
    //           .valueChanges.subscribe(() => {
    //             this.compareDates();
    //           });

    //         this.render = true;
    //       }
    //     },
    //     error => {
    //       this.errorHandling(error);
    //     }
    //   );
  }

  errorHandling(error) {
    let toastrError;
    switch (error.status) {
      case 0:
        toastrError = this.errorMessagesText.error0;
        break;
      case 401:
        toastrError = this.errorMessagesText.error401;
        break;
      case 404:
        toastrError = this.errorMessagesText.error404;
        break;
      case 500:
        toastrError = this.errorMessagesText.error500;
        break;
      case undefined:
        toastrError = error;
        break;
      default:
        toastrError = this.errorMessagesText.errorUnknown;
        break;
    }
    this._toastr.error(toastrError);
    this.noData = true;
    this._componentService.isLoading.next(false);
  }

  ngOnDestroy() {
    this.fechaInicioSubscription.unsubscribe();
    this.fechaFinSubscription.unsubscribe();
    this.proveedoresControlSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    // this.cambioEstadoSubscription.unsubscribe();
    // this.detallesSubscription.unsubscribe();
    // this.guiaSubscription.unsubscribe();
  }

  consultar() {
    this._componentService.isLoading.next(true);
    if (this.dataSource !== undefined) {
      this.dataSource.data = [];
    }
    const form = this.mainFilterForm;
    const queryConsultar = {
      p_transaccion: 'GE',
      p_pmg_po_number: -1,
      p_prd_lvl_child: -1,
      p_vpc_tech_key: form.get('proveedorControl').value['ID'],
      p_fecha_inicio: form.get('fechaInicioControl').value.format('DD/MM/YYYY'),
      p_fecha_fin: form.get('fechaFinControl').value.format('DD/MM/YYYY'),
      p_fecha_real: '-1',
      p_id_estado: form.get('estadosControl').value.ID,
      p_origen: '-1',
      p_usuario: this._componentService.user.value
    };

    this._dataService
      .postTablaPrincipalOC(queryConsultar)
      .toPromise()
      .then(
        data => {
          this.tableMessage = '';
          this.dataSource = new MatTableDataSource();
          if (data['Value'] && data['Value'][0]['Código']) {
            this.dataSource._data.next([]);
            this.tableMessage = data['Value'][0]['Mensaje'];
          } else {
            this.tableMessage = '';
            this.dataSource.data = data['Value'];
          }
          this._componentService.isLoading.next(false);
        },
        error => {
          this.errorHandling(error);
          this._componentService.isLoading.next(false);
        }
      );
  }

  compareDates() {
    const form = this.mainFilterForm;
    if (
      this.mainFilterForm &&
      new Date(form.get('fechaFinControl').value) <
        new Date(form.get('fechaInicioControl').value)
    ) {
      form.get('fechaInicioControl').setErrors({ incorrect: true });
      form.get('fechaFinControl').setErrors({ incorrect: true });
      this._toastr.error(this.errorMessagesText.startEndDateError);
    } else {
      if (this.mainFilterForm.get('fechaInicioControl').value !== '') {
        form.get('fechaInicioControl').setErrors(null);
      }
      if (this.mainFilterForm.get('fechaFinControl').value !== '') {
        form.get('fechaFinControl').setErrors(null);
      }
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: OrdenDeCompra): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row[
      'Orden'
    ] + 1}`;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayProveedor(data?: Proveedores): string | undefined {
    return data ? data.DESCRIPCION : undefined;
  }

  displayEstados(data?: Estado): string | undefined {
    return data ? data.DESCRIPCION : undefined;
  }

  private _filterProveedor(DESCRIPCION: string): Proveedores[] {
    const filterValue = DESCRIPCION.toLowerCase();

    return this.proveedores.filter(
      option => option.DESCRIPCION.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  private _filterEstados(DESCRIPCION: string): Estado[] {
    const filterValue = DESCRIPCION.toLowerCase();

    return this.estados.filter(
      option => option.DESCRIPCION.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  getOrdenDetalle(element, guiaOrden?) {
    if (element) {
      this._componentService.generaGuia.next(element.GENERA_GUIA);
      if (!this.aux) {
        this.aux = true;
        this.queryDetallesDialog.p_pmg_po_number = element.PMG_PO_NUMBER;
        this._dataService
          .GetInfoBaseOc(element.PMG_PO_NUMBER)
          .toPromise()
          .then(data => {
            this._componentService.detalleOC.next(data['Value'][0]);
            this._componentService.direccionDestino.next({
              direccion: data['Value'][0].DIRECCION_ENTREGA,
              ciudad: data['Value'][0].CODIGO_DANE_DESTINO
            });
            this._componentService.direccionOrigen.next({
              direccion: data['Value'][0].DIRECCION_ORIGEN,
              ciudad: data['Value'][0].CODIGO_DANE_ORIGEN
            });
          });
        this._componentService.fechasOC.next({
          FECHA_MAXIMA_OC: element.FECHA_MAXIMA_OC,
          FECHA_MINIMA_OC: element.FECHA_MINIMA_OC
        });
        this._dataService
          .postTablaPrincipalOC(this.queryDetallesDialog)
          .toPromise()
          .then(
            result => {
              this.aux = false;
              if (result) {
                this._componentService.detalleOC.next(result['Value']);
                if (guiaOrden) {
                  this.generateGuide();
                } else {
                  this.openDialogDetalles();
                }
              }
            },
            error => {
              this.aux = false;
              this.errorHandling(error);
            }
          );
        const form = this.mainFilterForm;
        const queryTracking = {
          p_transaccion: 'TR',
          p_pmg_po_number: element.PMG_PO_NUMBER,
          p_prd_lvl_child: -1,
          p_vpc_tech_key: form.get('proveedorControl').value['ID'],
          p_fecha_inicio: form
            .get('fechaInicioControl')
            .value.format('DD/MM/YYYY'),
          p_fecha_fin: form.get('fechaFinControl').value.format('DD/MM/YYYY'),
          p_fecha_real: '-1',
          p_id_estado: form.get('estadosControl').value.ID,
          p_origen: '-1',
          p_usuario: this._componentService.user.value
        };
        this._dataService
          .postTablaPrincipalOC(queryTracking)
          .toPromise()
          .then(data => {
            this._componentService.tracking.next(data);
            if (data['Value'][0]['Código'] === '4') {
              this._componentService.isTracking.next(false);
            } else {
              this._componentService.isTracking.next(true);
            }
          })
          .catch(() => {
            this._toastr.error(this.errorMessagesText.trackingError);
          });
      }
    } else {
      this._toastr.error('Error al obtener detalles.');
    }
  }
  openDialogDetalles() {
    this._componentService.queryDetalles.next(this.queryDetallesDialog);
    const dialogData = {
      maxWidth: '1100px',
      width: '95vw',
      maxHeight: '90vh',
      data: {
        data: {
          queryDetalles: this.queryDetallesDialog,
          ordenCompra: this._componentService.detalleOC.value,
          usr: this.usr,
          estados: this.estados
        }
      },
      panelClass: 'dialog-detalles',
      disableClose: false
    };
    this.detallesSubscription = this._dialogService
      .openDetalle(dialogData)
      .toPromise()
      .then(
        () => {
          this.refreshData();
        },
        error => {
          this._toastr.error(error);
        }
      );
  }
  cambioEstadoDialog() {
    const dialogData = {
      maxWidth: '900px',
      width: '95vw',
      maxHeight: '95vh',
      data: {
        data: {
          selected: this.selection.selected,
          usr: this.usr,
          proveedor: null
        }
      },
      panelClass: 'dialog-detalles',
      disableClose: false
    };
    this.cambioEstadoSubscription = this._dialogService
      .openCambioEstado(dialogData)
      .toPromise()
      .then(
        () => {
          this.consultar();
          this.selection.clear();
        },
        error => {
          this._toastr.error(error);
        }
      );
  }
  generateGuide() {
    const dialogData = {
      maxWidth: '900px',
      width: '95vw',
      maxHeight: '95vh',
      data: {
        data: {
          queryDetalles: null,
          ordenCompra: this._componentService.detalleOC.value,
          usr: this.usr
        }
      },
      panelClass: 'dialog-detalles',
      disableClose: false
    };
    this.guiaSubscription = this._dialogService
      .openGuiaOrden(dialogData)
      .toPromise()
      .then(
        () => {
          this.refreshData();
        },
        error => this._toastr.error(error)
      );
  }

  refreshData() {
    this.filterInput.reset();
    this.consultar();
  }
}
