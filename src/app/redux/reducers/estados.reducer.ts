import * as fromStates from '../actions/estados.actions';
import { EstadoProveedores } from '../../models/';

const initState: EstadoProveedores[] = [];

export function statesReducer(
  state = initState,
  action: fromStates.StatesActions
): EstadoProveedores[] {
  switch (action.type) {
    case fromStates.GET_STATES_SUCCESS:
      return action.states;
    default:
      return state;
  }
}
