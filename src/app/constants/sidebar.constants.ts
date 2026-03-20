import { signal } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';

export const SIDEBAR_MENU_ITEMS = signal<MenuItem[]>([
  { label: 'sidebar.home', route: '/home', icon: 'heroHome' },
  { label: 'sidebar.settings', route: '/settings', icon: 'heroCog6Tooth' },
]).asReadonly();
