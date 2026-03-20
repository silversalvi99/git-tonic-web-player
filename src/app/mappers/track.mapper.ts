import { NavidromeSong, Track } from '../models/track.model';

export class TrackMapper {
  static fromNavidrome(song: NavidromeSong, baseUrl: string, authParams: string): Track {
    return {
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration,
      coverThumb: `${baseUrl}/getCoverArt.view?${authParams}&id=${song.id}&size=120`,
      coverFull: `${baseUrl}/getCoverArt.view?${authParams}&id=${song.id}&size=600`,
      streamUrl: `${baseUrl}/stream.view?${authParams}&id=${song.id}`,
    };
  }
}
