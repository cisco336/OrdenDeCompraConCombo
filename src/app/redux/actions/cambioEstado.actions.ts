import { Action } from '@ngrx/store';

export const GET_CAMBIOESTADO_REQUEST =
  '[CAMBIOESTADO] Get Cambio de estado request';
export const GET_CAMBIOESTADO_SUCCESS =
  '[CAMBIOESTADO] Get Cambio de estado success';
export const GET_CAMBIOESTADO_FAIL = '[CAMBIOESTADO] Get Cambio de estado fail';

//  Solicitud Obtener skus para cambio de estado
export class GetCambioEstadoRequestAction implements Action {
  readonly type = GET_CAMBIOESTADO_REQUEST;
}

//  Obtener skus para cambio de estado
export class GetCambioEstadoSuccessAction implements Action {
  readonly type = GET_CAMBIOESTADO_SUCCESS;
  constructor(public skus) {}
}

//  Falló Obtener skus para cambio de estado
export class GetCambioEstadoFailAction implements Action {
  readonly type = GET_CAMBIOESTADO_FAIL;
}

export type CambioEstadoActions =
  | GetCambioEstadoRequestAction
  | GetCambioEstadoSuccessAction
  | GetCambioEstadoFailAction;
