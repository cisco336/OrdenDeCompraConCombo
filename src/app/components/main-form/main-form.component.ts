import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequireMatch } from 'src/app/pages/ordenes-compra/customValidators';
import * as moment from 'moment';
import * as constants from '../../constants/constants';
import { EstadoProveedores } from '../../models/';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent implements OnInit {
  mainFilterForm: FormGroup;
  strings = constants;
  proveedores: EstadoProveedores[] = [];
  estados: EstadoProveedores[] = [];
  filteredProviders: Observable<EstadoProveedores[]>;
  filteredStates: Observable<EstadoProveedores[]>;

  constructor(private store: Store<AppState>, _formBuilder: FormBuilder) {
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
  }

  ngOnInit() {
    this.store.subscribe(store => {
      this.proveedores = store.providers;
      this.estados = store.states;
      if (this.proveedores.length > 0 || this.estados.length > 0) {
        this.mainFilterForm.get('proveedorControl').setValue(this.proveedores[0]);
        this.mainFilterForm.get('estadosControl').setValue(this.estados[0]);
      }
    });

    this.filteredProviders = this.mainFilterForm
      .get('proveedorControl')
      .valueChanges.pipe(
        startWith(''),
        map(value => (value ? typeof value === 'string' ? value : value.DESCRIPCION : '')),
        map(descripcion =>
          descripcion
            ? this._filter(descripcion, false)
            : this.proveedores.slice()
        )
      );

    this.filteredStates = this.mainFilterForm
      .get('estadosControl')
      .valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.DESCRIPCION)),
        map(descripcion =>
          descripcion ? this._filter(descripcion, true) : this.estados.slice()
        )
      );
  }

  displayInfo(data?: EstadoProveedores): string | undefined {
    return data ? data.DESCRIPCION : undefined;
  }

  private _filter(DESCRIPCION: string, type?: boolean): EstadoProveedores[] {
    const filterValue = DESCRIPCION.toLowerCase();
    let array;
    switch (type) {
      case true:
        array = this.estados;
        break;
      default:
        array = this.proveedores;
        break;
    }

    return array.filter(
      option => option.DESCRIPCION.toLowerCase().indexOf(filterValue) >= 0
    );
  }
}
