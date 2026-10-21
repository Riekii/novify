import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Novify } from '../../../services/novify';
import { Card } from '../../shared/card/card';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './albums.html',
  styleUrl: './albums.scss',
})
export class Albums implements OnInit, OnDestroy {
  constructor(
    public novify: Novify,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() albums: any[] = [];
  @Input() page?: string;

  private readonly pageSize = 50;
  private observer?: IntersectionObserver;
  private sentinelEl?: HTMLElement;
  private loading = false;
  private hasMore = true;

  @ViewChild('sentinel') set sentinel(element: ElementRef<HTMLElement> | undefined) {
    this.sentinelEl = element?.nativeElement;
    this.observer?.disconnect();
    if (!this.sentinelEl) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.loadAlbums();
        }
      },
      { rootMargin: '200px' }
    );
    this.observer.observe(this.sentinelEl);
  }

  ngOnInit(): void {
    this.albums = [];
    this.loadAlbums();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  loadAlbums(): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;
    this.novify
      .getAlbums({ type: 'alphabeticalByName', size: this.pageSize, offset: this.albums.length })
      .subscribe({
        next: (data: any) => {
          const rawAlbums = data?.['subsonic-response']?.albumList2?.album ?? data?.albums ?? [];
          const newAlbums = Array.isArray(rawAlbums) ? rawAlbums : rawAlbums ? [rawAlbums] : [];

          this.hasMore = newAlbums.length === this.pageSize;
          this.albums = [...this.albums, ...newAlbums];
          this.loading = false;
          this.cdr.detectChanges();

          // Si la lista aún no llena la pantalla, el centinela sigue visible: se re-observa para disparar otra carga.
          if (this.hasMore && this.sentinelEl && this.observer) {
            this.observer.unobserve(this.sentinelEl);
            this.observer.observe(this.sentinelEl);
          }
        },
        error: () => {
          this.loading = false;
          console.error('No se pudo cargar la lista de álbumes.');
        },
      });
  }
}
