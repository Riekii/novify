import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDownload, faPause, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Novify } from '../../../services/novify';

@Component({
  selector: 'app-song',
  standalone: true,
  imports: [UpperCasePipe, FaIconComponent],
  templateUrl: './song.html',
  styleUrl: './song.scss',
})
export class Song {
  private readonly novify = inject(Novify);

  song = input<any>();
  isCurrent = input(false);
  isPlaying = input(false);
  currentTime = input(0);
  duration = input(0);
  isMobile = input(false);
  playlists = input<any[]>([]);

  play = output<any>();
  addToPlaylist = output<{ song: any; playlistId: string }>();

  menuOpen = signal(false);

  faPlay = faPlay;
  faPause = faPause;
  faPlus = faPlus;
  faDownload = faDownload;

  downloadUrl = computed(() => {
    const id = this.song()?.id;
    return id ? this.novify.getDownloadUrl(id) : '';
  });

  progress = computed(() => {
    if (!this.isCurrent()) {
      return 0;
    }
    const total = this.duration() || this.song()?.duration || 0;
    return total > 0 ? Math.min(100, (this.currentTime() / total) * 100) : 0;
  });

  selectPlaylist(playlistId: string): void {
    this.addToPlaylist.emit({ song: this.song(), playlistId });
    this.menuOpen.set(false);
  }

  formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatSize(bytes: number): string {
    if (!bytes) return '';
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
