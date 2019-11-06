import { Action } from '@ngrx/store';
import { EstadoProveedores } from 'src/app/models';

export const GET_STATES_REQUEST = '[STATES] Get states request';
export const GET_STATES_SUCCESS = '[STATES] Get states success';
export const GET_STATES_FAIL = '[STATES] Get states fails';

// Obtener Estados (petición)
export class GetStatesRequestAction implements Action {
  readonly type = GET_STATES_REQUEST;
}

// Obtener Estados (exito)
export class GetStatesSuccessAction implements Action {
  readonly type = GET_STATES_SUCCESS;

  constructor(public states: EstadoProveedores[]) {}
}

// Obtener Estados (falla)
export class GetStatesFailAction implements Action {
  readonly type = GET_STATES_FAIL;
}

export type StatesActions =
  | GetStatesRequestAction
  | GetStatesSuccessAction
  | GetStatesFailAction;
