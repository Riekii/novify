import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Novify } from '../../../services/novify';

@Component({
  selector: 'app-album-details',
  imports: [CommonModule],
  templateUrl: './album-details.html',
  styleUrl: './album-details.scss',
})
export class AlbumDetails implements OnInit {
  @Input() album?: any;
  @Input() coverArt?: any;

  @Output() close = new EventEmitter<boolean>(false);

  constructor(
    private novify: Novify
  ) {}

  ngOnInit(): void {
    console.log(this.album);
  }
}
