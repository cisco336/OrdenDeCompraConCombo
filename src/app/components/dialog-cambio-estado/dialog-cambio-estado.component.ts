import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { RequireMatch } from 'src/app/pages/ordenes-compra/customValidators';
import { ComponentsService } from 'src/app/services/components.service';
import { Estado } from '../../interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import {
  trigger,
  transition,
  query,
  animate,
  style,
  animateChild,
  state,
  stagger,
  group
} from '@angular/animations';
import * as moment from 'moment';
import * as strings from '../../constants/constants';

export interface Response {
  message: string;
  ID: number;
}

@Component({
  selector: 'app-dialog-cambio-estado',
  templateUrl: './dialog-cambio-estado.component.html',
  styleUrls: ['./dialog-cambio-estado.component.scss'],
  animations: [
    trigger('show', [
      state('true', style({ margin: '1rem', opacity: 1, height: '*' })),
      state('false', style({ margin: '0', opacity: 0, height: 0 })),
      transition('false <=> true', animate('.2s ease-out'))
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.2s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('chip', [
      transition('* <=> *', [
        group([
          query(
            ':enter',
            [
              stagger(100, [
                animate(
                  '.5s ease-out',
                  style({
                    opacity: 1,
                    transform: 'translateY(0)'
                  })
                )
              ])
            ],
            { optional: true }
          ),
          query('mat-chip-list', animateChild(), { optional: true })
        ]),
        query(
          ':leave',
          [
            stagger(100, [
              animate(
                '.5s ease-in-out',
                style({ opacity: 0, transform: 'translateY(-50px)' })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class DialogCambioEstadoComponent implements OnInit {
  filteredEstados: Observable<Estado[]>;
  background: string;
  color: string;
  chips: any[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isLoading = false;
  estadosControl = new FormControl('', [Validators.required, RequireMatch]);
  fechaCambioControl = new FormControl(moment(), [Validators.required]);
  horaCambioControl = new FormControl('00:00:00', [Validators.required]);
  responseMessage: Response;
  estados: Estado[] = [];
  today = moment();
  strings = strings;

  constructor(
    public dialogRef: MatDialogRef<DialogCambioEstadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _componentService: ComponentsService,
    private _dataService: DataService
  ) {}

  ngOnInit() {
    this.responseMessage = {
      message: '',
      ID: 0
    };
    this.chips = this.data.data.selected;
    this.background = this.background ? '' : 'primary';
    this.color = this.color ? '' : 'accent';
    this.estados = this._componentService.getEstados().value;
    this.filteredEstados = this.estadosControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.DESCRIPCION)),
      map(descripcion =>
        descripcion ? this._filterEstado(descripcion) : this.estados.slice()
      )
    );
  }

  private _filterEstado(data: string): Estado[] {
    const filterValue = data.toLowerCase();

    return this.estados.filter(
      option => option.DESCRIPCION.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  remove(chip): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);
      if (!this.chips.length) {
        setTimeout(() => this.closeDialog(), 3000);
      }
    }
  }

  cambiarEstados() {
    this.isLoading = true;
    const query = {
      p_transaccion: 'UO',
      p_prd_lvl_child: -1,
      p_pmg_po_number: null,
      p_vpc_tech_key: '-1',
      p_fecha_inicio: '-1',
      p_fecha_fin: '-1',
      p_fecha_real: `${this.fechaCambioControl.value.format('DD/MM/YYYY')} ${
        this.horaCambioControl.value
      }:00`,
      p_id_estado: this.estadosControl.value.ID,
      p_origen: '-1',
      p_usuario: this.data.data.usr
    };
    this.chips.forEach(data => {
      query.p_pmg_po_number = data.PMG_PO_NUMBER;
      this._dataService
        .postTablaPrincipalOC(query)
        .toPromise()
        .then(response => {
          this.responseMessage = {
            message: response['Value'][0]['MENSAJE'],
            ID: response['Value'][0]['ID']
          };
        });
    });
    setTimeout(() => {
      this.responseMessage.message = '';
      this.closeDialog();
    }, 2000);
    this.isLoading = false;
  }

  displayEstados(data?: Estado): string | undefined {
    return data ? data.DESCRIPCION : undefined;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
