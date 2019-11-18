import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutoCompleteData } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent implements OnInit, OnChanges {
  @Input() data: AutoCompleteData;
  @Output() formReady = new EventEmitter<FormControl>();
  filteredData: Observable<any>;
  dataControl = new FormControl('', Validators.required);
  argument: string;

  constructor() {}

  ngOnInit() {
    this.formReady.emit(this.dataControl);
  }
  ngOnChanges() {
    this.filteredData = this.dataControl.valueChanges.pipe(
      startWith(''),
      map(value =>
        typeof value === 'string' ? value : value[this.data.argument],
      ),
      map(name => (name ? this._filter(name) : this.data.data.slice())),
    );
  }
  display(data): string | undefined {
    return data ? data['DESCRIPCION'] : undefined;
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.data.data.filter(
      option =>
        option[this.data.argument].toLowerCase().indexOf(filterValue) >= 0,
    );
  }
}
