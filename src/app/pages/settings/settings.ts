import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSettingComponent } from './components/language-setting/language-setting';
import { ThemeSettingComponent } from './components/theme-setting/theme-setting';
import { AccountSettingComponent } from './components/account-setting/account-setting';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    TranslateModule,
    LanguageSettingComponent,
    ThemeSettingComponent,
    AccountSettingComponent,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {}
