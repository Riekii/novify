import { TestBed } from '@angular/core/testing';

import { Novify } from './novify';

describe('Novify', () => {
  let service: Novify;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Novify);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose Navidrome endpoint helpers', () => {
    expect(typeof service.getServerInfo).toBe('function');
    expect(typeof service.getNowPlaying).toBe('function');
    expect(typeof service.getArtists).toBe('function');
    expect(typeof service.getAlbums).toBe('function');
    expect(typeof service.search).toBe('function');
    expect(service.buildUrl('/rest/ping')).toContain('http://192.168.1.214:4533/rest/ping');
  });
});
