import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Novify } from '../../../services/novify';

@Component({
  selector: 'app-songs',
  imports: [],
  templateUrl: './songs.html',
  styleUrl: './songs.scss',
})
export class Songs {
  constructor(
    public novify: Novify,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() page?: string;

  public songs: any[] = [];

  ngOnInit(): void {
    this.loadSongs();
  }
 
  ngOnChanges(): void { 
    this.loadSongs();
  }

  loadSongs(): void {
    this.novify.getSongs({ type: 'alphabeticalByName', size: 200 }).subscribe({
      next: (data: any) => {
        const rawSongs = data?.['subsonic-response']?.searchResult3?.song ?? data?.songs ?? [];
        this.songs = Array.isArray(rawSongs) ? rawSongs : rawSongs ? [rawSongs] : [];
        this.cdr.detectChanges();
      },
      error: () => console.error('No se pudo cargar la lista de canciones.'),
    });
  }
}
