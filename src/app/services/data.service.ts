import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment, type } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

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

  constructor(private http: HttpClient, store: Store<AppState>) {}

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
        headers: type.internet ? this.generateBasicHeadersJWT() : null
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
      headers: type.internet ? this.generateBasicHeadersJWT() : null
    });
  }

  postTablaPrincipalOC(data) {
    return this.http.post(
      environment.APIORDENDECOMPRA + this.postTablaPrincipalOCCall,
      data,
      {
        headers: type.internet ? this.generateBasicHeadersJWT() : null
      }
    );
  }

  GetInfoBaseOc(data) {
    return this.http.get(
      environment.APIORDENDECOMPRA + this.getInfoBaseOcCall +
      data,
      {
        headers: type.internet ? this.generateBasicHeadersJWT() : null
      }
    );
  }

  GetGuia(data) {
    return this.http.get(environment.APIGUIA + this.getGuiaCall + data);
  }

  PostBultos(data) {
    return this.http.post(environment.APIGUIA + this.postBultosCall, data, {
      headers: type.internet ? this.generateBasicHeadersJWT() : null
    });
  }

  GetCiudades(data) {
    return this.http.get(environment.APIGUIA + this.getCiudadesCall + data, {
      headers: type.internet ? this.generateBasicHeadersJWT() : null
    });
  }

  PostInfoGuia(data) {
    return this.http.post(environment.APIGUIA + this.postInfoGuiaCall, data, {
      headers: type.internet ? this.generateBasicHeadersJWT() : null
    });
  }

  SetDatosGuia(data) {
    return this.http.put(environment.APIGUIA + this.putSetDatosGuiaCall, data, {
      headers: type.internet ? this.generateBasicHeadersJWT() : null
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
      headers: type.internet ? this.generateBasicHeadersJWT() : null,
      observe: 'response'
    });
  }
}
