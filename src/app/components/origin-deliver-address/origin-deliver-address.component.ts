import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import * as strings from '../../constants/constants';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Subscription, Observable } from 'rxjs';
import { ComponentsService } from 'src/app/services/components.service';
import { startWith, map } from 'rxjs/operators';
import { Proveedor } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-origin-deliver-address',
  templateUrl: './origin-deliver-address.component.html',
  styleUrls: ['./origin-deliver-address.component.scss']
})
export class OriginDeliverAddressComponent implements OnInit, OnDestroy {
  @ViewChild('direccionDestino', { static: true }) direccionDestino: ElementRef;
  @ViewChild('ciudadDestino', { static: true }) ciudadDestino: ElementRef;
  strings = strings;
  addresses;
  citiesSubscription: Subscription;
  TAG = 'DANESAPS';
  filteredOrigen: Observable<any>;
  ciudades;
  destinos;
  transportadora;
  oc;
  error;

  constructor(
    _formBuilder: FormBuilder,
    private _dataService: DataService,
    private _componentService: ComponentsService
  ) {
    this.addresses = _formBuilder.group({
      originAddress: ['', Validators.required],
      originCity: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.addresses.get('originAddress').valueChanges.subscribe(change => {
      this._componentService.setDireccionOrigen({ direccion: change, ciudad: this._componentService.getDireccionOrigen().value.ciudad });
    });
    this.addresses.get('originCity').valueChanges.subscribe(change => {
      this._componentService.setDireccionOrigen({ direccion: this._componentService.getDireccionOrigen().value.direccion, ciudad: change });
    });
    this._dataService.GetCiudades(this.TAG).subscribe(
      ciudades => {
        if (!ciudades) {
          this.error = strings.errorMessagesText.citiesError;
          setTimeout(() => this.error = '', 3000);
        } else {
          this.ciudades = ciudades;
          this.destinos = ciudades;
          this.filteredOrigen = this.addresses
            .get('originCity')
            .valueChanges.pipe(
              startWith(''),
              map(value =>
                typeof value === 'string' ? value : value['DESCRIPCION']
              ),
              map(descripcion =>
                descripcion
                  ? this._filterOrigenes(descripcion)
                  : this.ciudades.slice()
              )
            );
          const data = this._componentService.getInfoBaseOC().value;
          this.transportadora = data['TRANSPORTADORA'];
          this.oc = data['PMG_PO_NUMBER'];
          const query = {
            Transportadora: this.transportadora,
            CodigoInterno: this.oc,
            IdBulto: this._componentService.getIdBultoPost().value,
            Direccion: '',
            CodDane: ''
          };
          const response = this._componentService.getInfoBaseOC().value;
          this.direccionDestino.nativeElement.value =
            response['DIRECCION_ENTREGA'];
          const destino = this.ciudades.filter(
            s => s.ID === response['CODIGO_DANE_DESTINO']
          );
          this.ciudadDestino.nativeElement.value =
            destino && destino[0] && destino[0]['DESCRIPCION']
              ? destino[0]['DESCRIPCION']
              : null;
          this.addresses
            .get('originAddress')
            .setValue(response['DIRECCION_ORIGEN']);
          const origen =
            this.ciudades.filter(
              s => s.ID === response['CODIGO_DANE_ORIGEN']
            ) || null;
          this.addresses.get('originCity').setValue(origen[0]);
        }
      },
      () => {}
    );
  }

  ngOnDestroy() {}

  private _filterOrigenes(DESCRIPCION) {
    const filterValue = DESCRIPCION.toLowerCase();

    return this.ciudades.filter(
      option => option['DESCRIPCION'].toLowerCase().indexOf(filterValue) >= 0
    );
  }

  displayOrigen(data?: any): string | undefined {
    return data ? data['DESCRIPCION'] : undefined;
  }
}
