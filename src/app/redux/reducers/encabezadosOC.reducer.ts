import * as fromEncabezadosOC from '../actions/encabezados.actions';
import { EncabezadoOC } from '../../models';

const initState = {
  error: null,
  loading: false,
  loadingMsg: null,
  encabezados: []
};

export function encabezadosOCReducer(
  state = initState,
  action: fromEncabezadosOC.EncabezadosOCActions,
) {
  switch (action.type) {
    case fromEncabezadosOC.GET_ENCABEZADOSOC_REQUEST:
      return {
        ...state,
        loadingMsg: 'Cargando encabezados de ordenens de compra',
        loading: true,
      }
    case fromEncabezadosOC.GET_ENCABEZADOSOC_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        error: null,
        encabezados: action.encabezadosOC,
      };
    case fromEncabezadosOC.GET_ENCABEZADOSOC_FAIL:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        error: 'Error al obtener los encabezados'
      };
    default:
      return state;
  }
}
