import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { Novify } from '../../../services/novify';
import { AudioService, AudioState } from '../../../services/audio.service';

@Component({
  selector: 'app-album-details',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './album-details.html',
  styleUrls: ['./album-details.scss'],
})
export class AlbumDetails implements OnChanges {
  @Input() album?: any;
  @Input() coverArt?: any;

  audioState$: Observable<AudioState>;

  // ICONOS
  faPlay = faPlay;
  faPause = faPause;
  faStop = faStop;


  @Output() close = new EventEmitter<boolean>();

  public songs: any[] = [];
  public state: any;

  constructor(
    private readonly novify: Novify,
    private readonly cdr: ChangeDetectorRef,
    private readonly audioService: AudioService) {
    this.audioState$ = this.audioService.getState();
    this.state = this.audioService.getCurrentState();
  }

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
    let url = this.novify.getStreamUrl(song.id);
    this.state = this.audioService.getCurrentState();
    if (!this.state || !this.state.currentSong || this.state.isPlaying === false || this.state.currentSong.id !== song.id) {
      if (url) {
        this.audioService.play(song, url);
      } else {
        console.error('No URL found for song', song);
      }
    }
    else {
      this.audioService.pause();
    }

    this.state = this.audioService.getCurrentState();
    this.cdr.detectChanges();
    console.log('Current state:', this.state);



  }
}
