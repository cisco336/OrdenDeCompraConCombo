import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import * as strings from "../../constants/constants";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Subscription, Observable } from "rxjs";
import { ComponentsService } from "src/app/services/components.service";
import { startWith, map } from "rxjs/operators";
import { Proveedor } from "src/app/interfaces/interfaces";

@Component({
  selector: "app-origin-deliver-address",
  templateUrl: "./origin-deliver-address.component.html",
  styleUrls: ["./origin-deliver-address.component.scss"]
})
export class OriginDeliverAddressComponent implements OnInit, OnDestroy {
  @ViewChild("direccionDestino", { static: true }) direccionDestino: ElementRef;
  @ViewChild("ciudadDestino", { static: true }) ciudadDestino: ElementRef;
  strings = strings;
  addresses;
  citiesSubscription: Subscription;
  TAG = "DANESAPS";
  filteredOrigen: Observable<any>;
  filteredDestino: Observable<any>;
  ciudades;
  destinos;
  transportadora;
  oc;
  error;

  constructor(
    _formBuilder: FormBuilder,
    private _dataService: DataService,
    private _componentService: ComponentsService
  ) {
    this.addresses = _formBuilder.group({
      originAddress: ["", Validators.required],
      originCity: ["", Validators.required],
      destinyAddress: ["", Validators.required],
      destinyCity: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.addresses
      .get("originAddress")
      .valueChanges.subscribe(originAddress => {
        const y = this._componentService.infoBaseOC.value;
        const x = {
          CEDULA: y.CEDULA,
          CIUDAD_CTE: y.CIUDAD_CTE,
          CIUDAD_FACTURACION: y.CIUDAD_FACTURACION,
          CLIENTE: y.CLIENTE,
          CODIGO_DANE_DESTINO: y.CODIGO_DANE_DESTINO,
          CODIGO_DANE_ORIGEN: y.CODIGO_DANE_ORIGEN,
          DIRECCION_CTE: y.DIRECCION_CTE,
          DIRECCION_ENTREGA: y.DIRECCION_ENTREGA,
          DIRECCION_FACTURACION: y.DIRECCION_FACTURACION,
          DIRECCION_ORIGEN: originAddress,
          NOTA_PEDIDO: y.NOTA_PEDIDO,
          OBSERVACIONES: y.OBSERVACIONES,
          ORIGEN: y.ORIGEN,
          PMG_PO_NUMBER: y.PMG_PO_NUMBER,
          PROVEEDOR: y.PROVEEDOR,
          STICKER: y.STICKER,
          TELEFONOS: y.TELEFONOS,
          TIPO_ENTREGA: y.TIPO_ENTREGA,
          TRANSPORTADORA: y.TRANSPORTADORA
        };
        this._componentService.infoBaseOC.next(x);
      });
    this._dataService.GetCiudades(this.TAG).subscribe(
      ciudades => {
        if (!ciudades) {
          this.error = strings.errorMessagesText.citiesError;
          setTimeout(() => (this.error = ""), 3000);
        } else {
          this.ciudades = ciudades["Value"];
          this.destinos = ciudades["Value"];
          this.filteredOrigen = this.addresses
            .get("originCity")
            .valueChanges.pipe(
              startWith(""),
              map(value =>
                typeof value === "string" ? value : value["DESCRIPCION"]
              ),
              map(descripcion =>
                descripcion
                  ? this._filterOrigenes(descripcion)
                  : this.ciudades.slice()
              )
            );
          this.filteredDestino = this.addresses
            .get("destinyCity")
            .valueChanges.pipe(
              startWith(""),
              map(value =>
                typeof value === "string" ? value : value["DESCRIPCION"]
              ),
              map(descripcion =>
                descripcion
                  ? this._filterOrigenes(descripcion)
                  : this.ciudades.slice()
              )
            );
          const form = this.addresses;
          const component = this._componentService;
          const origen = this._componentService.getDireccionOrigen().value
            .ciudad;
          const destino = this._componentService.direccionDestino.value.ciudad;
          const ciudadOrigen = this.ciudades.filter(s => s.ID === origen);
          const ciudadDestino = this.ciudades.filter(s => s.ID === destino);
          form
            .get("originAddress")
            .setValue(component.direccionOrigen.value.direccion);
          form
            .get("destinyAddress")
            .setValue(component.direccionDestino.value.direccion);
          form.get("originCity").setValue(ciudadOrigen[0]);
          form.get("destinyCity").setValue(ciudadDestino[0]);
          /* Direcciones */
          form.get("originAddress").valueChanges.subscribe(a => {
            let ciudad = form.get("originCity").value;
            this._componentService.direccionOrigen.next({
              direccion: a,
              ciudad: ciudad.ID
            });
          });
          form.get("destinyAddress").valueChanges.subscribe(b => {
            let ciudad = form.get("destinyCity").value;
            this._componentService.direccionDestino.next({
              direccion: b,
              ciudad: ciudad.ID
            });
          });

          /* Ciudades */
          form.get("originCity").valueChanges.subscribe(a => {
            this._componentService.direccionOrigen.next({
              direccion: form.get("originAddress").value,
              ciudad: a.ID
            });
          });

          form.get("destinyCity").valueChanges.subscribe(b =>
            this._componentService.direccionDestino.next({
              direccion: form.get("destinyAddress").value,
              ciudad: b.ID
            })
          );

          this.addresses.valueChanges.subscribe(value => {
            this._componentService.setIsValidAddress(this.addresses.valid);
          });
        }
      },
      () => {}
    );
  }

  ngOnDestroy() {}

  private _filterOrigenes(DESCRIPCION) {
    const filterValue = DESCRIPCION.toLowerCase();

    return this.ciudades.filter(
      option => option["DESCRIPCION"].toLowerCase().indexOf(filterValue) >= 0
    );
  }

  displayOrigen(data?: any): string | undefined {
    return data ? data["DESCRIPCION"] : undefined;
  }
}
