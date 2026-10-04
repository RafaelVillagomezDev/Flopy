export interface TrackItem {
  wrapperType: 'track';
  artistId: number;
  artistName: string;
  trackId: number;
  trackName: string;
  trackViewUrl: string;
  previewUrl: string;
  artworkUrl100: string;
  releaseDate: string;
  collectionId?: number;
  collectionName?: string;
  collectionViewUrl?: string;
  albumArtwork?: string;
}