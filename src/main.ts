import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

bootstrapApplication(App, appConfig).then(ref => {
  const library = ref.injector.get(FaIconLibrary);
  library.addIconPacks(fas);
}).catch((err) => console.error(err));