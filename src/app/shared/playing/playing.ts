import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService, AudioState } from '../../../services/audio.service';
import { Observable } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-playing',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './playing.html',
  styleUrl: './playing.scss',
})
export class Playing implements OnInit {
  audioState$: Observable<AudioState>;

  faPlay = faPlay;
  faPause = faPause;
  faStop = faStop;

  constructor(private readonly audioService: AudioService) {
    this.audioState$ = this.audioService.getState();
  }

  ngOnInit(): void {}

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
