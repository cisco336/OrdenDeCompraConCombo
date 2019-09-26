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
  filteredDestino: Observable<any>;
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
      originCity: ['', Validators.required],
      destinyAddress: ['', Validators.required],
      destinyCity: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.addresses.get('originCity').valueChanges.subscribe(change => {
      // this._componentService.setDireccionOrigen({
      //   direccion: this._componentService.getDireccionOrigen().value.direccion,
      //   ciudad: change
      // });
    });
    this._dataService.GetCiudades(this.TAG).subscribe(
      ciudades => {
        if (!ciudades) {
          this.error = strings.errorMessagesText.citiesError;
          setTimeout(() => (this.error = ''), 3000);
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
          this.filteredDestino = this.addresses
            .get('destinyCity')
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
          const form = this.addresses;
          const component = this._componentService;
          const origen = this._componentService.getDireccionOrigen().value
            .ciudad;
          const destino = this._componentService.direccionDestino.value.ciudad;
          const ciudadOrigen = this.ciudades.filter(s => s.ID === origen);
          const ciudadDestino = this.ciudades.filter(s => s.ID === destino);
          form
            .get('originAddress')
            .setValue(component.direccionOrigen.value.direccion);
          form
            .get('destinyAddress')
            .setValue(component.direccionDestino.value.direccion);
          form.get('originCity').setValue(ciudadOrigen[0]);
          form.get('destinyCity').setValue(ciudadDestino[0]);
          form
            .get('originAddress')
            .valueChanges.subscribe(a => this._componentService.direccionOrigen.next({
              direccion: a,
              ciudad: form.get('originCity').value
            }));
          form
            .get('destinyAddress')
            .valueChanges.subscribe(b => this._componentService.direccionDestino.next({
              direccion: b,
              ciudad: form.get('destinyCity').value
            }));
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
