import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { RequireMatch } from 'src/app/pages/ordenes-compra/customValidators';
import * as moment from 'moment';
import * as constants from '../../../constants/constants';
import { EstadoProveedores, QueryDetalles } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
})
export class MainFormComponent implements OnInit, AfterViewInit {
  @Output() ocDetalles = new EventEmitter<QueryDetalles>();
  mainFilterForm: FormGroup;
  strings = constants;
  proveedores: EstadoProveedores[] = [];
  estados: EstadoProveedores[] = [];
  filteredProviders: Observable<EstadoProveedores[]>;
  filteredStates: Observable<EstadoProveedores[]>;

  constructor(private store: Store<AppState>, _formBuilder: FormBuilder) {
    // Validators
    this.mainFilterForm = _formBuilder.group({
      fechaInicioControl: [moment().subtract(1, 'month'), Validators.required],
      fechaFinControl: [moment(), Validators.required],
    });
  }

  ngOnInit() {
    this.store.subscribe(store => {
      this.proveedores = store.providers;
      this.estados = store.states;
    });
    this.mainFilterForm.valueChanges.subscribe(values => {
      const start = new Date(
        this.mainFilterForm.get('fechaInicioControl').value,
      );
      const end = new Date(this.mainFilterForm.get('fechaFinControl').value);
      if (start > end) {
        this.mainFilterForm.setErrors(start > end ? { incorrect: true } : null);
      }
    });
  }

  ngAfterViewInit() {
    const a = this.mainFilterForm.get('proveeorControl');
    const b = this.mainFilterForm.get('estadosControl');
    if (a && b) {
      a.setValidators(RequireMatch);
      b.setValidators(RequireMatch);
    }
  }

  formInitialized(name: string, form: FormControl) {
    this.mainFilterForm.setControl(name, form);
  }

  formGroupInitialized(name: string, form: FormGroup, disabled?: boolean) {
    this.mainFilterForm.setControl(name, form);
  }

  getDetalles() {
    const form = this.mainFilterForm;
    const queryConsultar: QueryDetalles = {
      p_transaccion: 'GE',
      p_pmg_po_number: -1,
      p_prd_lvl_child: -1,
      p_vpc_tech_key: form.get('proveedorControl').value['ID'],
      p_fecha_inicio: form.get('fechaInicioControl').value.format('DD/MM/YYYY'),
      p_fecha_fin: form.get('fechaFinControl').value.format('DD/MM/YYYY'),
      p_fecha_real: '-1',
      p_id_estado: form.get('estadosControl').value.ID,
      p_origen: '-1',
      p_usuario: '',
    };
    this.ocDetalles.emit(queryConsultar);
  }
}
