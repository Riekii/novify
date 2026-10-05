import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Novify } from '../../services/novify';
import { Artists } from '../modules/artists/artists';
import { Albums } from '../modules/albums/albums';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Artists, Albums],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  serverInfo: any = null;
  nowPlaying: any = null;
  artists: any[] = [];
  albums: any[] = [];
  playlists: any[] = [];
  searchResults: any[] = [];
  errorMessage = '';

  public page: string = 'albums';

  constructor(private readonly novify: Novify) {}

  ngOnInit(): void {
    console.log('Home ngOnInit ejecutado');
    // Carga inicial de datos del servidor para mostrar el estado general de Navidrome.
    this.loadServerInfo();
    // Muestra lo que está sonando en ese momento.
    this.loadNowPlaying();
    // Lista los artistas disponibles en la biblioteca.
    this.loadArtists();
    // Carga las playlists creadas en el servidor.
    this.loadPlaylists();
  }

  // Endpoint: /rest/getServerInfo
  // Devuelve información del servidor: nombre, versión, tipo y estado general.
  loadServerInfo(): void {
    this.novify.getServerInfo().subscribe({
      next: (data) => (this.serverInfo = data),
      error: () => (this.errorMessage = 'No se pudo cargar la información del servidor.'),
    });
  }

  // Endpoint: /rest/getNowPlaying
  // Devuelve lo que se está reproduciendo actualmente.
  loadNowPlaying(): void {
    this.novify.getNowPlaying().subscribe({
      next: (data) => (this.nowPlaying = data),
      error: () => (this.errorMessage = 'No se pudo cargar la reproducción actual.'),
    });
  }

  // Endpoint: /rest/getArtistList2
  // Lista artistas con un tipo específico (alphabetic), útil para explorar la biblioteca.
  loadArtists(): void {
    this.novify.getArtists({ type: 'alphabetic', size: 200 }).subscribe({
      next: (data: any) => {
        this.artists = data?.artistList?.items ?? data?.artists ?? [];
      },
      error: () => (this.errorMessage = 'No se pudieron cargar los artistas.'),
    });
  }

  // Endpoint: /rest/getPlaylists
  // Recupera las playlists públicas o del usuario.
  loadPlaylists(): void {
    this.novify.getPlaylists().subscribe({
      next: (data: any) => {
        this.playlists = data?.playlists?.items ?? data?.playlists ?? [];
      },
      error: () => (this.errorMessage = 'No se pudieron cargar las playlists.'),
    });
  }

  // Endpoint: /rest/search3
  // Busca por texto en la biblioteca: canciones, artistas, álbumes, etc.
  search(query: string): void {
    const value = query.trim();

    if (!value) {
      this.searchResults = [];
      return;
    }

    this.novify.search(value).subscribe({
      next: (data: any) => {
        this.searchResults = data?.searchResult3?.song ?? data?.results ?? [];
      },
      error: () => (this.errorMessage = 'No se pudo realizar la búsqueda.'),
    });
  }
}
