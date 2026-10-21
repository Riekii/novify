import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AudioService, AudioState } from '../../../services/audio.service';
import { Novify } from '../../../services/novify';
import { Song } from '../../shared/song/song';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, Song],
  templateUrl: './songs.html',
  styleUrl: './songs.scss',
})
export class Songs implements OnInit, OnDestroy {
  constructor(
    public novify: Novify,
    private cdr: ChangeDetectorRef,
    private readonly audioService: AudioService
  ) {
    this.audioState$ = this.audioService.getState();
  }

  @Input() page?: string;

  public songs: any[] = [];
  public query = '';
  public loading = false;
  public audioState$: Observable<AudioState>;
  public isMobile = window.innerWidth <= 500;

  private readonly pageSize = 50;
  private hasMore = true;
  private requestId = 0;
  private observer?: IntersectionObserver;
  private sentinelEl?: HTMLElement;
  private readonly search$ = new Subject<string>();
  private searchSub?: Subscription;

  @ViewChild('sentinel') set sentinel(element: ElementRef<HTMLElement> | undefined) {
    this.sentinelEl = element?.nativeElement;
    this.observer?.disconnect();
    if (!this.sentinelEl) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.loadSongs();
        }
      },
      { rootMargin: '200px' }
    );
    this.observer.observe(this.sentinelEl);
  }

  ngOnInit(): void {
    this.searchSub = this.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.resetAndLoad(value));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.searchSub?.unsubscribe();
  }

  onSearch(value: string): void {
    this.query = value;
    this.search$.next(value.trim());
  }

  private resetAndLoad(value: string): void {
    this.requestId++;
    this.songs = [];
    this.hasMore = true;
    this.loading = false;
    this.query = value;
    this.loadSongs();
  }

  loadSongs(): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;
    const currentRequest = this.requestId;

    this.novify
      .getSongs({
        query: this.query.trim(),
        songCount: this.pageSize,
        songOffset: this.songs.length,
        artistCount: 0,
        albumCount: 0,
      })
      .subscribe({
        next: (data: any) => {
          if (currentRequest !== this.requestId) {
            return;
          }

          const rawSongs = data?.['subsonic-response']?.searchResult3?.song ?? [];
          const newSongs = Array.isArray(rawSongs) ? rawSongs : rawSongs ? [rawSongs] : [];

          this.hasMore = newSongs.length === this.pageSize;
          this.songs = [...this.songs, ...newSongs];
          this.loading = false;
          this.cdr.detectChanges();

          // Si la lista no llena la pantalla, el centinela sigue visible: se re-observa para pedir más.
          if (this.hasMore && this.sentinelEl && this.observer) {
            this.observer.unobserve(this.sentinelEl);
            this.observer.observe(this.sentinelEl);
          }
        },
        error: () => {
          if (currentRequest !== this.requestId) {
            return;
          }
          this.loading = false;
          this.cdr.detectChanges();
          console.error('No se pudo cargar la lista de canciones.');
        },
      });
  }

  playSong(song: any): void {
    const state = this.audioService.getCurrentState();
    if (state.currentSong?.id === song.id) {
      if (state.isPlaying) {
        this.audioService.pause();
      } else {
        this.audioService.resume();
      }
      return;
    }

    this.audioService.play(song, this.novify.getStreamUrl(song.id));
  }
}
