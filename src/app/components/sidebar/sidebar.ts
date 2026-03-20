import { Component } from '@angular/core';
import { SIDEBAR_MENU_ITEMS } from '../../constants/sidebar.constants';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroHome, heroCog6Tooth } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon, TranslateModule],
  providers: [provideIcons({ heroHome, heroCog6Tooth })],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  /** Sidebar menu items signal */
  readonly menuItems = SIDEBAR_MENU_ITEMS;
}
