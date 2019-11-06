import { ActionReducerMap } from '@ngrx/store';
import * as allReducers from './redux/reducers';
import { EstadoProveedores } from './models';

export interface AppState {
    states: EstadoProveedores[];
    loader: boolean;
    providers: EstadoProveedores[];
}

export const reducers: ActionReducerMap<AppState> = {
    states: allReducers.statesReducer,
    loader: allReducers.loaderReducer,
    providers: allReducers.providersReducer,
};
