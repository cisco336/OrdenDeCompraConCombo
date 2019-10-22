import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-bottom-sheet-img',
  templateUrl: './bottom-sheet-img.component.html',
  styleUrls: ['./bottom-sheet-img.component.scss']
})
export class BottomSheetImgComponent implements OnInit {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetImgComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}
  @ViewChild('img', { static: true }) img: any;

  ngOnInit() {
  }

  closeSheet(data?) {
    this._bottomSheetRef.dismiss();
  }
}
