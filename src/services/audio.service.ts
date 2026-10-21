import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentSong: any | null;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio: HTMLAudioElement;
  private audioState$ = new BehaviorSubject<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentSong: null,
  });

  private songEnded$ = new Subject<void>();

  constructor() {
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      const state = this.audioState$.value;
      this.audioState$.next({
        ...state,
        currentTime: this.audio.currentTime,
      });
    });

    this.audio.addEventListener('loadedmetadata', () => {
      const state = this.audioState$.value;
      this.audioState$.next({
        ...state,
        duration: this.audio.duration,
      });
    });

    this.audio.addEventListener('play', () => {
      const state = this.audioState$.value;
      this.audioState$.next({ ...state, isPlaying: true });
    });

    this.audio.addEventListener('pause', () => {
      const state = this.audioState$.value;
      this.audioState$.next({ ...state, isPlaying: false });
    });

    this.audio.addEventListener('ended', () => {
      const state = this.audioState$.value;
      this.audioState$.next({
        ...state,
        isPlaying: false,
        currentTime: 0,
      });
      this.songEnded$.next();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Error de audio:', this.audio.error);
    });
  }

  play(song: any, url: string): void {
    if (this.audio.src !== url) {
      this.audio.src = url;
      this.audio.crossOrigin = 'anonymous'; // Permitir CORS
      const state = this.audioState$.value;
      this.audioState$.next({
        ...state,
        currentSong: song,
      });
    }
    this.audio.play().catch(error => {
      console.error('Error al reproducir audio:', error);
    });
  }

  pause(): void {
    this.audio.pause();
  }

  resume(): void {
    this.audio.play();
  }

  setTime(time: number): void {
    this.audio.currentTime = time;
  }

  getState(): Observable<AudioState> {
    return this.audioState$.asObservable();
  }

  getCurrentState(): AudioState {
    return this.audioState$.value;
  }

  onSongEnded(): Observable<void> {
    return this.songEnded$.asObservable();
  }
}
