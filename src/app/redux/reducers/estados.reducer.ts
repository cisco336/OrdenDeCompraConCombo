import * as fromStates from '../actions/estados.actions';
import { EstadoProveedores } from '../../models/';

const initState = {
  error: null,
  loading: false,
  loadingMsg: null,
  estados: [],
};

export function statesReducer(
  state = initState,
  action: fromStates.StatesActions,
) {
  switch (action.type) {
    case fromStates.GET_STATES_REQUEST:
      return {
        ...state,
        loadingMsg: 'Cargando estados',
        loading: true,
      };
    case fromStates.GET_STATES_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        estados: action.states,
      };
    case fromStates.GET_STATES_FAIL:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        error: 'Error al obtener los estados',
      };
    default:
      return state;
  }
}
