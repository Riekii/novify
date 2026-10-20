import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerService);
  });

  it('should set the current song when playSong is called', (done) => {
    const song = { id: 'song-1', title: 'Song 1', artist: 'Artist 1' };

    service.currentSong$.subscribe((currentSong) => {
      if (currentSong?.id === 'song-1') {
        expect(currentSong.title).toBe('Song 1');
        done();
      }
    });

    service.playSong(song);
  });
});
