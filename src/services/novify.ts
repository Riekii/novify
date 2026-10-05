import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type NavidromeQueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({
  providedIn: 'root',
})
export class Novify {
  private readonly baseUrl = 'http://192.168.1.214:4533';
  private readonly apiBasePath = '/rest';

  constructor(private readonly http: HttpClient) {}

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
    return this.request('getArtistList2', params);
  }

  getArtist(id: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getArtist', { ...params, id });
  }

  getAlbums(params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getAlbumList2', params);
  }

  getAlbum(id: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getAlbum', { ...params, id });
  }

  getSongs(params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getSongList2', params);
  }

  getSong(id: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('getSong', { ...params, id });
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

  search(query: string, params: NavidromeQueryParams = {}): Observable<unknown> {
    return this.request('search3', { ...params, query });
  }

  getStreamUrl(id: string): string {
    return this.buildUrl(`/rest/stream?id=${encodeURIComponent(id)}`);
  }

  getCoverArt(id: string, size = 300): string {
    return this.buildUrl(`/rest/getCoverArt?id=${encodeURIComponent(id)}&size=${size}`);
  }
}
