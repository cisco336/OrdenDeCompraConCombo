import { Component, OnInit, OnDestroy } from '@angular/core';
import * as strings from '../../constants/constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Bultos, QueryBulto } from 'src/app/interfaces/interfaces';
import { ComponentsService } from 'src/app/services/components.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-packages-config',
  templateUrl: './packages-config.component.html',
  styleUrls: ['./packages-config.component.scss'],
  animations: [
    trigger('table', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('0 <=> 1', animate('.2s ease-out'))
    ])
  ]
})
export class PackagesConfigComponent implements OnInit, OnDestroy {
  strings = strings;
  packagesForm = new FormGroup({
    unities: new FormControl('', [Validators.required])
  });
  displayedColumns: any[] = [];
  displayedNames: any[] = [];
  detalleOc: any[];
  oc: number;
  dataSource;
  hasDetails: boolean;
  isLoading = false;
  selectedSkus: any[];
  selectedSkusSubscription: any;
  error = strings.errorMessagesText.noData;
  postBultosSubscription: any;
  magnitudes: any[] = [];
  IDBulto = null;
  reset: Subscription;
  newResponse: any[] = [];

  constructor(
    private _componentService: ComponentsService,
    private _dataService: DataService,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    const reset = this._componentService.getResetBultos().value;
    if (reset) {
      this.dataSource._data.next(
        this._componentService.getDataSourceBackup().value
      );
    }
    this.packagesForm.get('unities').valueChanges.subscribe(change => {
      this._componentService.setSteps({
        two: this.packagesForm.valid,
        three: this._componentService.getSteps().value.three,
        four: this._componentService.getSteps().value.four
      });
    });
    this.displayedColumns = [
      // 'ID_BULTO',
      'BULTOS',
      // 'CANTIDAD',
      'LARGO',
      'ANCHO',
      'ALTO',
      'PESO',
      'VOLUMEN',
      'DECLARADO'
    ];
    this.displayedNames = [
      this.strings.strings.package,
      this.strings.strings.packages,
      // this.strings.strings.quantity,
      this.strings.strings.long,
      this.strings.strings.width,
      this.strings.strings.weight,
      this.strings.strings.volumne,
      this.strings.strings.declared
    ];
    this.dataSource = new MatTableDataSource();
    this.detalleOc = this._componentService.getDetalleOC().value;
    this.oc = this.detalleOc[0].PMG_PO_NUMBER;
    this.hasDetails = this._componentService.getHasDetails().value;
    this.selectedSkusSubscription = this.hasDetails
      ? this._componentService.getSelectedSku().subscribe(skuData => {
          if (skuData.length) {
            this.selectedSkus = skuData.filter(
              s => s.GUIA === 'NA' || s.GUIA === '--'
            );
          }
        })
      : null;
  }

  ngOnDestroy() {
    if (this.selectedSkusSubscription) {
      this.selectedSkusSubscription.unsubscribe();
    }
    if (this.postBultosSubscription) {
      this.postBultosSubscription.unsubscribe();
    }
  }

  generatePackages(unidades) {
    // Enviar 'IB', magnitudes va vacio
    if (this.IDBulto !== null) {
      this._dialogService.openPackageUpdateSheet().subscribe(response => {
        if (response) {
          this.generate(unidades);
        } else {
          return;
        }
      });
    } else {
      this.generate(unidades);
    }
  }
  generate(unidades) {
    this.isLoading = true;
    const query: QueryBulto = {
      Transaccion: 'IB',
      Sticker: '-1',
      Ordencompra: this.oc,
      Cantidad: parseInt(unidades, 10),
      Sku: this.hasDetails
        ? this.cleanString(this.selectedSkus)
        : this.cleanString(this.detalleOc),
      ID_BULTO: this.IDBulto === null ? -1 : this.IDBulto,
      Magnitudes: null,
      Usuario: this._componentService.getUser().value
    };
    this.postBultosSubscription = this._dataService.PostBultos(query).subscribe(
      response => {
        if (response['State']) {
          this.newResponse = response['Value'].map(
            s =>
              (s = {
                ALTO: s.ALTO < 1 ? 1 : s.ALTO,
                ANCHO: s.ANCHO < 1 ? 1 : s.ANCHO,
                CANTIDAD: s.BULTO,
                BULTOS: s.BULTOS,
                DECLARADO: s.DECLARADO < 1 ? 1 : s.DECLARADO,
                ID_BULTO: s.ID_BULTO,
                ID_BULTO_DETALLE: s.ID_BULTO_DETALLE,
                LARGO: s.LARGO < 1 ? 1 : s.LARGO,
                PESO: s.PESO < 1 ? 1 : s.PESO,
                PMG_PO_NUMBER: s.PMG_PO_NUMBER,
                STICKER: s.STICKER,
                VOLUMEN: s.VOLUMEN
              })
          );
          this.dataSource.data = this.newResponse;
          this._componentService.setMagnitudes(this.newResponse);
          this._componentService.setBultos(this.newResponse);
          if (this.IDBulto === null) {
            this._componentService.setDataSourceBackup([
              ...this.dataSource.data
            ]);
          } else {
            this._componentService.setIdBultoPost(this.IDBulto);
          }
          this.IDBulto = response['Value'][0]['ID_BULTO'];

          this._componentService.setIdBulto(this.IDBulto);
        }
        this.isLoading = false;
      },
      () => {
        this.error = strings.errorMessagesText.errorGeneratingGuide;
        setTimeout(() => (this.error = strings.errorMessagesText.noData), 3000);
        this.isLoading = false;
        this.dataSource.data = [];
      }
    );
  }
  cleanString(skus) {
    let skuForQuery = JSON.stringify(skus.map(sku => sku.PRD_LVL_CHILD));
    skuForQuery = skuForQuery.replace(/,/g, '-');
    skuForQuery = skuForQuery.replace(/"/g, '');
    skuForQuery = skuForQuery.replace(/\[/g, '');
    skuForQuery = skuForQuery.replace(/\]/g, '');

    this._componentService.setClearSkus(skuForQuery);

    return skuForQuery;
  }
  getTotal(element?) {
    // return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
    return 10;
  }

  addMagnitud() {
    this._componentService.setMagnitudes(this.newResponse);
  }
}
