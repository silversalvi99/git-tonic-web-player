import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroHome } from '@ng-icons/heroicons/outline';
import { SIDEBAR_MENU_ITEMS } from '../../constants/sidebar.constants';

@Component({
  selector: 'app-tabs',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons({ heroHome })],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  readonly menuItems = SIDEBAR_MENU_ITEMS;
}
