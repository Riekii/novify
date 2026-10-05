export interface Song {
  id: string;
  parent: string;
  isDir: boolean;
  title: string;
  album: string;
  artist: string;
  track: number;
  year: number;
  genre: string;
  coverArt: string;
  size: number;
  contentType: string;
  suffix: string;
  duration: number;
  bitRate: number;
  path: string;
  discNumber: number;
  created: string;
  albumId: string;
  artistId: string;
  type: string;
  bpm: number;
  comment: string;
  sortName: string;
  mediaType: string;
  musicBrainzId: string;
  isrc: string[];
  genres: Array<{
    name: string;
  }>;
  replayGain: Record<string, unknown>;
  channelCount: number;
  samplingRate: number;
  bitDepth: number;
  moods: unknown[];
  artists: Array<{
    id: string;
    name: string;
  }>;
  displayArtist: string;
  albumArtists: Array<{
    id: string;
    name: string;
  }>;
  displayAlbumArtist: string;
  contributors: unknown[];
  displayComposer: string;
  explicitStatus: string;
  groupings: unknown[];
  works: unknown[];
  movements: unknown[];
}
