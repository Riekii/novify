import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Novify } from '../../../services/novify';

@Component({
  selector: 'app-album-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-details.html',
  styleUrl: './album-details.scss',
})
export class AlbumDetails implements OnChanges {
  @Input() album?: any;
  @Input() coverArt?: any;

  @Output() close = new EventEmitter<boolean>();

  public songs: any[] = [];

  constructor(
    private readonly novify: Novify,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['album'] && this.album?.id) {
      this.loadSongs();
      return;
    }

    this.songs = Array.isArray(this.album?.songs) ? this.album.songs : [];
  }

  private loadSongs(): void {
    const albumId = this.album?.id;

    if (!albumId) {
      this.songs = Array.isArray(this.album?.songs) ? this.album.songs : [];
      return;
    }

    this.novify.getAlbum(albumId).subscribe({
      next: (response: any) => {
        const albumData = response?.['subsonic-response']?.album ?? response?.album ?? null;
        const rawSongs = albumData?.song ?? albumData?.song ?? this.album?.song ?? [];

        this.songs = rawSongs.map((song: any) => ({
          ...song,
        }));

        console.warn(this.songs)
        this.cdr.detectChanges();
      },
      error: () => {
        this.songs = Array.isArray(this.album?.songs) ? this.album.songs : [];
      },
    });
  }

  playSong(song: any): void {
    console.log('Playing song:', song);
  }
}
