import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AudioService, AudioState } from '../../../services/audio.service';
import { Novify } from '../../../services/novify';
import { Song } from '../../shared/song/song';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, Song],
  templateUrl: './playlist.html',
  styleUrl: './playlist.scss',
})
export class Playlist implements OnInit {
  playlists: any[] = [];
  selected: any = null;
  songs: any[] = [];
  newName = '';
  loading = false;
  audioState$: Observable<AudioState>;

  constructor(
    private readonly novify: Novify,
    private readonly audioService: AudioService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.audioState$ = this.audioService.getState();
  }

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.novify.getPlaylists().subscribe({
      next: (data: any) => {
        const raw = data?.['subsonic-response']?.playlists?.playlist ?? [];
        this.playlists = Array.isArray(raw) ? raw : [raw];
        this.cdr.detectChanges();
      },
      error: () => console.error('No se pudieron cargar las playlists.'),
    });
  }

  createPlaylist(): void {
    const name = this.newName.trim();
    if (!name) {
      return;
    }

    this.novify.createPlaylist(name).subscribe({
      next: () => {
        this.newName = '';
        this.loadPlaylists();
      },
      error: () => console.error('No se pudo crear la playlist.'),
    });
  }

  open(playlist: any): void {
    this.selected = playlist;
    this.songs = [];
    this.loading = true;

    this.novify.getPlaylist(playlist.id).subscribe({
      next: (data: any) => {
        const raw = data?.['subsonic-response']?.playlist?.entry ?? [];
        this.songs = Array.isArray(raw) ? raw : [raw];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        console.error('No se pudo cargar la playlist.');
      },
    });
  }

  back(): void {
    this.selected = null;
    this.loadPlaylists();
  }

  playSong(song: any): void {
    const state = this.audioService.getCurrentState();
    if (state.currentSong?.id === song.id) {
      state.isPlaying ? this.audioService.pause() : this.audioService.resume();
      return;
    }
    this.audioService.play(song, this.novify.getStreamUrl(song.id));
  }
}
