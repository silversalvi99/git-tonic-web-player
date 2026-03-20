import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroHome, heroCog6Tooth } from '@ng-icons/heroicons/outline';
import { SIDEBAR_MENU_ITEMS } from '../../constants/sidebar.constants';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  imports: [RouterLink, RouterLinkActive, NgIcon, TranslateModule],
  providers: [provideIcons({ heroHome, heroCog6Tooth })],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  readonly menuItems = SIDEBAR_MENU_ITEMS;
}
