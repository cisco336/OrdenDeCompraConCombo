import { QueryMagnitudes } from './queryMagnitudes.model';

export class QueryBulto {
  Transaccion: string;
  Ordencompra: number;
  Cantidad: number;
  Sticker: string;
  Sku: string;
  ID_BULTO: number;
  Magnitudes: QueryMagnitudes[];
  Usuario: string;
}
