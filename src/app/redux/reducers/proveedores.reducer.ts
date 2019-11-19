import * as fromProviders from '../actions/proveedores.actions';

const initState = {
  error: null,
  loading: false,
  loadingMsg: null,
  proveedores: [],
};

export function providersReducer(
  state = initState,
  action: fromProviders.ProvidersActions,
) {
  switch (action.type) {
    case fromProviders.GET_PROVIDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        proveedores: action.providers,
      };
    case fromProviders.GET_PROVIDERS_FAIL:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        error: 'Error obteniendo los proveedores'
      };
    case fromProviders.GET_PROVIDERS_REQUEST:
      return {
        ...state,
        loading: true,
        loadingMsg: 'Cargando proveedores.',
      };
    default:
      return state;
  }
}
