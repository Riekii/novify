export interface Album {
  artist: string;
  artistId: string;
  artists: Array<{
    id: string;
    name: string;
    albumCount?: number;
    artistImageUrl?: string;
  }>;
  coverArt: string;
  created: string;
  discTitles: unknown[];
  displayArtist: string;
  duration: number;
  explicitStatus: string;
  genre: string;
  genres: Array<{
    value: string;
    name?: string;
  }>;
  id: string;
  isCompilation: boolean;
  moods: unknown[];
  musicBrainzId: string;
  name: string;
  originalReleaseDate: {
    year?: number;
    month?: number;
    day?: number;
  };
  recordLabels: unknown[];
  releaseDate: {
    year?: number;
    month?: number;
    day?: number;
  };
  releaseTypes: unknown[];
  songCount: number;
  sortName: string;
  userRating: number;
  version: string;
  year: number;
}
