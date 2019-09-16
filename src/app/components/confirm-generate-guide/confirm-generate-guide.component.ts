import { Component, OnInit } from '@angular/core';
import { Envia } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-confirm-generate-guide',
  templateUrl: './confirm-generate-guide.component.html',
  styleUrls: ['./confirm-generate-guide.component.scss']
})
export class ConfirmGenerateGuideComponent implements OnInit {
  respuestaGuia: Envia[];

  constructor(private _dataservice: DataService) { }

  ngOnInit() {
  }

  getGuia(data) {
    this._dataservice.GetGuia('envia').subscribe(getGuiaResponse => {
      });
  }

}
