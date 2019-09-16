import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import * as strings from '../../constants/constants';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { filter } from 'rxjs/operators';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ComponentsService } from 'src/app/services/components.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-generate-order-guide',
  templateUrl: './generate-order-guide.component.html',
  styleUrls: ['./generate-order-guide.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class GenerateOrderGuideComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) stepper;
  strings = strings;
  alert: string;
  skus: number[];
  oc: number;
  stepSkus;
  stepBultos;

  constructor(
    public dialogRef: MatDialogRef<GenerateOrderGuideComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _componentService: ComponentsService,
    _formBuilder: FormBuilder,
    private _dataService: DataService
  ) {
    this.stepSkus = _formBuilder.group({
      skusContinue: [false, Validators.required]
    });
    this.stepBultos = _formBuilder.group({});
  }
  ngOnInit() {
    this._componentService.setCloseDialog(false);
    this._componentService.setSteps({
      two: false,
      three: false,
      four: false
    });
    this._componentService.closeDialog().subscribe(close => {
      if (close) {
        setTimeout(() => this.closeDialog(), 3000);
      }
    });
    this.oc = this.data.data.ordenCompra[0]['PMG_PO_NUMBER'];
    this._dataService
      .GetInfoBaseOc(this.oc)
      .toPromise()
      .then(data => this._componentService.setInfoBaseOC(data['Value'][0]));
    this.skus = this.data.data.ordenCompra.map(
      number =>
        (number = {
          guia: number['GUIA'],
          sku: number['PRD_LVL_NUMBER'],
          description: number['PRD_NAME_FULL']
        })
    );
    if (this.skus) {
      this._componentService.aux.next(true);
    }
  }

  ngOnDestroy() {}

  closeDialog() {
    this.dialogRef.close();
  }
}
