export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverThumb: string;
  coverFull: string;
  streamUrl: string;
}

export interface NavidromeSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
}

interface SubsonicResponse<T> {
  'subsonic-response': {
    status: string;
    version: string;
    type: string;
    serverVersion: string;
  } & T;
}

export type RandomSongsResponse = SubsonicResponse<{
  randomSongs: {
    song: NavidromeSong[];
  };
}>;

export type SearchResponse = SubsonicResponse<{
  searchResult3: {
    song: NavidromeSong[];
  };
}>;
