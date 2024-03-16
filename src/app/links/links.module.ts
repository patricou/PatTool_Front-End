import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksComponent } from './links/links.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http } from '@angular/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UrllinkService } from 'app/services/urllink.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [Http]
      }
})
  ],
  declarations: [LinksComponent],
  providers:[UrllinkService]
})
export class LinksModule { }
