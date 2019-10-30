import { Component, OnInit, Input } from '@angular/core';
import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() diameter: number;
  @Input() color: string;
  isLoading = false;
  constructor(private componentService: ComponentsService) {}

  ngOnInit() {
    this.componentService.isLoading.subscribe(loading => this.isLoading = loading);
  }

}
