import { UpperCasePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-song',
  standalone: true,
  imports: [UpperCasePipe, FaIconComponent],
  templateUrl: './song.html',
  styleUrl: './song.scss',
})
export class Song {
  song = input<any>();
  isCurrent = input(false);
  isPlaying = input(false);
  currentTime = input(0);
  duration = input(0);
  isMobile = input(false);

  play = output<any>();

  faPlay = faPlay;
  faPause = faPause;

  progress = computed(() => {
    if (!this.isCurrent()) {
      return 0;
    }
    const total = this.duration() || this.song()?.duration || 0;
    return total > 0 ? Math.min(100, (this.currentTime() / total) * 100) : 0;
  });

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
