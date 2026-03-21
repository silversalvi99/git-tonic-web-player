import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSettingComponent } from './theme-setting';
import { SettingsService } from '../../../../services/settings/settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';

describe('ThemeSettingComponent', () => {
  let component: ThemeSettingComponent;
  let fixture: ComponentFixture<ThemeSettingComponent>;
  let settingsServiceMock: any;

  beforeEach(async () => {
    settingsServiceMock = {
      settings: signal({ language: 'en', theme: 'dark' }),
      updateTheme: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeSettingComponent, TranslateModule.forRoot()],
      providers: [{ provide: SettingsService, useValue: settingsServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateTheme when a theme button is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    // themes: light (0), dark (1), system (2)
    buttons[0].click();

    expect(settingsServiceMock.updateTheme).toHaveBeenCalledWith('light');
  });

  it('should highlight the active theme button', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    // active is 'dark' (index 1)
    expect(buttons[1].classList.contains('ring-2')).toBe(true);
    expect(buttons[0].classList.contains('ring-2')).toBe(false);
  });
});
