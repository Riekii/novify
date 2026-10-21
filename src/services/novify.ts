import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type NavidromeQueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({
  providedIn: 'root',
})
export class Novify {
  // private baseUrl = window.location.origin+':4533';
  private readonly baseUrl = window.location.origin === 'http://localhost:4200' ? 'http://192.168.1.214:4533' : window.location.origin+':4533';
  private readonly apiBasePath = '/rest';
  private readonly username = 'rieki';
  private readonly password = 'peneman21';

  constructor(private readonly http: HttpClient) {
  }

  buildUrl(path: string): string {
    const normalizedBase = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  private request<T>(endpoint: string, params: NavidromeQueryParams = {}): Observable<T> {
    const safeParams = this.normalizeParams({ ...params, format: 'json' });
    const httpParams = new HttpParams({ fromObject: safeParams });

    return this.http.get<T>(this.buildUrl(`${this.apiBasePath}/${endpoint}`), {
      params: httpParams,
    });
  }

  private normalizeParams(params: NavidromeQueryParams): Record<string, string> {
    const normalized: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      normalized[key] = String(value);
    });

    return normalized;
  }

  ping(): Observable<unknown> {
    return this.request('ping');
  }

  getServerInfo(): Observable<unknown> {
    return this.request('getServerInfo');
  }

  getStatus(): Observable<unknown> {
    return this.request('getStatus');
  }

  getNowPlaying(): Observable<unknown> {
    return this.request('getNowPlaying');
  }

  getArtists(params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getArtistList2', { type: 'alphabetic', ...params });
  }

  getArtist(id: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getArtist', { ...params, id });
  }

  getAlbums(params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getAlbumList2', { type: 'alphabeticalByName', ...params });
  }

  getAlbum(id: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getAlbum', { ...params, id });
  }

  getSongs(params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('search3', params);
  }

  getSong(id: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getSong', { ...params, id });
  }

  getRandomSongs(params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getRandomSongs', { size: 1, ...params });
  }

  getGenres(params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getGenres', params);
  }

  getPlaylists(params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getPlaylists', params);
  }

  getPlaylist(id: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getPlaylist', { ...params, id });
  }

  createPlaylist(name: string): Observable<unknown> {
    return this.request('createPlaylist', { name });
  }

  addSongToPlaylist(playlistId: string, songId: string): Observable<unknown> {
    return this.request('updatePlaylist', { playlistId, songIdToAdd: songId });
  }

  search(query: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('search3', { ...params, query });
  }

  getStreamUrl(id: string, params: NavidromeQueryParams = {}): string {
    const query = new URLSearchParams({
      id,
      u: this.username,
      p: this.password,
      c: 'novify',
      v: '1.16.1',
      ...params,
    }).toString();
    return `${this.buildUrl('/rest/stream')}?${query}`;
  }

  getDownloadUrl(id: string): string {
    const query = new URLSearchParams({
      id,
      u: this.username,
      p: this.password,
      c: 'novify',
      v: '1.16.1',
    }).toString();
    return `${this.buildUrl('/rest/download')}?${query}`;
  }

  getCoverArt(
    id: string,
    size = 300
  ): Observable<Blob> {

    const params = new HttpParams()
      .set('id', id)
      .set('size', size);

    return this.http.get(
      this.buildUrl(`${this.apiBasePath}/getCoverArt`),
      {
        params,
        responseType: 'blob'
      }
    );
  }




}
