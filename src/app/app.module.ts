import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {
  MatDatepickerModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatTabsModule,
  MatStepperModule,
  MatOptionModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatTableModule,
  MatDialogModule,
  MatPaginatorModule,
  MatToolbarModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatRippleModule,
  MatListModule,
  MatLineModule,
  MatMenuModule,
  MatBottomSheetModule,
  MatPaginatorIntl,
  MAT_DATE_LOCALE
} from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdenesCompraComponent } from './pages/ordenes-compra/ordenes-compra.component';
import { DialogDetallesComponent } from './components/dialog-detalles/dialog-detalles.component';
import { StepperDetallesComponent } from './components/stepper-detalles/stepper-detalles.component';
import { DialogCambioEstadoComponent } from './components/dialog-cambio-estado/dialog-cambio-estado.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TablaDetallesComponent } from './components/tabla-detalles/tabla-detalles.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { getSpanishPaginatorIntl } from './spanishPaginator';
import { PackagesConfigComponent } from './components/packages-config/packages-config.component';
import { OriginDeliverAddressComponent } from './components/origin-deliver-address/origin-deliver-address.component';
import { ConfirmGenerateGuideComponent } from './components/confirm-generate-guide/confirm-generate-guide.component';
import { GenerateOrderGuideComponent } from './components/generate-order-guide/generate-order-guide.component';
import { PackageUpdateConfirmComponent } from './components/package-update-confirm/package-update-confirm.component';
import { LoaderComponent } from './components/loader/loader.component';
import { loaderReducer } from './redux/reducers/loader.reducer';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/combo/environment.prod';

@NgModule({
  declarations: [
    AppComponent,
    OrdenesCompraComponent,
    DialogDetallesComponent,
    StepperDetallesComponent,
    DialogCambioEstadoComponent,
    TablaDetallesComponent,
    BottomSheetComponent,
    TrackingComponent,
    PackagesConfigComponent,
    OriginDeliverAddressComponent,
    ConfirmGenerateGuideComponent,
    GenerateOrderGuideComponent,
    PackageUpdateConfirmComponent,
    LoaderComponent
  ],
  entryComponents: [
    DialogDetallesComponent,
    DialogCambioEstadoComponent,
    BottomSheetComponent,
    GenerateOrderGuideComponent,
    PackageUpdateConfirmComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // #region Material
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatOptionModule,
    MatTableExporterModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatRippleModule,
    MatListModule,
    MatLineModule,
    MatMenuModule,
    MatBottomSheetModule,
    //#endregion Material

    HttpClientModule,
    RouterModule.forRoot([]),

    // DatePicker Range
    SatDatepickerModule,
    SatNativeDateModule,

    // Forms
    FormsModule,
    ReactiveFormsModule,

    // Toastr notifications
    ToastrModule.forRoot(),

    // REDUX
    StoreModule.forRoot({ loader: loaderReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
