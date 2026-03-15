import { Component } from '@angular/core';
import { SIDEBAR_MENU_ITEMS } from '../../constants/sidebar.constants';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroHome } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons({ heroHome })],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  /** Sidebar menu items signal */
  readonly menuItems = SIDEBAR_MENU_ITEMS;
}
