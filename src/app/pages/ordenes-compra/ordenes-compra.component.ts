import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { RequireMatch } from './customValidators';

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
import { StandarResponseHeader } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-ordenes-compra',
  templateUrl: './ordenes-compra.component.html',
  styleUrls: ['./ordenes-compra.component.scss'],
})
export class OrdenesCompraComponent implements OnInit, OnDestroy {
  mainFilterForm: FormGroup;

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

  skus;
  encabezados;

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
    private store: Store<AppState>,
  ) {
    // Validators
    this.mainFilterForm = _formBuilder.group({
      proveedorControl: ['', [Validators.required, RequireMatch]],
      estadosControl: ['', [Validators.required, RequireMatch]],
      fechaInicioControl: [
        moment().subtract(1, 'months'),
        [Validators.required],
      ],
      fechaFinControl: [moment(), [Validators.required]],
    });
    this.onResize();
  }

  //#region REDUX
  ngOnInit() {
    // Se coloca el token en el local storage
    this._route.queryParams.subscribe(token => {
      if (token.token) {
        localStorage.setItem('token', token.token);
      }
    });

    this.start();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
  /**
   * Obtener proveedores y asignarlos en el store
   */
  getProveedores() {
    // Se enciende el Loader
    this.store.dispatch(new actions.GetProvidersRequesAction());
    this._dataService
      .getProveedores()
      .toPromise()
      .then(proveedores => {
        if (proveedores['Value'] && !proveedores['Value'][0]['Código']) {
          this.store.dispatch(
            new actions.GetProvidersSuccessAction(proveedores['Value']),
          );
        } else {
          this.store.dispatch(new actions.GetProvidersFailAction());
        }
      });
  }

  /**
   * Obtener los estados y asignarlos en el store
   */
  getEstados() {
    // Se enciende el loader
    this.store.dispatch(new actions.GetStatesRequestAction());
    this._dataService
      .getEstados()
      .toPromise()
      .then(estados => {
        if (estados['Value'] && !estados['Value'][0]['Código']) {
          this.store.dispatch(
            new actions.GetStatesSuccessAction(estados['Value']),
          );
        } else {
          this.store.dispatch(new actions.GetStatesFailAction());
        }
      });
  }

  start() {
    let y = localStorage.getItem('token');
    if (y) {
      y = Helper.decrypt(y.toString());
      if (!y.split(';')[1] || !y.split(';')[2] || !y.split(';')[3]) {
        this.errorMessage = 'Datos de inicio de sesión incorrectos.';
        this.usr = '';
        return;
      }
      this.usr = y.split(';')[1];
      this.key = y.split(';')[2];
      this.TOKEN = y.split(';')[3];
      localStorage.setItem('user', this.usr);
      // Se obtienen proveedores y estados
      this.getProveedores();
      this.getEstados();

      this.store.subscribe(store => {
        this.render = store.encabezadosOC.encabezados.length > 0;
        this.skus = store.cambioEstado.skus;
        this.encabezados = store.encabezadosOC.encabezados;
      });
    }
  }
  consultar(queryConsultar) {
    this.store.dispatch(new actions.GetEncabezadosOCRequestAction());
    this._componentService.isLoading.next(true);
    this._dataService
      .postTablaPrincipalOC(queryConsultar)
      .toPromise()
      .then((data: StandarResponseHeader) => {
        if (data.Value && data.Value[0]['Código']) {
          this.tableMessage = data['Value'][0]['Mensaje'];
          this.store.dispatch(new actions.GetEncabezadosOCFailAction());
        } else {
          this.store.dispatch(
            new actions.GetEncabezadosOCSuccessAction(data.Value),
          );
        }
        this._componentService.isLoading.next(false);
      });
  }

  setSkus() {
    if (this.skus.length > 0) {
      console.log('Dialogo de cambio de estado.');
    }
  }
  exportXlsx() {
    if (this.encabezados.length > 0) {
      this._excelExport.exportAsExcelFile(
        this.encabezados,
        'Ordenes_de_compra_' + this.proveedor,
      );
    }
  }
  //#endregion REDUX

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
              ciudad: data['Value'][0].CODIGO_DANE_DESTINO,
            });
            this._componentService.direccionOrigen.next({
              direccion: data['Value'][0].DIRECCION_ORIGEN,
              ciudad: data['Value'][0].CODIGO_DANE_ORIGEN,
            });
          });
        this._componentService.fechasOC.next({
          FECHA_MAXIMA_OC: element.FECHA_MAXIMA_OC,
          FECHA_MINIMA_OC: element.FECHA_MINIMA_OC,
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
            },
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
          p_usuario: this._componentService.user.value,
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
          estados: this.estados,
        },
      },
      panelClass: 'dialog-detalles',
      disableClose: false,
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
        },
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
          proveedor: null,
        },
      },
      panelClass: 'dialog-detalles',
      disableClose: false,
    };
    this.cambioEstadoSubscription = this._dialogService
      .openCambioEstado(dialogData)
      .toPromise()
      .then(
        () => {
          this.consultar('');
          this.selection.clear();
        },
        error => {
          this._toastr.error(error);
        },
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
          usr: this.usr,
        },
      },
      panelClass: 'dialog-detalles',
      disableClose: false,
    };
    this.guiaSubscription = this._dialogService
      .openGuiaOrden(dialogData)
      .toPromise()
      .then(
        () => {
          this.refreshData();
        },
        error => this._toastr.error(error),
      );
  }

  refreshData() {
    // this.filterInput.reset();
    this.consultar('');
  }
}
