import * as fromCambioEstado from '../actions/cambioEstado.actions';

const initState = {
  error: null,
  loading: false,
  loadingMsg: null,
  skus: [],
};

export function cambioEstadoReducer(
  state = initState,
  action: fromCambioEstado.CambioEstadoActions,
) {
  switch (action.type) {
    case fromCambioEstado.GET_CAMBIOESTADO_REQUEST:
      return {
        ...state,
        loadingMsg: 'Cargando skus para cambio de estado',
        loading: true,
      };
    case fromCambioEstado.GET_CAMBIOESTADO_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        error: null,
        skus: action.skus,
      };
    case fromCambioEstado.GET_CAMBIOESTADO_FAIL:
      return {
        ...state,
        skus: [],
        loading: false,
        loadingMsg: null,
        error: 'Error al obtener los skus',
      };
    default:
      return state;
  }
}
