import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountSettingComponent } from './account-setting';
import { TranslateModule } from '@ngx-translate/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Keycloak from 'keycloak-js';

describe('AccountSettingComponent', () => {
  let component: AccountSettingComponent;
  let fixture: ComponentFixture<AccountSettingComponent>;
  let keycloakMock: any;

  beforeEach(async () => {
    keycloakMock = {
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AccountSettingComponent, TranslateModule.forRoot()],
      providers: [{ provide: Keycloak, useValue: keycloakMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call keycloak logout when the logout button is clicked', () => {
    const button = fixture.nativeElement.querySelector('[data-testid="logout-button"]');
    button.click();

    expect(keycloakMock.logout).toHaveBeenCalled();
  });
});
