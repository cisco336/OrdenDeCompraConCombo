import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ComponentsService } from 'src/app/services/components.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { Estado, QueryBulto } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import * as strings from '../../constants/constants';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Subscription } from 'rxjs';
import * as Interfaces from '../../interfaces/interfaces';
import { DialogService } from 'src/app/services/dialog.service';
import { MatStepper } from '@angular/material';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-stepper-detalles',
  templateUrl: './stepper-detalles.component.html',
  styleUrls: ['./stepper-detalles.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  animations: [
    trigger('show', [
      state(
        'true',
        style({ transformOrigin: '50% 0%', opacity: 1, height: '*' })
      ),
      state(
        'false',
        style({ transformOrigin: '50% 0%', opacity: 0, height: 0 })
      ),
      transition('0 => 1', animate('.5s ease-out')),
      transition('1 => 0', animate('.5s ease-out'))
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.2s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class StepperDetallesComponent implements OnInit, OnDestroy {
  @Input() details: boolean;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedSku;
  cambioEstadoSkus;
  estadosSubscription: Subscription;
  getSelectedSkuSubscription: Subscription;
  estados: Estado[] = [];
  strings = strings;
  queryResponse = '';
  error: number;
  showQueryResponse = false;
  oc: any;
  skus: any;
  selectedSkuSubscription: Subscription;
  queryBulto: Interfaces.QueryBulto = {
    Transaccion: '',
    Sticker: '',
    ID_BULTO: 0,
    Ordencompra: this.oc,
    Cantidad: -1,
    Sku: '-1',
    Magnitudes: [
      {
        cantidad: -1,
        IdDetalle: -1,
        largo: -1,
        ancho: -1,
        alto: -1,
        peso: -1,
        declarado: -1
      }
    ],
    Usuario: this._componentService.getUser().value
  };
  stepOne: boolean;
  stepTwo: boolean;
  stepThree: boolean;
  stepFour: boolean;
  stepsSubscription: Subscription;
  packageConfigSubscription: Subscription;
  packageConfirmSubscription: Subscription;
  magnitudes: any[] = [];
  finalMessg: string;
  stepThreeMessg = '';
  isLoading = false;
  queryRotulo;
  guideQuery: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _componentService: ComponentsService,
    private _bottomSheet: MatBottomSheet,
    private _dataService: DataService,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    this._componentService.aux.subscribe(val => this.stepOne = val);
    this.finalMessg = strings.longMessages.generateOrderGuideAlertFinal;
    this.stepOne = false;
    this.magnitudes = this._componentService.getMagnitudes().value;
    this.stepsSubscription = this._componentService
      .getSteps()
      .subscribe(change => {
        this.stepTwo = change.two;
        this.stepThree = change.three;
        this.stepFour = change.four;
      });
    this._componentService.setHasDetails(this.details);
    if (this.details) {
      this.hasDetails();
    } else {
      this.noDetails();
    }
  }

  hasDetails() {
    this.estadosSubscription = this._componentService
      .getEstados()
      .subscribe(estados => (this.estados = estados));
    this.firstFormGroup = this._formBuilder.group({
      selectedSkuControl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.selectedSkuSubscription = this._componentService
      .getSelectedSku()
      .subscribe(skusSub => {
        this.cambioEstadoSkus = skusSub;
        if (skusSub.length) {
          this.selectedSku = skusSub.filter(
            s => s.GUIA === 'NA' || s.GUIA === '--'
          );
        }
        if (this.hasDetails) {
          if (this.selectedSku) {
            this.stepOne = this.selectedSku && this.selectedSku.length > 0;
          } else {
            this.stepOne = false;
          }
        } else if (this.selectedSku && this.selectedSku.length > 0) {
          this.stepOne = true;
        } else {
          this.stepOne = false;
        }
      });
  }

  noDetails() {
    const detalleOC = this._componentService.getDetalleOC().value;
    this.oc = detalleOC[0]['PMG_PO_NUMBER'];
    this.skus = detalleOC.map(
      number =>
        (number = {
          guia: number['GUIA'],
          sku: number['PRD_LVL_NUMBER'],
          description: number['PRD_NAME_FULL']
        })
    ).filter(s => s.guia === '--' || s.guia === 'NA');
    this.stepOne = this.skus.length > 0;
  }
  openBottomSheet(): void {
    const sheet = this._bottomSheet.open(BottomSheetComponent, {
      data: { estados: this.estados, minWidth: '95vw' },
      disableClose: false
    });
    sheet
      .afterDismissed()
      .toPromise()
      .then(
        response => {
          if (response && response['ID'] > 0) {
            this.cambioEstado(response);
          }
        },
        () => {
          this.showQueryResponse = true;
          this.queryResponse = strings.errorMessagesText.errorUnknown;
          setTimeout(() => (this.showQueryResponse = false), 2000);
        }
      );
  }

  cambioEstado(response) {
    const query = {
      p_transaccion: 'US',
      p_pmg_po_number: null,
      p_prd_lvl_child: null,
      p_vpc_tech_key: '-1',
      p_fecha_inicio: '-1',
      p_fecha_fin: '-1',
      p_fecha_real: response.fecha_real,
      p_id_estado: response.ID,
      p_origen: '-1',
      p_usuario: this._componentService.getUser().value
    };
    this.cambioEstadoSkus.forEach(data => {
      query.p_pmg_po_number = data.PMG_PO_NUMBER;
      query.p_prd_lvl_child = data.PRD_LVL_CHILD;
      const postTablaPrincipalOC = this._dataService
        .postTablaPrincipalOC(query)
        .toPromise()
        .then(
          resolve => {
            this.showQueryResponse = true;
            this.queryResponse = resolve['Value'][0]['MENSAJE'];
            this.error = resolve['Value'][0]['ID'];
            setTimeout(() => (this.showQueryResponse = false), 5000);
            this.refreshTable();
          },
          reject => {
            this.showQueryResponse = true;
            this.queryResponse = reject['Mensaje'];
            setTimeout(() => (this.showQueryResponse = false), 5000);
            this.refreshTable();
          }
        );
    });
  }

  refreshTable() {
    this._dataService
      .postTablaPrincipalOC(this._componentService.getQueryDetalles().value)
      .toPromise()
      .then(data => {
        this._componentService.setTablaDetalles(data['Value']);
      });
  }

  sendPackages(stepper: MatStepper) {
    if (this._componentService.getIdBulto().value !== '') {
      const query: QueryBulto = {
        Transaccion: 'UD',
        ID_BULTO: this._componentService.getIdBulto().value,
        Sticker: '',
        Ordencompra: 0,
        Cantidad: 0,
        Sku: '',
        Magnitudes: this._componentService.getMagnitudes().value,
        Usuario: this._componentService.getUser().value
      };
      this._dataService
        .PostBultos(query)
        .toPromise()
        .then(response => {
          this._componentService.setSteps({
            two: this._componentService.getSteps().value.two,
            three: true,
            four: false
          });
          stepper.next();
        })
        .catch(() => {
          this.stepThreeMessg = strings.errorMessagesText.errorGeneratingGuide;
          setTimeout(() => {
            this.isLoading = false;
            this.stepThreeMessg = '';
          }, 3000);
        });
    }
  }

  buildBody(stepper: MatStepper) {
    const x = this._componentService;
    const query = {
      Transportadora: x.getInfoBaseOC().value['TRANSPORTADORA'],
      CodigoInterno: x.getInfoBaseOC().value['PMG_PO_NUMBER'],
      IdBulto: x.getIdBulto().value,
      Sku: x.getClearSkus().value,
      Direccion: x.getDireccionOrigen().value.direccion || null,
      CodDane: x.getDireccionOrigen().value.ciudad['ID'] || null,
      info_cubicacion: x.getMagnitudes().value
    };
    this._dataService
      .PostInfoGuia(query)
      .toPromise()
      .then(response => {
        this.isLoading = true;
        this._componentService.setSteps({
          two: this._componentService.getSteps().value.two,
          three: this._componentService.getSteps().value.three,
          four: true
        });
        if (response['State']) {
          this.guideQuery = response['Value']['Body']['RestGuiaEnviaReq'];
          stepper.next();
          this.isLoading = false;
        } else {
          this.stepThreeMessg = strings.errorMessagesText.errorGeneratingGuide;
          setTimeout(() => {
            this.isLoading = false;
            this.stepThreeMessg = '';
          }, 3000);
        }
      })
      .catch(() => {
        this.stepThreeMessg = strings.errorMessagesText.errorGeneratingGuide;
        setTimeout(() => {
          this.isLoading = false;
          this.stepThreeMessg = '';
        }, 3000);
      });
  }

  ngOnDestroy() {
    if (this.selectedSkuSubscription) {
      this.selectedSkuSubscription.unsubscribe();
    }
    this.stepsSubscription.unsubscribe();
    if (this.packageConfigSubscription) {
      this.packageConfigSubscription.unsubscribe();
    }
  }

  generarGuia(stepper: MatStepper) {
    this._dataService
      .PostSolicitarGuia(this.guideQuery)
      .toPromise()
      .then(data => {
        this.isLoading = true;
        const y = this._componentService;
        this.queryRotulo = {
          Sticker: y.getInfoBaseOC().value.STICKER,
          CodigoDaneOrigen: y.getInfoBaseOC().value.CODIGO_DANE_ORIGEN,
          DireccionOrigen: y.getInfoBaseOC().value.DIRECCION_ORIGEN,
          CodigoDaneDestino: y.getInfoBaseOC().value.CODIGO_DANE_DESTINO,
          DireccionDestino: y.getInfoBaseOC().value.DIRECCION_ENTREGA,
          Guia: data['guia'],
          UrlGuia: data['urlguia'],
          UrlRotulo: `${Constants.PATHROTULO}Guia=${data['guia']}&Usuario=${Constants.USR}`,
          OrdenServicio: data['num_ordens'],
          IdBulto: y.getIdBulto().value,
          Usuario: y.getUser().value || 'ACEL03'
        };
        this._dataService
          .SetDatosGuia(this.queryRotulo)
          .toPromise()
          .then(guideQueryResponse => {
            this.isLoading = false;
            this.finalMessg = strings.longMessages.generateGuideSuccess;
            this._componentService.setCloseDialog(true);
          })
          .catch(() => {
            this.isLoading = false;
            this.finalMessg = strings.errorMessagesText.errorGeneratingGuide;
          });
      })
      .catch(error => {
        this.stepThreeMessg = error['error']['respuesta'];
        setTimeout(() => {
          this.stepThreeMessg = '';
          this.isLoading = false;
        }, 3000);
      });
  }
}
