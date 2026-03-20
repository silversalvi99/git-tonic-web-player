import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchSongs as SearchSongsComponent } from './search-songs';
import { RestApi } from '../../services/api/rest-api';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('SearchSongsComponent', () => {
  let component: SearchSongsComponent;
  let fixture: ComponentFixture<SearchSongsComponent>;
  let mockRestApi: any;

  beforeEach(async () => {
    mockRestApi = {
      searchTerm: signal(''),
      refreshTracks: signal(0),
    };

    await TestBed.configureTestingModule({
      imports: [SearchSongsComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection(), { provide: RestApi, useValue: mockRestApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update searchTerm in RestApi when form changes', async () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'test search';
    input.dispatchEvent(new Event('input'));

    // uses value.set() for signal forms
    component.searchForm.search().value.set('test query');
    fixture.detectChanges();

    // Check if the searchTerm was updated in the service
    // Note: Since we are using an effect, it should update automatically
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for effect
    expect(mockRestApi.searchTerm()).toBe('test query');
  });

  it('should refresh and clear search on refresh() call', () => {
    component.searchForm.search().value.set('some search');
    component.refresh();

    expect(component.searchForm().value().search).toBe('');
    expect(mockRestApi.refreshTracks()).toBe(1);
  });
});
