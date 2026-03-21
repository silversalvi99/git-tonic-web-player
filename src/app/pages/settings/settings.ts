import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSettingComponent } from './components/language-setting/language-setting';
import { ThemeSettingComponent } from './components/theme-setting/theme-setting';

@Component({
  selector: 'app-settings',
  imports: [TranslateModule, LanguageSettingComponent, ThemeSettingComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {}
