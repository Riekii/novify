import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { routes } from './app.routes';
import { navidromeInterceptor } from './interceptors/navidrome.interceptor';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([navidromeInterceptor])),

  ],
};



