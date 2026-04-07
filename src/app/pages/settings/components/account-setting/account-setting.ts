import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftStartOnRectangle } from '@ng-icons/heroicons/outline';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-account-setting',
  standalone: true,
  imports: [TranslateModule, NgIcon],
  providers: [provideIcons({ heroArrowLeftStartOnRectangle })],
  templateUrl: './account-setting.html',
  styleUrl: './account-setting.css',
})
export class AccountSettingComponent {
  /** Keycloak service inject */
  private readonly keycloak = inject(Keycloak);

  /**
   * Performs logout
   */
  onLogout(): void {
    this.keycloak.logout();
  }
}
