import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  DetalleOrdenDeCompra,
  Estado,
  InfoBaseOC
} from 'src/app/interfaces/interfaces';
import { ComponentsService } from 'src/app/services/components.service';
import {
  trigger,
  state,
  query,
  animateChild,
  style,
  transition,
  animate
} from '@angular/animations';
import { DataService } from 'src/app/services/data.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { BottomSheetImgComponent } from '../bottom-sheet-img/bottom-sheet-img.component';
import * as strings from '../../constants/constants';

@Component({
  selector: 'app-dialog-detalles',
  templateUrl: './dialog-detalles.component.html',
  styleUrls: ['./dialog-detalles.component.scss'],
  animations: [
    trigger('cardGroup', [
      state('true', style({ opacity: 1, height: '*' })),
      state('false', style({ opacity: 0, height: 0 })),
      transition('*<=>*', [
        animate('5s ease-out'),
        query('*', [query('@card', [animateChild()], { optional: true })], {
          optional: true
        })
      ])
    ]),
    trigger('card', [
      state(
        'true',
        style({
          position: 'relative',
          transform: 'translateY(0)',
          visibility: 'visible'
        })
      ),
      state(
        'false',
        style({
          position: 'absolute',
          transform: 'translateY(-200px)',
          visibility: 'hidden'
        })
      ),
      transition('0 <=> 1', animate('.2s ease-out'))
    ])
  ]
})
export class DialogDetallesComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: false }) stepper;
  background: string;
  color: string;
  ordenCompra: DetalleOrdenDeCompra[] = [];
  estados: Estado[] = [];
  mostrarCambioBotton = false;
  skus: any[] = [];
  public infoBaseOC: InfoBaseOC = {
    CEDULA: 0,
    CLIENTE: '',
    TELEFONOS: '',
    DIRECCION_CTE: '',
    CIUDAD_CTE: '',
    DIRECCION_ENTREGA: '',
    CIUDAD_ENTREGA: '',
    PMG_PO_NUMBER: 0,
    TIPO_ENTREGA: '',
    STICKER: '',
    ORIGEN: '',
    NOTA_PEDIDO: '',
    PROVEEDOR: '',
    GUIA: '',
    CUMPLIDO: '',
    TRANSPORTADORA: ''
  };
  numeroOrden = 0;
  strings = strings;
  cliente: boolean;
  entrega: boolean;
  observaciones: boolean;
  GetInfoBaseOcSubscription;
  ciudad;
  direccionDestino;
  error = '';
  fechasOC;

  constructor(
    public dialogRef: MatDialogRef<DialogDetallesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _componentService: ComponentsService,
    private _dataService: DataService,
    private _bottomSheet: MatBottomSheet
  ) {}
  ngOnInit() {
    this.fechasOC = this._componentService.fechasOC.value;
    this._componentService.setCloseDialog(false);
    this._componentService.setSteps({
      two: false,
      three: false,
      four: false
    });
    this._componentService.closeDialog().subscribe(close => {
      if (close) {
        setTimeout(() => this.closeDialog(), 3000);
      }
    });
    this.estados = this.data.data.estados;
    this.ordenCompra = this.data.data.ordenCompra;
    const ordenNumber = this.ordenCompra[0].PMG_PO_NUMBER;
    this._componentService.setTablaDetalles(this.ordenCompra);
    this.GetInfoBaseOcSubscription = this._dataService
      .GetInfoBaseOc(ordenNumber)
      .toPromise()
      .then(data => {
        this.direccionDestino = data['Value'][0]['DIRECCION_ENTREGA'];
        this._dataService
          .GetCiudades('DANESAPS')
          .toPromise()
          .then(ciudades => {
            this.ciudad = ciudades;
            this.ciudad = this.ciudad.filter(
              s => s.ID === data['Value'][0]['CODIGO_DANE_DESTINO']
            )[0]['DESCRIPCION'];
          })
          .catch(() => {
            this.error = strings.errorMessagesText.citiesError;
            setTimeout(() => (this.error = ''), 3000);
          });
        this._componentService.setInfoBaseOC(data['Value'][0]);
        this.infoBaseOC = data['Value'][0];
        const address = this._componentService.infoBaseOC.value;
        this._componentService.setDireccionDestino({
          direccion: address.DIRECCION_ENTREGA,
          ciudad: address.CODIGO_DANE_DESTINO
        });
        this._componentService.setDireccionOrigen({
          direccion: address.DIRECCION_ORIGEN,
          ciudad: address.CODIGO_DANE_ORIGEN
        });
        if (this.infoBaseOC['Código'] === '4') {
          this.cliente = false;
          this.entrega = false;
        } else {
          this.cliente =
            this.infoBaseOC.CEDULA === undefined &&
            this.infoBaseOC.TELEFONOS === undefined &&
            this.infoBaseOC.DIRECCION_CTE === undefined &&
            this.infoBaseOC.CIUDAD_CTE === undefined
              ? false
              : true;
          this.entrega =
            this.infoBaseOC.DIRECCION_ENTREGA === undefined &&
            this.infoBaseOC.CIUDAD_ENTREGA === undefined &&
            this.infoBaseOC.TRANSPORTADORA === undefined &&
            this.infoBaseOC.GUIA === undefined &&
            this.infoBaseOC.CUMPLIDO === undefined
              ? false
              : true;
        }
      });
    this.numeroOrden = this.ordenCompra[0].PMG_PO_NUMBER;
    this.background = this.background ? '' : 'primary';
    this.color = this.color ? '' : 'accent';
    this.skus = this._componentService.getSelectedSku().value;
  }

  ngOnDestroy() {}

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent, {
      data: { estados: this.estados }
    });
  }

  refreshTable() {
    this._dataService
      .postTablaPrincipalOC(this.data.data.queryDetalles)
      .toPromise()
      .then(data => {
        this._componentService.setTablaDetalles(data);
      });
  }

  showImg(data) {
    window.open(data, '_blank');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
