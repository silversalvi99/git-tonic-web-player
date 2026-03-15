import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Tabs } from '../../components/tabs/tabs';
import { TracksList } from '../../components/tracks-list/tracks-list';
import { Player } from '../../components/player/player';

@Component({
  selector: 'app-home',
  imports: [Sidebar, Tabs, TracksList, Player],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
