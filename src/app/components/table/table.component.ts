import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { OrdenDeCompra } from 'src/app/models';
import * as constants from '../../constants/constants';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  constants = constants;
  dataSource;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['Select', 'PMG_PO_NUMBER', 'AUX', 'ACTIONS'];
  filterInput: FormControl;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.subscribe(values => {
      this.dataSource = new MatTableDataSource();
      const tableData = values.encabezadosOC;
      console.log(tableData);
      this.dataSource.data = tableData['encabezados']
        ? tableData['encabezados']
        : [];
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
