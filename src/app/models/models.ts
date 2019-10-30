export class OrdenDeCompra {
  CNTRY_NAME: string;
  ESTADO: string;
  FECHA_CREACION: string;
  FECHA_MODIFICACION: string;
  ORIGEN: string;
  PMG_ENTRY_DATE: string;
  PMG_EXP_RCT_DATE: string;
  PMG_PAY_DATE: string;
  PMG_PO_NUMBER: number;
  PMG_RELEASE_DATE: string;
  PMG_SHIP_DATE: string;
  PMG_SHIP_DATE1: string;
  PMG_STAT_CODE: number;
  PMG_STAT_NAME: string;
  PMG_TOT_CASE_QTY: number;
  PMG_TOT_PO_COST: number;
  PMG_TOT_SELL_QTY: number;
  PMG_USER: string;
  STICKER: string;
  USR_MODIFICACION: null;
  VENDOR_NAME: string;
  VENDOR_NUMBER: string;
  VPC_TECH_KEY: number;
  observaciones: string;
}
export class DetalleOrdenDeCompra {
  ESTADO: string;
  FECHA_CREACION: string;
  FECHA_MODIFICACION: string;
  ID_ESTADO: number;
  NAME_FAMILIA: string;
  ORG_LVL_CHILD: number;
  ORG_NAME_FULL: string;
  ORIGEN_DESC: string;
  PMG_CANCEL_DATE: string;
  PMG_DTL_TECH_KEY: number;
  PMG_DTL_TYPE: number;
  PMG_EXP_RCT_DATE: string;
  PMG_PACK_COST: number;
  PMG_PACK_QTY: number;
  PMG_PAY_DATE: string;
  PMG_PO_NUMBER: number;
  PMG_RETAIL: number;
  PMG_SELL_COST: number;
  PMG_SELL_QTY: number;
  PMG_SEQ_NUM: number;
  PMG_SHIP_DATE: string;
  PMG_STATUS: number;
  PMG_STAT_NAME: string;
  PMG_TOT_DTL_COST: number;
  PRD_LVL_CHILD: number;
  PRD_LVL_NUMBER: string;
  PRD_NAME_FULL: string;
  PRD_UPC: number;
  USR_CREACION: string;
  USR_MODIFICACION: string;
  VPC_PRD_TECH_KEY: number;
  observaciones: string;
}
export class Proveedor {
  ACTIVO: string;
  EMAIL: string;
  NOMBRE_PROVEEDOR: string;
  PROVEEDOR_ID: number;
}
export class Estado {
  ID: number;
  DESCRIPCION: string;
}
export class Proveedores {
  ID: number;
  DESCRIPCION: string;
}
export class TrackingObject {
  DESCRIPCION_ESTADO_HO: string;
  DESCRIPCION_ESTADO_OC: string;
  FECHA_CREACION: string;
  FECHA_INTEGRACION: string;
  ID_ESTADO_HOMOLOGADO: number;
  ID_ESTADO_OC: number;
  USUARIO_CREACION: string;
}
export class InfoBaseOC {
  CEDULA: number;
  CLIENTE: string;
  TELEFONOS: string;
  DIRECCION_CTE: string;
  CIUDAD_CTE: string;
  DIRECCION_ENTREGA: string;
  CIUDAD_ENTREGA: string;
  PMG_PO_NUMBER: number;
  TIPO_ENTREGA: string;
  STICKER: string;
  ORIGEN: string;
  NOTA_PEDIDO: string;
  PROVEEDOR: string;
  GUIA: string;
  CUMPLIDO: string;
  TRANSPORTADORA: string;
  OBSERVACIONES: string;
}
export class Bultos {
  PESO: number;
  VOLUMEN: number;
  DECLARADO: number;
}
export class Envia {
  State: boolean;
  Message: string;
  Value: {
    respuesta: string;
    k_cobrados: number;
    valor_flete: number;
    valor_costom: number;
    valor_otros: number;
    dias_entrega: number;
    guia: string;
    urlguia: string;
    num_ordens: string;
  };
}
export class QueryMagnitudes {
  cantidad: number;
  IdDetalle: number;
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  declarado: number;
}
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
export class Environment {
  combo: boolean;
  internet: boolean;
}