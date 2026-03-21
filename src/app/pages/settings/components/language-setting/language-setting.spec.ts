import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSettingComponent } from './language-setting';
import { SettingsService } from '../../../../services/settings/settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';

describe('LanguageSettingComponent', () => {
  let component: LanguageSettingComponent;
  let fixture: ComponentFixture<LanguageSettingComponent>;
  let settingsServiceMock: any;

  beforeEach(async () => {
    settingsServiceMock = {
      settings: signal({ language: 'en', theme: 'dark' }),
      updateLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSettingComponent, TranslateModule.forRoot()],
      providers: [{ provide: SettingsService, useValue: settingsServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateLanguage when selection changes', () => {
    const select = fixture.nativeElement.querySelector('select');
    select.value = 'it';
    select.dispatchEvent(new Event('blur'));

    expect(settingsServiceMock.updateLanguage).toHaveBeenCalledWith('it');
  });

  it('should display the current language from the service', () => {
    const select = fixture.nativeElement.querySelector('select');
    expect(select.value).toBe('en');
  });
});
