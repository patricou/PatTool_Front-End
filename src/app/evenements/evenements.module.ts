import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { FileUploadModule } from 'ng2-file-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeEvenementsComponent } from './home-evenements/home-evenements.component';
import { EvenementsService } from '../services/evenements.service';
import { CreateEvenementComponent } from './create-evenement/create-evenement.component';
import { ElementEvenementComponent } from './element-evenement/element-evenement.component';
import { UpdateEvenementComponent } from './update-evenement/update-evenement.component';
import { WindowRefService } from '../services/window-ref.service';
import { CommonvaluesService } from '../services/commonvalues.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
	return new TranslateHttpLoader(http);
}

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [Http]
			}
		}),
		NgxMyDatePickerModule,
		FileUploadModule,
		NgbModule.forRoot()
	],
	declarations: [
		HomeEvenementsComponent, CreateEvenementComponent, ElementEvenementComponent, UpdateEvenementComponent
	],
	exports: [HomeEvenementsComponent, CreateEvenementComponent, ElementEvenementComponent, UpdateEvenementComponent
	],
	providers: [
		EvenementsService,
		WindowRefService,
		CommonvaluesService
	]
})
export class EvenementsModule { }
