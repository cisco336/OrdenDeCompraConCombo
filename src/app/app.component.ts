import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private _route: ActivatedRoute) {
    this._route.queryParams.subscribe(x => console.log(x));
  }
}
