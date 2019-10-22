import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class ComponentsService {
  selectedSku = new BehaviorSubject<any>("");
  estados = new BehaviorSubject<any>("");
  tablaDetalle = new BehaviorSubject<any>("");
  user = new BehaviorSubject<string>("");
  queryDetalles = new BehaviorSubject<any>("");
  infoBaseOC = new BehaviorSubject<any>("");
  ordenGuia = new BehaviorSubject<any>("");
  detalleOC = new BehaviorSubject<any>("");
  bulto = new BehaviorSubject<any>("");
  hasDetails = new BehaviorSubject<boolean>(false);
  resetBultos = new BehaviorSubject<boolean>(false);
  isTracking = new BehaviorSubject<boolean>(false);
  steps = new BehaviorSubject<{ two: false; three: false; four: false }>({
    two: false,
    three: false,
    four: false
  });
  magnitudes = new BehaviorSubject<any[]>([]);
  dataSourceBackup = new BehaviorSubject<any[]>([]);
  idBulto = new BehaviorSubject<any>("");
  idBultoPost = new BehaviorSubject<any>("");
  direccionOrigen = new BehaviorSubject<{
    direccion: string;
    ciudad: string;
  }>({
    direccion: "",
    ciudad: ""
  });
  bultos = new BehaviorSubject<any>([]);
  clearSkus = new BehaviorSubject<any>("");
  closeDialogBJ = new BehaviorSubject<boolean>(false);
  tracking = new BehaviorSubject<any>("");
  direccionDestino = new BehaviorSubject<{
    direccion: string;
    ciudad: string;
  }>({
    direccion: "",
    ciudad: ""
  });
  generaGuia = new BehaviorSubject<boolean>(false);
  fechasOC = new BehaviorSubject<{
    FECHA_MAXIMA_OC: string;
    FECHA_MINIMA_OC: string;
  }>({
    FECHA_MINIMA_OC: "",
    FECHA_MAXIMA_OC: ""
  });

  aux = new BehaviorSubject<boolean>(false);

  constructor() {}

  setGeneraGuia(data) {
    this.generaGuia.next(data);
  }
  setDireccionDestino(data) {
    this.direccionDestino.next(data);
  }

  setSelectedSku(data) {
    this.selectedSku.next(data);
  }

  getSelectedSku() {
    return this.selectedSku;
  }

  setEstados(data) {
    this.estados.next(data);
  }

  getEstados() {
    return this.estados;
  }

  setTablaDetalles(data) {
    this.tablaDetalle.next(data);
  }

  getTablaDetalles() {
    return this.tablaDetalle;
  }

  setUser(data) {
    return this.user.next(data);
  }

  getUser() {
    return this.user;
  }

  setQueryDetalles(data) {
    return this.queryDetalles.next(data);
  }

  getQueryDetalles() {
    return this.queryDetalles;
  }

  setInfoBaseOC(data) {
    return this.infoBaseOC.next(data);
  }

  getInfoBaseOC() {
    return this.infoBaseOC;
  }

  setQueryOrdenGuia(data) {
    return this.ordenGuia.next(data);
  }

  getOrdenGuia() {
    return this.ordenGuia;
  }
  setDetalleOC(data) {
    return this.detalleOC.next(data);
  }

  getDetalleOC() {
    return this.detalleOC;
  }

  setBulto(data) {
    return this.bulto.next(data);
  }
  getBulto() {
    return this.bulto;
  }
  setIsTracking(data) {
    return this.isTracking.next(data);
  }
  getIsTracking() {
    return this.isTracking;
  }
  setHasDetails(data) {
    return this.hasDetails.next(data);
  }
  getHasDetails() {
    return this.hasDetails;
  }
  setSteps(data) {
    return this.steps.next({ ...data });
  }
  getSteps() {
    return this.steps;
  }
  setMagnitudes(data) {
    return this.magnitudes.next(data);
  }
  getMagnitudes() {
    return this.magnitudes;
  }
  setDataSourceBackup(data) {
    return this.dataSourceBackup.next(data);
  }
  getDataSourceBackup() {
    return this.dataSourceBackup;
  }
  setResetBultos(data) {
    return this.resetBultos.next(data);
  }
  getResetBultos() {
    return this.resetBultos;
  }
  setIdBulto(data) {
    return this.idBulto.next(data);
  }
  getIdBulto() {
    return this.idBulto;
  }
  setIdBultoPost(data) {
    return this.idBultoPost.next(data);
  }
  getIdBultoPost() {
    return this.idBultoPost;
  }
  setBultos(data) {
    return this.bultos.next(data);
  }
  getBultos() {
    return this.bultos;
  }
  setClearSkus(data) {
    return this.clearSkus.next(data);
  }
  getClearSkus() {
    return this.clearSkus;
  }
  setDireccionOrigen(data) {
    return this.direccionOrigen.next(data);
  }
  getDireccionOrigen() {
    return this.direccionOrigen;
  }
  setCloseDialog(data) {
    return this.closeDialogBJ.next(data);
  }
  closeDialog() {
    return this.closeDialogBJ;
  }
  setTracking(data) {
    return this.tracking.next(data);
  }
  getTracking() {
    return this.tracking;
  }
}
