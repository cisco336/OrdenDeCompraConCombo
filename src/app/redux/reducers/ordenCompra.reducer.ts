import * as fromOrdenCompra from '../actions/ordenCompra.actions';
import { OrdenDeCompra } from 'src/app/models';

const initState = {
  error: null,
  loading: false,
  loadingMsg: null,
  orden: {
    numero: null,
    guia: null,
    rotulo: null,
    detalles: {
      skus: [],
      detallesCliente: {},
      detallesEnvio: {},
    },
    tracking: {},
    bultos: {},
  },
};

export function ordenCompraReducer(
  state = initState,
  action: fromOrdenCompra.OrdenCompraActions,
) {
  switch (action.type) {
    case fromOrdenCompra.GET_ORDENCOMPRA_REQUEST ||
      fromOrdenCompra.GET_OCDETAILS_REQUEST:
      return {
        ...state,
        loadingMsg: 'Cargando Orden de compra',
        loading: true,
      };
    case fromOrdenCompra.GET_ORDENCOMPRA_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        orden: action.ordenCompra,
      };
    case fromOrdenCompra.GET_ORDENCOMPRA_FAIL:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        error: 'Error al obtener la orden de compra',
      };
    case fromOrdenCompra.GET_OCDETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMsg: null,
        orden: {
          ...state.orden,
          detalles: action.detailsOC,
        },
      };
    default:
      return state;
  }
}
