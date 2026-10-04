export interface AlbumItem {
  wrapperType: 'collection';
  collectionId: number;
  collectionName: string;
  artistId: number;
  artistName: string;
  artworkUrl: string;
  collectionViewUrl: string;
  releaseDate: string;
  trackCount?: number;
}