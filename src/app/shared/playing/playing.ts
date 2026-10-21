import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService, AudioState } from '../../../services/audio.service';
import { Novify } from '../../../services/novify';
import { Observable, Subscription } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay, faStop, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-playing',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './playing.html',
  styleUrl: './playing.scss',
})
export class Playing implements OnInit, OnDestroy {
  audioState$: Observable<AudioState>;
  private endedSub?: Subscription;

  faPlay = faPlay;
  faPause = faPause;
  faStop = faStop;
  faForward = faForward;
  faBackward = faBackward;

  constructor(
    private readonly audioService: AudioService,
    private readonly novify: Novify
  ) {
    this.audioState$ = this.audioService.getState();
  }

  ngOnInit(): void {
    this.endedSub = this.audioService.onSongEnded().subscribe(() => this.playRandomSong());
  }

  ngOnDestroy(): void {
    this.endedSub?.unsubscribe();
  }

  public playRandomSong(): void {
    this.novify.getRandomSongs({ size: 1 }).subscribe({
      next: (data: any) => {
        const raw = data?.['subsonic-response']?.randomSongs?.song ?? [];
        const song = Array.isArray(raw) ? raw[0] : raw;
        if (!song?.id) {
          return;
        }
        this.audioService.play(song, this.novify.getStreamUrl(song.id));
      },
      error: () => console.error('No se pudo cargar una canción aleatoria.'),
    });
  }

  togglePlayPause(): void {
    const state = this.audioService.getCurrentState();
    if (state.isPlaying) {
      this.audioService.pause();
    } else {
      this.audioService.resume();
    }
  }

  onProgressChange(event: any): void {
    const time = parseFloat(event.target.value);
    this.audioService.setTime(time);
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
