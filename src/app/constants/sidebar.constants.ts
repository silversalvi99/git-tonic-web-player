import { signal } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';

export const SIDEBAR_MENU_ITEMS = signal<MenuItem[]>([
  { label: 'Home', route: '/home', icon: 'heroHome' },
]).asReadonly();
