import * as fromProviders from '../actions/proveedores.actions';
import { EstadoProveedores } from '../../models/estado-proveedores.model';

const initState: EstadoProveedores[] = [];

export function providersReducer(
  state = initState,
  action: fromProviders.ProvidersActions,
): EstadoProveedores[] {
  switch (action.type) {
    case fromProviders.GET_PROVIDERS_SUCCESS:
      return action.providers;
    case fromProviders.GET_PROVIDERS_FAIL:
      return state;
    case fromProviders.GET_PROVIDERS_REQUEST:
      return state;
    default:
      return state;
  }
}
