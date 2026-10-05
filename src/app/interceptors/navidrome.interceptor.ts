import { HttpInterceptorFn } from '@angular/common/http';

const NAVIDROME_BASE_URL = 'http://192.168.1.214:4533';
const NAVIDROME_CONFIG = {
  username: 'rieki',
  password: 'peneman21',
  client: 'novify',
  format: 'json',
  version: '1.16.1',
};

export const navidromeInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(NAVIDROME_BASE_URL) || req.params.has('u')) {
    return next(req);
  }

  const cloned = req.clone({
    setParams: {
      u: NAVIDROME_CONFIG.username,
      p: NAVIDROME_CONFIG.password,
      c: NAVIDROME_CONFIG.client,
      v: NAVIDROME_CONFIG.version,
      f: NAVIDROME_CONFIG.format,
    },
  });

  return next(cloned);
};
