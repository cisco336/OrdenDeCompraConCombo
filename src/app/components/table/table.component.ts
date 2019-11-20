import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { OrdenDeCompra } from 'src/app/models';
import * as constants from '../../constants/constants';
import { FormControl } from '@angular/forms';
import * as actions from '../../redux/actions/';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class TableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constants = constants;
  dataSource;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['Select', 'PMG_PO_NUMBER', 'AUX', 'ACTIONS'];
  filterInput: FormControl = new FormControl('', []);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.subscribe(values => {
      const tableData = values.encabezadosOC;
      this.dataSource.data = tableData['encabezados']
        ? tableData['encabezados']
        : [];
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
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

  setSkus() {
    this.store.dispatch(new actions.GetCambioEstadoSuccessAction(this.selection.selected));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
