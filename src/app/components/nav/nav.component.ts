import { Component, OnInit } from '@angular/core';
import { NavItem } from 'src/app/models/navItem.model';
import * as constants from '../../constants/constants';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  constants = constants;
  navItems: NavItem[] = [
    {
      text: constants.strings.start,
      link: constants.links.home
    },
    {
      text: constants.strings.details,
      link: constants.links.details,
    },
    {
      text: constants.strings.tracking,
      link: constants.links.tracking,
    },
    {
      text: constants.strings.guide,
      link: constants.links.guide,
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
