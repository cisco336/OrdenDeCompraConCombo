import { Action } from '@ngrx/store';

// Obtener Orden Compra
export const GET_ORDENCOMPRA_REQUEST = '[ORDENCOMPRA] Get OrdenCompra request';
export const GET_ORDENCOMPRA_SUCCESS = '[ORDENCOMPRA] Get OrdenCompra success';
export const GET_ORDENCOMPRA_FAIL = '[ORDENCOMPRA] Get OrdenCompra fail';

// Obtener los detalles de la Orden de compra
export const GET_OCDETAILS_REQUEST = '[OC_DETAILS] Get Detalles OC request';
export const GET_OCDETAILS_SUCCESS = '[OC_DETAILS] Get Detalles OC success';
export const GET_OCDETAILS_FAIL = '[OC_DETAILS] Get Detalles OC fail';

//  Solicitud Obtener la Orden de compra (detalles generales)
export class GetOrdenCompraRequesAction implements Action {
  readonly type = GET_ORDENCOMPRA_REQUEST;
}

//  Obtener la Orden de compra (detalles generales)
export class GetOrdenCompraSuccessAction implements Action {
  readonly type = GET_ORDENCOMPRA_SUCCESS;

  // TODO Crear interface o clase para ordenCompra
  constructor(public ordenCompra) {}
}

//  Falló Obtener la Orden de compra (detalles generales)
export class GetOrdenCompraFailAction implements Action {
  readonly type = GET_ORDENCOMPRA_FAIL;
}

//  Solicitud para Obtener la Orden de compra (todos los detalles)
export class GetOCDetailsRequestlAction implements Action {
  readonly type = GET_OCDETAILS_REQUEST;
}

//  Obtener la Orden de compra (todos los detalles)
export class GetOCDetailsSuccessAction implements Action {
  readonly type = GET_OCDETAILS_SUCCESS;

  constructor(public detailsOC) {}
}

//  Falló Obtener la Orden de compra (todos los detalles)
export class GetOCDetailsFailAction implements Action {
  readonly type = GET_OCDETAILS_FAIL;
}

export type OrdenCompraActions =
  | GetOrdenCompraRequesAction
  | GetOrdenCompraSuccessAction
  | GetOrdenCompraFailAction
  | GetOCDetailsSuccessAction
  | GetOCDetailsRequestlAction
  | GetOCDetailsFailAction;
