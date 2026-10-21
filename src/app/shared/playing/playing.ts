import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AudioService, AudioState } from '../../../services/audio.service';
import { Novify } from '../../../services/novify';
import { Observable, Subscription, distinctUntilChanged, map } from 'rxjs';
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
  private songSub?: Subscription;
  private stateSub?: Subscription;
  private coverSub?: Subscription;
  private faviconUrl?: string;

  faPlay = faPlay;
  faPause = faPause;
  faStop = faStop;
  faForward = faForward;
  faBackward = faBackward;

  constructor(
    private readonly audioService: AudioService,
    private readonly novify: Novify,
    private readonly titleService: Title,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.audioState$ = this.audioService.getState();
  }

  ngOnInit(): void {
    this.endedSub = this.audioService.onSongEnded().subscribe(() => this.playRandomSong());
    this.songSub = this.audioState$
      .pipe(
        map((state) => state.currentSong),
        distinctUntilChanged((a, b) => a?.id === b?.id)
      )
      .subscribe((song) => this.updatePageInfo(song));
    this.stateSub = this.audioState$.subscribe((state) => this.updatePlaybackState(state));
    this.registerMediaActions();
  }

  ngOnDestroy(): void {
    this.endedSub?.unsubscribe();
    this.songSub?.unsubscribe();
    this.stateSub?.unsubscribe();
    this.coverSub?.unsubscribe();
    this.revokeFavicon();
  }

  private updatePageInfo(song: any): void {
    this.coverSub?.unsubscribe();
    if (!song) {
      return;
    }

    this.titleService.setTitle(song.artist ? `${song.title} - ${song.artist}` : song.title);
    this.setMediaMetadata(song);

    const coverId = song.coverArt ?? song.albumId ?? song.id;
    this.coverSub = this.novify.getCoverArt(coverId, 512).subscribe({
      next: (blob) => {
        this.setFavicon(blob);
        this.setMediaMetadata(song, blob);
      },
      error: () => console.error('No se pudo cargar la carátula.'),
    });
  }

  // Alimenta la pantalla de bloqueo, el Centro de control del iPhone y el Apple Watch.
  private setMediaMetadata(song: any, cover?: Blob): void {
    if (!('mediaSession' in navigator)) {
      return;
    }

    const base = { title: song.title, artist: song.artist ?? '', album: song.album ?? '' };
    if (!cover) {
      navigator.mediaSession.metadata = new MediaMetadata(base);
      return;
    }

    // Una URL de datos es más fiable en Safari que una URL blob.
    const reader = new FileReader();
    reader.onload = () => {
      if (this.audioService.getCurrentState().currentSong?.id !== song.id) {
        return;
      }
      navigator.mediaSession.metadata = new MediaMetadata({
        ...base,
        artwork: [{ src: reader.result as string, sizes: '512x512', type: cover.type || 'image/jpeg' }],
      });
    };
    reader.readAsDataURL(cover);
  }

  private updatePlaybackState(state: AudioState): void {
    if (!('mediaSession' in navigator)) {
      return;
    }

    navigator.mediaSession.playbackState = !state.currentSong ? 'none' : state.isPlaying ? 'playing' : 'paused';

    if (state.duration > 0 && isFinite(state.duration)) {
      try {
        navigator.mediaSession.setPositionState({
          duration: state.duration,
          position: Math.min(state.currentTime, state.duration),
          playbackRate: 1,
        });
      } catch {
        // Algunos navegadores rechazan valores transitorios.
      }
    }
  }

  private registerMediaActions(): void {
    if (!('mediaSession' in navigator)) {
      return;
    }

    const session = navigator.mediaSession;
    session.setActionHandler('play', () => this.audioService.resume());
    session.setActionHandler('pause', () => this.audioService.pause());
    session.setActionHandler('nexttrack', () => this.playRandomSong());
    session.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        this.audioService.setTime(details.seekTime);
      }
    });
  }

  private setFavicon(blob: Blob): void {
    this.revokeFavicon();
    this.faviconUrl = URL.createObjectURL(blob);

    let link = this.document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'icon';
      this.document.head.appendChild(link);
    }
    link.type = blob.type || 'image/jpeg';
    link.href = this.faviconUrl;
  }

  private revokeFavicon(): void {
    if (this.faviconUrl) {
      URL.revokeObjectURL(this.faviconUrl);
      this.faviconUrl = undefined;
    }
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
