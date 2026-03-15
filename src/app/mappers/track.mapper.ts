import { NavidromeSong, Track } from '../models/track.model';

export class TrackMapper {
  static fromNavidrome(song: NavidromeSong, baseUrl: string, authParams: string): Track {
    return {
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration,
      coverUrl: `${baseUrl}/getCoverArt.view?${authParams}&id=${song.id}`,
      streamUrl: `${baseUrl}/stream.view?${authParams}&id=${song.id}`,
    };
  }
}
