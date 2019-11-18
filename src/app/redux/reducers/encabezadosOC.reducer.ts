import * as fromEncabezadosOC from '../actions/encabezados.actions';
import { EncabezadoOC } from '../../models';

const initState: EncabezadoOC[] = [];

export function encabezadosOCReducer(
  state = initState,
  action: fromEncabezadosOC.EncabezadosOCActions,
): EncabezadoOC[] {
  switch (action.type) {
    case fromEncabezadosOC.GET_ENCABEZADOSOC_SUCCESS:
      return action.encabezadosOC;
    case fromEncabezadosOC.GET_ENCABEZADOSOC_FAIL:
      return state;
    default:
      return state;
  }
}
