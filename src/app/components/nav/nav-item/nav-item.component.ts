import { Component, OnInit, Input } from '@angular/core';
import { NavItem } from 'src/app/models/navItem.model';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {
  @Input() data: NavItem;
  constructor() { }

  ngOnInit() {
  }

}
