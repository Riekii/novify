import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Album } from '../../interfaces/album';
import { Novify } from '../../../services/novify';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card implements OnChanges {
  @Input() album?: Album | null = null;

  public coverArt?: any;
  private observer?: IntersectionObserver;

  constructor(
    public novify: Novify,
    public cdr: ChangeDetectorRef,
    private element: ElementRef,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.lazyLoadCoverArt();
  }

  loadCoverArt(): void {
    this.novify.getCoverArt(this.album?.coverArt ?? '', 3000).subscribe((coverArt) => {
      this.coverArt = URL.createObjectURL(coverArt);
      this.cdr.detectChanges();
    });
  }

  lazyLoadCoverArt(): void {
   this.observer = new IntersectionObserver(
      entries => {

        if (entries[0].isIntersecting) {
          this.loadCoverArt();
        }

      },
      {
        rootMargin: '200px'
      }
    );

    this.observer.observe(this.element.nativeElement);
  }
}