import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabs } from './tabs';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('TabsComponent', () => {
  let component: Tabs;
  let fixture: ComponentFixture<Tabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabs, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all tabs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    expect(links.length).toBe(component.menuItems().length);
  });
});
