import { transacciones } from '../constants/constants';
import * as moment from 'moment';

export class QueryDetalles {
         p_transaccion: string;
         p_pmg_po_number: number;
         p_vpc_tech_key: number;
         p_prd_lvl_child: number;
         p_fecha_inicio: string;
         p_fecha_fin: string;
         p_fecha_real: string;
         p_id_estado: string;
         p_origen: string;
         p_usuario: string;
         constructor(
           p_transaccion: string,
           p_pmg_po_number: number,
           p_vpc_tech_key: number,
           p_prd_lvl_child: number,
           p_fecha_inicio: string,
           p_fecha_fin: string,
           p_fecha_real: string,
           p_id_estado: string,
           p_origen: string,
           p_usuario: string,
         ) {
           p_transaccion = this.p_transaccion || transacciones.getEncabezados;
           p_pmg_po_number = this.p_pmg_po_number || -1;
           p_vpc_tech_key = this.p_vpc_tech_key || -1;
           p_prd_lvl_child = this.p_prd_lvl_child || -1;
           p_fecha_inicio = this.p_fecha_inicio || '-1';
           p_fecha_fin = this.p_fecha_fin || moment().format('DD:MM:YYYY');
           p_fecha_real = this.p_fecha_real || moment().format('DD:MM:YYYY');
           p_id_estado = this.p_id_estado || '-1';
           p_origen = this.p_origen || '-1';
           p_usuario = this.p_usuario || '';
         }
       }
