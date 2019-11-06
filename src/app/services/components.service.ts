import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../redux/actions';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {
  selectedSku = new BehaviorSubject<any>('');
  estados = new BehaviorSubject<any>('');
  tablaDetalle = new BehaviorSubject<any>('');
  user = new BehaviorSubject<string>('');
  queryDetalles = new BehaviorSubject<any>('');
  infoBaseOC = new BehaviorSubject<any>('');
  ordenGuia = new BehaviorSubject<any>('');
  detalleOC = new BehaviorSubject<any>('');
  bulto = new BehaviorSubject<any>('');
  hasDetails = new BehaviorSubject<boolean>(false);
  resetBultos = new BehaviorSubject<boolean>(false);
  isTracking = new BehaviorSubject<boolean>(false);
  steps = new BehaviorSubject<{ two: boolean; three: boolean; four: boolean }>({
    two: false,
    three: false,
    four: false
  });
  magnitudes = new BehaviorSubject<any[]>([]);
  dataSourceBackup = new BehaviorSubject<any[]>([]);
  idBulto = new BehaviorSubject<any>('');
  idBultoPost = new BehaviorSubject<any>('');
  direccionOrigen = new BehaviorSubject<{
    direccion: string;
    ciudad: string;
  }>({
    direccion: '',
    ciudad: ''
  });
  bultos = new BehaviorSubject<any>([]);
  clearSkus = new BehaviorSubject<any>('');
  closeDialogBJ = new BehaviorSubject<boolean>(false);
  tracking = new BehaviorSubject<any>('');
  direccionDestino = new BehaviorSubject<{
    direccion: string;
    ciudad: string;
  }>({
    direccion: '',
    ciudad: ''
  });
  generaGuia = new BehaviorSubject<boolean>(false);
  fechasOC = new BehaviorSubject<{
    FECHA_MAXIMA_OC: string;
    FECHA_MINIMA_OC: string;
  }>({
    FECHA_MINIMA_OC: '',
    FECHA_MAXIMA_OC: ''
  });

  aux = new BehaviorSubject<boolean>(false);

  isLoading = new BehaviorSubject<boolean>(false);

  constructor(private store: Store<AppState>) {}

  /**
   * Mostrar / ocultar el loader
   * @param value number
   */
  loader(value?) {
    switch (value) {
      case 1:
        this.store.dispatch(new actions.StartLoader());
        break;
      default:
        this.store.dispatch(new actions.StopLoader());
        break;
    }
  }
}
