import { Component, OnInit, Input } from '@angular/core';
import { ComponentsService } from '../../services/components.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() diameter: number;
  @Input() color: string;
  isLoading = false;
  constructor(
    private componentService: ComponentsService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.subscribe(store => (this.isLoading = store.loader));
  }
}
