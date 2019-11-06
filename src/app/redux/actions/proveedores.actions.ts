import { Action } from '@ngrx/store';
import { EstadoProveedores } from '../../models/';

export const GET_PROVIDERS_REQUEST = '[PROVIDERS] Get providers request';
export const GET_PROVIDERS_SUCCESS = '[PROVIDERS] Get providers success';
export const GET_PROVIDERS_FAIL = '[PROVIDERS] Get providers fail';

//  Solicitud Obtener proveedores
export class GetProvidersRequesAction implements Action {
  readonly type = GET_PROVIDERS_REQUEST;
}

//  Obtener proveedores
export class GetProvidersSuccessAction implements Action {
  readonly type = GET_PROVIDERS_SUCCESS;
  constructor(public providers: EstadoProveedores[]) {}
}

//  Falló Obtener proveedores
export class GetProvidersFailAction implements Action {
  readonly type = GET_PROVIDERS_FAIL;
}

export type ProvidersActions =
  | GetProvidersRequesAction
  | GetProvidersSuccessAction
  | GetProvidersFailAction;
