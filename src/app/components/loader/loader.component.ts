import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() diameter: number;
  @Input() color: string;
  isLoading = false;
  loadingMsg: string[];
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store
      .pipe(
        map(s => {
          return {
            estados: {
              loading: s.states.loading,
              msg: s.states.loadingMsg,
            },
            proveedores: {
              loading: s.providers.loading,
              msg: s.providers.loadingMsg,
            },
            encabezados: {
              loading: s.encabezadosOC.loading,
              msg: s.encabezadosOC.loadingMsg,
            },
          };
        }),
      )
      .subscribe(store => {
        this.isLoading =
          store.encabezados.loading ||
          store.estados.loading ||
          store.proveedores.loading;
        this.loadingMsg = Object.values(store).map(x => x.msg);
      });
  }
}
