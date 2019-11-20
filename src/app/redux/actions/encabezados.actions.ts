import { Action } from '@ngrx/store';
import { EncabezadoOC } from '../../models/';

export const GET_ENCABEZADOSOC_REQUEST = '[ENCABEZADOSOC] Get EncabezadosOC request';
export const GET_ENCABEZADOSOC_SUCCESS = '[ENCABEZADOSOC] Get EncabezadosOC success';
export const GET_ENCABEZADOSOC_FAIL = '[ENCABEZADOSOC] Get EncabezadosOC fail';

//  Solicitud Obtener encabezados
export class GetEncabezadosOCRequestAction implements Action {
  readonly type = GET_ENCABEZADOSOC_REQUEST;
}

//  Obtener encabezados
export class GetEncabezadosOCSuccessAction implements Action {
  readonly type = GET_ENCABEZADOSOC_SUCCESS;
  constructor(public encabezadosOC: EncabezadoOC[]) {}
}

//  Falló Obtener encabezados
export class GetEncabezadosOCFailAction implements Action {
  readonly type = GET_ENCABEZADOSOC_FAIL;
}

export type EncabezadosOCActions =
  | GetEncabezadosOCRequestAction
  | GetEncabezadosOCSuccessAction
  | GetEncabezadosOCFailAction;
