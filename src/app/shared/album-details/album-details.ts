import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  ngOnInit(): void {
    console.log(this.album);
  }
}
