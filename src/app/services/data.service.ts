import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
      'Ocp-Apim-Subscription-Key': environment.SUBSCRIPTIONKEY,
      Authorization: 'Bearer ' + this.token.value
    });
  }

  protected proveedoresJWT(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': environment.SUBSCRIPTIONKEYCONFIGURACION,
      Authorization: 'Bearer ' + this.token.value
    });
  }

  protected generateGuideHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(environment.USRPASSWD)
    });
  }

  getDatosProveedor(data) {
    return this.http.get(
      environment.APIPROVEEDOR + this.getDatosProveedorCall + '/' + data,
      {
        headers: this.generateBasicHeadersJWT()
      }
    );
  }

  getProveedores() {
    return this.http.get(environment.APIORDENDECOMPRA + this.getProveedoresCall, {
      headers: {
        'Ocp-Apim-Subscription-Key': environment.SUBSCRIPTIONKEYCONFIGURACION,
      }
    });
  }

  getEstados() {
    return this.http.get(environment.APIORDENDECOMPRA + this.getEstadosCall, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  postTablaPrincipalOC(data) {
    return this.http.post(
      environment.APIORDENDECOMPRA + this.postTablaPrincipalOCCall,
      data,
      {
        headers: this.generateBasicHeadersJWT()
      }
    );
  }

  GetInfoBaseOc(data) {
    return this.http.get(
      environment.APIORDENDECOMPRA + this.getInfoBaseOcCall + data,
      {
        headers: this.generateBasicHeadersJWT()
      }
    );
  }

  GetGuia(data) {
    return this.http.get(environment.APIGUIA + this.getGuiaCall + data);
  }

  PostBultos(data) {
    return this.http.post(environment.APIGUIA + this.postBultosCall, data, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  GetCiudades(data) {
    return this.http.get(environment.APIGUIA + this.getCiudadesCall + data, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  PostInfoGuia(data) {
    return this.http.post(environment.APIGUIA + this.postInfoGuiaCall, data, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  SetDatosGuia(data) {
    return this.http.put(environment.APIGUIA + this.putSetDatosGuiaCall, data, {
      headers: this.generateBasicHeadersJWT()
    });
  }

  PostSolicitarGuia(data) {
    return this.http.post(environment.GUIA, data, {
      headers: this.generateGuideHeaders()
    });
  }

  setToken(data) {
    this.token.next(data);
  }

  getAutorizar(): Observable<HttpResponse<any>> {
    return this.http.get(environment.AUTH, {
      headers: this.generateBasicHeadersJWT(),
      observe: 'response'
    });
  }
}
