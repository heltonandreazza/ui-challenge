import '../polyfills'; // should be loaded first so the app can use the es6/es7/zonejs features

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);