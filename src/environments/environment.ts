// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const type = {
  combo: true,
  internet: false,
};

export const environment = {
  production: false,

  PATHROTULO: 'http://200.69.100.66/2IMPRESIONGUIASpruebas/ISticker_ZEA.aspx?',
  APIORDENDECOMPRA: 'http://10.23.14.164:9002/Servicios/ORDEN_COMPRA_1.0.0/api',
  USRPASSWD: 'EMPCAR01:EMPCAR1',
  USR: 'EMPCAR01',
  PASSWD: 'EMPCAR1',
  AUTH:
    'https://apim-dev-proxy.sodhc.co/logisticaSeguridadAutenticacion/authenticated',
  GUIA: 'http://200.69.100.66/ServicioLiquidacionRESTpruebas/Service1.svc/Generacion',
  APIGUIA: 'http://10.23.14.164:9001/Servicios/Transportadora_1.0.0/api',
  APIPROVEEDOR: 'http://10.23.14.164:9002/Servicios/INV_INVENTARIO_1.0.0/api',
  SUBSCRIPTIONKEY: 'dfeb9e69860f45258647cc7ba45fb040',
  SUBSCRIPTIONKEYCONFIGURACION: '9b33c33d833340e0839653420edf6a89'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
