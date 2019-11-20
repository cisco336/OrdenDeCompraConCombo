import { ActionReducerMap } from '@ngrx/store';
import * as allReducers from './redux/reducers';

export interface AppState {
    states;
    providers;
    encabezadosOC;
    ordenCompra;
    cambioEstado;
}

export const reducers: ActionReducerMap<AppState> = {
    states: allReducers.statesReducer,
    providers: allReducers.providersReducer,
    encabezadosOC: allReducers.encabezadosOCReducer,
    ordenCompra: allReducers.ordenCompraReducer,
    cambioEstado: allReducers.cambioEstadoReducer,
};