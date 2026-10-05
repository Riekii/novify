import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { Novify } from '../../../services/novify';
import { Card } from '../../shared/card/card';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './albums.html',
  styleUrl: './albums.scss',
})
export class Albums implements OnInit, OnChanges {
  constructor(
    public novify: Novify,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() albums: any[] = [];
  @Input() page?: string;

  ngOnInit(): void {
    this.loadAlbums();
  }
 
  ngOnChanges(): void { 
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.novify.getAlbums({ type: 'alphabeticalByName', size: 200 }).subscribe({
      next: (data: any) => {
        const rawAlbums = data?.['subsonic-response']?.albumList2?.album ?? data?.albums ?? [];
        this.albums = Array.isArray(rawAlbums) ? rawAlbums : rawAlbums ? [rawAlbums] : [];
        this.cdr.detectChanges();
      },
      error: () => console.error('No se pudo cargar la lista de álbumes.'),
    });
  }
}
