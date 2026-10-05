import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Album } from '../../interfaces/album';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card implements OnChanges {
  @Input() album?: Album | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Card input changed:', this.album);
    console.log('Changes:', changes);
  }
}