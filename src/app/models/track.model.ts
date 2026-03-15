export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  streamUrl: string;
}

export interface NavidromeSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
}

export interface SubsonicResponse {
  'subsonic-response': {
    status: string;
    version: string;
    type: string;
    serverVersion: string;
    randomSongs?: {
      song: NavidromeSong[];
    };
  };
}
