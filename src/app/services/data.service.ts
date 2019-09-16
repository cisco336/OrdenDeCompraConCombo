import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  token = new BehaviorSubject<string>('');

  // Calls
  getDatosProveedorCall = '/Configuracion/GetDatosProveedor';
  getProveedoresCall = '/Configuracion/GetProveedores';
  getEstadosCall = '/Configuracion/GetEstados';
  postTablaPrincipalOCCall = '/Configuracion/GetOc';
  getInfoBaseOcCall = '/Configuracion/GetInfoBaseOc?id=';
  getGuiaCall = '/Guia/GetGuia?transportadora=';
  getCiudadesCall = '/Guia/GetCursor?tag=';
  postInfoGuiaCall = '/Guia/GetInfoGuia';
  putSetDatosGuiaCall = '/Guia/SetDatosGuia';

  postBultosCall = '/Guia/ConfiguracionBultos';

  constructor(private http: HttpClient) {}

  protected generateBasicHeadersJWT(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': Constants.SUBSCRIPTIONKEY,
      Authorization: 'Bearer ' + this.token.value
    });
  }

  protected proveedoresJWT(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': Constants.SUBSCRIPTIONKEYCONFIGURACION,
      Authorization: 'Bearer ' + this.token.value
    });
  }

  protected generateGuideHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(Constants.USRPASSWD)
    });
  }

  getDatosProveedor(data) {
    return this.http.get(
      Constants.APIPROVEEDOR + this.getDatosProveedorCall + '/' + data,
      {
        headers: this.generateBasicHeadersJWT()
      }
    );
  }

  getProveedores() {
    return this.http.get(Constants.APIORDENDECOMPRA + this.getProveedoresCall, {
      headers: {
        'Ocp-Apim-Subscription-Key': Constants.SUBSCRIPTIONKEYCONFIGURACION,
      }
    });
  }

  getEstados() {
    return this.http.get(Constants.APIORDENDECOMPRA + this.getEstadosCall, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  postTablaPrincipalOC(data) {
    return this.http.post(
      Constants.APIORDENDECOMPRA + this.postTablaPrincipalOCCall,
      data,
      {
        headers: this.generateBasicHeadersJWT()
      }
    );
  }

  GetInfoBaseOc(data) {
    return this.http.get(
      Constants.APIORDENDECOMPRA + this.getInfoBaseOcCall + data,
      {
        headers: this.generateBasicHeadersJWT()
      }
    );
  }

  GetGuia(data) {
    return this.http.get(Constants.APIGUIA + this.getGuiaCall + data);
  }

  PostBultos(data) {
    return this.http.post(Constants.APIGUIA + this.postBultosCall, data, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  GetCiudades(data) {
    return this.http.get(Constants.APIGUIA + this.getCiudadesCall + data, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  PostInfoGuia(data) {
    return this.http.post(Constants.APIGUIA + this.postInfoGuiaCall, data, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  SetDatosGuia(data) {
    return this.http.put(Constants.APIGUIA + this.putSetDatosGuiaCall, data, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  PostSolicitarGuia(data) {
    return this.http.post(Constants.GUIA, data, {
      headers: this.generateGuideHeaders()
    });
  }

  setToken(data) {
    this.token.next(data);
  }

  getAutorizar(): Observable<HttpResponse<any>> {
    return this.http.get(Constants.AUTH, {
      headers: this.generateBasicHeadersJWT(),
      observe: 'response'
    });
  }
}
